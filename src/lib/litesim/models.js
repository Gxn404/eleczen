/**
 * Component Models for MNA Solver
 * Defines how components stamp the matrix and calculate currents/updates.
 */

export const Models = {
    resistor: {
        type: 'passive',
        stamp: (matrix, nodes, comp) => {
            const p1 = nodes.p1;
            const p2 = nodes.p2;
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
            const pos = nodes.pos;
            const neg = nodes.neg;
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
            // Internal Resistance: V_pos - V_neg + I*R_int = V
            // So +I*R_int term goes into (idx, idx)
            matrix[idx][idx] += R_int;

            rhs[idx] = V;
        },
        calculateState: (vDiff, i, p) => ({ voltage: vDiff, current: i, power: p })
    },

    led: {
        type: 'diode',
        stamp: (matrix, rhs, nodes, comp, vDiff = 0) => {
            const anode = nodes.anode;
            const cathode = nodes.cathode;

            const Vf = 1.8;
            const Rs = 10; // 10 Ohm series resistance

            let G = 1e-9;
            let I_eq = 0;

            if (vDiff > Vf) {
                G = 1 / Rs;
                I_eq = -Vf / Rs;
            }

            if (anode !== undefined) {
                matrix[anode][anode] += G;
                rhs[anode] -= I_eq;
            }
            if (cathode !== undefined) {
                matrix[cathode][cathode] += G;
                rhs[cathode] += I_eq;
            }
            if (anode !== undefined && cathode !== undefined) {
                matrix[anode][cathode] -= G;
                matrix[cathode][anode] -= G;
            }
        },
        calculateState: (vDiff) => {
            const Vf = 1.8;
            const active = vDiff > Vf;
            const brightness = active ? Math.min(1, Math.max(0, (vDiff - Vf) / 1.0)) : 0;
            return { active, brightness, voltage: vDiff };
        }
    },

    transistor: {
        type: 'bjt',
        // NPN Model (PWL)
        stamp: (matrix, rhs, nodes, comp, vBE = 0, vCE = 0) => {
            const B = nodes.base;
            const C = nodes.collector;
            const E = nodes.emitter;

            const Beta = parseFloat(comp.properties?.beta || 100);

            // 1. Base-Emitter PWL
            const Vbe_on = 0.7;
            const R_be = 1000; // 1k input impedance
            let G_be = 1e-9;
            let I_be_eq = 0;

            if (vBE > Vbe_on) {
                G_be = 1 / R_be;
                I_be_eq = -Vbe_on / R_be;
            }

            // Stamp BE
            if (B !== undefined) { matrix[B][B] += G_be; rhs[B] -= I_be_eq; }
            if (E !== undefined) { matrix[E][E] += G_be; rhs[E] += I_be_eq; }
            if (B !== undefined && E !== undefined) {
                matrix[B][E] -= G_be;
                matrix[E][B] -= G_be;
            }

            // 2. Collector Current Source (VCCS)
            // Ic = Beta * Ib
            // Ib = G_be * vBE + I_be_eq
            // Ic = (Beta * G_be) * vBE + (Beta * I_be_eq)

            const gm = Beta * G_be;
            const I_c_eq = Beta * I_be_eq;

            if (C !== undefined) {
                if (B !== undefined) matrix[C][B] += gm;
                if (E !== undefined) matrix[C][E] -= gm;
                rhs[C] -= I_c_eq;
            }
            if (E !== undefined) {
                if (B !== undefined) matrix[E][B] -= gm;
                if (E !== undefined) matrix[E][E] += gm;
                rhs[E] += I_c_eq;
            }

            // Gmin for stability
            const gmin = 1e-9;
            if (C !== undefined) matrix[C][C] += gmin;
            if (E !== undefined) matrix[E][E] += gmin;
            if (B !== undefined) matrix[B][B] += gmin;
        },
        calculateState: (vDiff, i, p, vBE, vCE) => ({
            active: vBE > 0.6,
            vBE, vCE
        })
    },

    mosfet: {
        type: 'mosfet',
        // NMOS Model
        stamp: (matrix, rhs, nodes, comp, vGS = 0, vDS = 0) => {
            const G = nodes.gate;
            const D = nodes.drain;
            const S = nodes.source;

            const K = parseFloat(comp.properties?.k || 0.1); // Transconductance parameter
            const Vth = parseFloat(comp.properties?.vth || 2.0);

            // Quadratic model
            let gm = 0;
            let Id_eq = 0;

            if (vGS > Vth) {
                gm = 2 * K * (vGS - Vth);
                const Id = K * Math.pow(vGS - Vth, 2);
                Id_eq = Id - gm * vGS;
            }

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

            // Gmin for stability (prevent singular matrix if floating)
            const gmin = 1e-9;
            if (D !== undefined) matrix[D][D] += gmin;
            if (S !== undefined) matrix[S][S] += gmin;
            if (G !== undefined) matrix[G][G] += gmin;
        },
        calculateState: (vDiff, i, p, vGS, vDS) => ({
            active: vGS > 2.0,
            vGS, vDS
        })
    },

    switch: {
        type: 'passive',
        stamp: (matrix, nodes, comp) => {
            const p1 = nodes.in;
            const p2 = nodes.out;
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