/**
 * Component Models for MNA Solver
 * Defines how components stamp the matrix and calculate currents/updates.
 */

export const Models = {
    resistor: {
        type: 'passive',
        stamp: (matrix, nodes, comp) => {
            const p1 = nodes[comp.ports.p1];
            const p2 = nodes[comp.ports.p2];
            const R = parseFloat(comp.properties?.resistance || 1000);
            const G = 1 / Math.max(R, 1e-6);

            if (p1 !== undefined) matrix[p1][p1] += G;
            if (p2 !== undefined) matrix[p2][p2] += G;
            if (p1 !== undefined && p2 !== undefined) {
                matrix[p1][p2] -= G;
                matrix[p2][p1] -= G;
            }
        },
        calculateState: (vDiff, i, p) => ({ voltage: vDiff, current: i, power: p })
    },

    battery: {
        type: 'voltage_source',
        stamp: (matrix, rhs, nodes, comp, sourceIndex, offset) => {
            const pos = nodes[comp.ports.pos];
            const neg = nodes[comp.ports.neg];
            const idx = offset + sourceIndex;
            const V = parseFloat(comp.properties?.voltage || 9);
            const R_int = parseFloat(comp.properties?.internalResistance || 0.1); // 0.1 Ohm default

            if (pos !== undefined) {
                matrix[pos][idx] += 1;
                matrix[idx][pos] += 1;
            }
            if (neg !== undefined) {
                matrix[neg][idx] -= 1;
                matrix[idx][neg] -= 1;
            }
            // Internal Resistance: V_pos - V_neg - I*R_int = V
            // So -I*R_int term goes into (idx, idx)
            matrix[idx][idx] -= R_int;

            rhs[idx] = V;
        },
        calculateState: (vDiff, i, p) => ({ voltage: vDiff, current: i, power: p })
    },

    led: {
        type: 'diode',
        stamp: (matrix, rhs, nodes, comp, vDiff = 0) => {
            const anode = nodes[comp.ports.anode];
            const cathode = nodes[comp.ports.cathode];

            const Is = 1e-12;
            const Vt = 0.026;
            // Limit voltage for stability
            const Vd = Math.max(-5, Math.min(vDiff, 3));

            const G_eq = (Is / Vt) * Math.exp(Vd / Vt);
            const I_diode = Is * (Math.exp(Vd / Vt) - 1);
            const I_eq = I_diode - G_eq * Vd;

            if (anode !== undefined) {
                matrix[anode][anode] += G_eq;
                rhs[anode] -= I_eq;
            }
            if (cathode !== undefined) {
                matrix[cathode][cathode] += G_eq;
                rhs[cathode] += I_eq;
            }
            if (anode !== undefined && cathode !== undefined) {
                matrix[anode][cathode] -= G_eq;
                matrix[cathode][anode] -= G_eq;
            }
        },
        calculateState: (vDiff) => {
            const Vf = 1.8;
            const active = vDiff > Vf;
            // Brightness based on current would be better, but vDiff proxy is okay for now
            // Let's use a smoother curve
            const brightness = active ? Math.min(1, Math.max(0, (vDiff - Vf) / 1.0)) : 0;
            return { active, brightness, voltage: vDiff };
        }
    },

    transistor: {
        type: 'bjt',
        // NPN Model (Simplified Ebers-Moll / Linearized Hybrid-Pi)
        // Ports: base (B), collector (C), emitter (E)
        // V_be controls I_c
        stamp: (matrix, rhs, nodes, comp, vBE = 0, vCE = 0) => {
            const B = nodes[comp.ports.base];
            const C = nodes[comp.ports.collector];
            const E = nodes[comp.ports.emitter];

            const Beta = parseFloat(comp.properties?.beta || 100);
            const Is = 1e-12;
            const Vt = 0.026;

            // 1. Base-Emitter Diode
            const Vbe_lim = Math.max(-5, Math.min(vBE, 2));
            const G_be = (Is / Vt) * Math.exp(Vbe_lim / Vt);
            const I_be_eq = Is * (Math.exp(Vbe_lim / Vt) - 1) - G_be * Vbe_lim;

            // Stamp BE Diode
            if (B !== undefined) { matrix[B][B] += G_be; rhs[B] -= I_be_eq; }
            if (E !== undefined) { matrix[E][E] += G_be; rhs[E] += I_be_eq; }
            if (B !== undefined && E !== undefined) {
                matrix[B][E] -= G_be;
                matrix[E][B] -= G_be;
            }

            // 2. Collector Current Source (VCCS)
            // I_c = Beta * I_b (Active Region)
            // I_b approx G_be * V_be
            // So I_c = Beta * G_be * V_be => Transconductance gm = Beta * G_be
            const gm = Beta * G_be;

            // Current flows C -> E, controlled by B - E
            // C node: +gm*(Vb - Ve) -> +gm*Vb, -gm*Ve
            // E node: -gm*(Vb - Ve) -> -gm*Vb, +gm*Ve

            if (C !== undefined) {
                if (B !== undefined) matrix[C][B] += gm;
                if (E !== undefined) matrix[C][E] -= gm;
            }
            if (E !== undefined) {
                if (B !== undefined) matrix[E][B] -= gm;
                if (E !== undefined) matrix[E][E] += gm;
            }

            // Add Output Conductance (Early Effect) - Optional but helps stability
            const go = 1e-5;
            if (C !== undefined) matrix[C][C] += go;
            if (E !== undefined) matrix[E][E] += go;
            if (C !== undefined && E !== undefined) {
                matrix[C][E] -= go;
                matrix[E][C] -= go;
            }
        },
        calculateState: (vDiff, i, p, vBE, vCE) => ({
            active: vBE > 0.6,
            vBE, vCE
        })
    },

    mosfet: {
        type: 'mosfet',
        // NMOS Model
        // Ports: gate (G), drain (D), source (S)
        stamp: (matrix, rhs, nodes, comp, vGS = 0, vDS = 0) => {
            const G = nodes[comp.ports.gate];
            const D = nodes[comp.ports.drain];
            const S = nodes[comp.ports.source];

            const K = parseFloat(comp.properties?.k || 0.1); // Transconductance parameter
            const Vth = parseFloat(comp.properties?.vth || 2.0);

            // Linearized Drain Current I_d
            // If Vgs < Vth, Id = 0
            // If Vgs > Vth, Id = K * (Vgs - Vth)^2 (Saturation)
            // gm = dId/dVgs = 2*K*(Vgs - Vth)

            let gm = 0;
            let Id_eq = 0;

            if (vGS > Vth) {
                gm = 2 * K * (vGS - Vth);
                const Id = K * Math.pow(vGS - Vth, 2);
                Id_eq = Id - gm * vGS;
            }

            // Stamp VCCS (Drain -> Source controlled by Gate -> Source)
            // D: +gm(Vg - Vs)
            // S: -gm(Vg - Vs)

            if (D !== undefined) {
                if (G !== undefined) matrix[D][G] += gm;
                if (S !== undefined) matrix[D][S] -= gm;
                rhs[D] -= Id_eq;
            }
            if (S !== undefined) {
                if (G !== undefined) matrix[S][G] -= gm;
                if (S !== undefined) matrix[S][S] += gm;
                rhs[S] += Id_eq;
            }
        },
        calculateState: (vDiff, i, p, vGS, vDS) => ({
            active: vGS > 2.0,
            vGS, vDS
        })
    },

    switch: {
        type: 'passive',
        stamp: (matrix, nodes, comp) => {
            const p1 = nodes[comp.ports.in];
            const p2 = nodes[comp.ports.out];
            // Open: Very high resistance (low G)
            // Closed: Very low resistance (high G)
            const R = comp.state?.on ? 0.001 : 1e9;
            const G = 1 / R;

            if (p1 !== undefined) matrix[p1][p1] += G;
            if (p2 !== undefined) matrix[p2][p2] += G;
            if (p1 !== undefined && p2 !== undefined) {
                matrix[p1][p2] -= G;
                matrix[p2][p1] -= G;
            }
        },
        calculateState: (vDiff) => ({ voltage: vDiff })
    }
};