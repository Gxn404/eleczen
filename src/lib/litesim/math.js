/**
 * Lightweight Matrix Math Library for Circuit Solver
 * Handles basic matrix operations and Gaussian Elimination.
 */

export const Matrix = {
    /**
     * Creates a zero-filled matrix of size rows x cols
     */
    zeros: (rows, cols) => {
        return Array.from({ length: rows }, () => Array(cols).fill(0));
    },

    /**
     * Solves Ax = b using Gaussian Elimination with partial pivoting.
     * @param {Array<Array<number>>} A - Coefficient matrix (n x n)
     * @param {Array<number>} b - Constant vector (n)
     * @returns {Array<number>} Solution vector x
     */
    solve: (A, b) => {
        const n = A.length;
        // Deep copy to avoid modifying originals
        const M = A.map(row => [...row]);
        const x = [...b];

        // Forward Elimination
        for (let i = 0; i < n; i++) {
            // Pivot selection
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) {
                    maxRow = k;
                }
            }

            // Swap rows
            [M[i], M[maxRow]] = [M[maxRow], M[i]];
            [x[i], x[maxRow]] = [x[maxRow], x[i]];

            // Check for singular matrix
            if (Math.abs(M[i][i]) < 1e-10) {
                // console.warn("Matrix is singular or near-singular.");
                return null; // Cannot solve
            }

            // Eliminate
            for (let k = i + 1; k < n; k++) {
                const factor = M[k][i] / M[i][i];
                x[k] -= factor * x[i];
                for (let j = i; j < n; j++) {
                    M[k][j] -= factor * M[i][j];
                }
            }
        }

        // Back Substitution
        const result = new Array(n).fill(0);
        for (let i = n - 1; i >= 0; i--) {
            let sum = 0;
            for (let j = i + 1; j < n; j++) {
                sum += M[i][j] * result[j];
            }
            result[i] = (x[i] - sum) / M[i][i];
        }

        return result;
    }
};
