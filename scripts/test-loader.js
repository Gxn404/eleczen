import { parseLibContent } from '../src/lib/litesim/loader/parser.js';
import { ModelStore } from '../src/lib/litesim/loader/store.js';

const sampleLib = `
* Generic Diode
.model D1N4148 D (Is=2.682n N=1.836 Rs=.5664 Xti=3 Eg=1.11 Cjo=4p
+ M=.3333 Vj=.5 Fc=.5 Bv=100 Ibv=100u Tt=11.54n)

* Subcircuit OpAmp
.subckt OPAMP_IDEAL 1 2 3
* Nodes: 1=In+, 2=In-, 3=Out
Rin 1 2 10Meg
E1 3 0 1 2 100k
.ends

* Global Param
.param TEMP=27
`;

console.log("Testing Model Loader...");

const store = new ModelStore();
store.addLibrary(sampleLib, 'test.lib');

const d1 = store.getModel('D1N4148');
if (d1 && d1.type === 'D' && d1.params.is === 2.682e-9) {
    console.log("✅ Model D1N4148 parsed correctly");
} else {
    console.error("❌ Model D1N4148 failed", d1);
}

const op = store.getSubckt('OPAMP_IDEAL');
if (op && op.nodes.length === 3) {
    console.log("✅ Subckt OPAMP_IDEAL parsed correctly");
} else {
    console.error("❌ Subckt OPAMP_IDEAL failed", op);
}

const globals = store.getAllGlobals();
if (globals.length === 1 && globals[0].includes('TEMP=27')) {
    console.log("✅ Global params parsed correctly");
} else {
    console.error("❌ Global params failed", globals);
}
