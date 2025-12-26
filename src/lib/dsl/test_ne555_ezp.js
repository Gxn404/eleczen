
import { parseEZP, generateEZP } from './ezp.js';
import { generateNetlist } from '../litesim/converter.js'; // Assuming direct import works in your environment
import { globalModelStore } from '../litesim/modelStore.js';
import fs from 'fs';
import path from 'path';

// 1. Load NE555 Definitions (Mocking file read for this test context or reading from known path)
// In a real scenario, this would be loaded via the Library Manager.
// We'll manually register it here to simulate it being "known".

const ne555_ezl = `
library "NE555"
    version "1.0.0"

    submodel <<EOF
        .subckt NE555 1 2 3 4 5 6 7 8
        A1 N001 2 1 1 1 1 N003 1 SCHMITT Vt=0 Vh=1m
        R1 N001 1 5K
        R2 5 N001 5K
        R3 8 5 5K
        S1 1 7 N007 1 D
        A2 N011 N003 1 1 1 1 N008 1 SRFLOP Trise=100n tripdt=10n
        A3 6 5 1 1 1 1 N012 1 SCHMITT Vt=0 Vh=1m
        S2 8 3 N009 1 O
        S3 3 1 1 N009 O
        A6 1 N006 1 N008 1 1 N007 1 OR Ref=.5 Vlow=-1 Trise=100n
        R7 8 1 4K
        R9 2 1 1G
        R10 6 1 1G
        A4 1 N008 1 N006 1 N009 1 1 OR ref=.5 Vlow=-1 Trise=100n
        A5 4 1 1 1 1 N006 1 1 SCHMITT Vt=.7 Vh=1m
        D1 4 1 DR
        A7 1 N006 1 N012 1 1 N011 1 OR
        D2 8 4 400uA
        .model DR D(Ron=150K Roff=1T Vfwd=1.6)
        .model O SW(Ron=6 Roff=1Meg Vt=0 Vh=-.8)
        .model D SW(Ron=6 Roff=.75G Vt=.5 Vh=-.4)
        .model 400uA D(Ron=1K Ilimit=400u epsilon=.5)
        .ends NE555
    EOF
end
`;

// Helper to manually register the subcircuit from the EZL content
// A real loader would parse the EZL structure. We'll just grab the submodel block content.
const submodelContent = ne555_ezl.split('<<EOF')[1].split('EOF')[0].trim();
globalModelStore.registerModel('NE555', submodelContent, 'subckt');


// 2. define the EZP content using the NE555 component
const ezpContent = `project "NE555 Astable"
    version "1.0.0"

    component "U1"
        type NE555
        x 200
        y 200
        properties
            model "NE555"
        end
        customPorts ["GND", "TRIG", "OUT", "RST", "CV", "THRS", "DIS", "Vcc"]
    end

    component "R1"
        type resistor
        x 100
        y 100
        properties
            resistance "1k"
        end
    end

    component "R2"
        type resistor
        x 100
        y 150
        properties
            resistance "10k"
        end
    end

    component "C1"
        type capacitor
        x 100
        y 200
        properties
            capacitance "10u"
        end
    end

    component "V1"
        type battery
        x 50
        y 200
        properties
            voltage "5"
        end
    end

    # Connections for Astable Multivibrator
    
    # Vcc to R1, Vcc to V1(+)
    wire "w_vcc_r1"
        fromComp "V1" fromPort "pos"
        toComp "R1" toPort "p1"
    end
    
    wire "w_vcc_u1"
        fromComp "V1" fromPort "pos"
        toComp "U1" toPort "Vcc"
    end
    
    wire "w_vcc_rst"
        fromComp "V1" fromPort "pos"
        toComp "U1" toPort "RST"
    end

    # R1 to R2, R1 to DIS
    wire "w_r1_r2"
        fromComp "R1" fromPort "p2"
        toComp "R2" toPort "p1"
    end

    wire "w_r1_dis"
        fromComp "R1" fromPort "p2"
        toComp "U1" toPort "DIS"
    end

    # R2 to C1, R2 to THRS, R2 to TRIG
    wire "w_r2_c1"
        fromComp "R2" fromPort "p2"
        toComp "C1" toPort "p1"
    end
    
    wire "w_r2_thrs"
        fromComp "R2" fromPort "p2"
        toComp "U1" toPort "THRS"
    end

    wire "w_r2_trig"
        fromComp "R2" fromPort "p2"
        toComp "U1" toPort "TRIG"
    end

    # GND Connections
    wire "w_gnd_v1"
        fromComp "V1" fromPort "neg"
        toComp "C1" toPort "p2"
    end

    wire "w_gnd_u1"
        fromComp "V1" fromPort "neg"
        toComp "U1" toPort "GND"
    end

end`;


console.log("=== 1. Parsing NE555 Project ===");
const project = parseEZP(ezpContent);
console.log(`Parsed ${project.components.length} components and ${project.wires.length} wires.`);
if (project.components[0]) {
    console.log(`U1 customPorts:`, project.components[0].customPorts);
}

console.log("\n=== 2. Generating Netlist ===");
const { netlist, nodeMap } = generateNetlist(project.components, project.wires);

console.log("--- Netlist Begin ---");
console.log(netlist);
console.log("--- Netlist End ---");

// Verification
const expectedLines = [
    'XU1', // The subcircuit instance
    'RR1', 'RR2', 'CC1', 'VV1', // Passives
    '.subckt NE555' // The model definition included
];

const missing = expectedLines.filter(l => !netlist.includes(l));

if (missing.length > 0) {
    console.error("FAILED: Missing expected lines in netlist:", missing);
    process.exit(1);
} else {
    console.log("SUCCESS: Netlist contains all expected components and model definitions.");
}
