import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import Circuit from "../../../lib/models/Circuit";
import { auth } from "../../../lib/auth/auth";

/**
 * @swagger
 * /api/circuits/{id}:
 *   get:
 *     tags:
 *       - Circuits
 *     summary: Get a single circuit
 *     description: Retrieve a circuit by ID. Public circuits are accessible to all, private circuits require ownership.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Circuit ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Circuit details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Circuit'
 *       403:
 *         description: Forbidden - private circuit
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/NotFoundError'
 */
export async function GET(request, { params }) {
    try {
        const { id } = params;
        await dbConnect();

        const circuit = await Circuit.findById(id).populate("author", "name image");

        if (!circuit) {
            return NextResponse.json({ message: "Circuit not found" }, { status: 404 });
        }

        // Check visibility
        const session = await auth();
        if (!circuit.isPublic) {
            if (!session || circuit.author._id.toString() !== session.user.id) {
                return NextResponse.json({ message: "Forbidden" }, { status: 403 });
            }
        }

        return NextResponse.json(circuit);
    } catch (error) {
        console.error("Error fetching circuit:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/circuits/{id}:
 *   put:
 *     tags:
 *       - Circuits
 *     summary: Update a circuit
 *     description: Update an existing circuit. Requires authentication and ownership.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Circuit ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *               data:
 *                 type: object
 *                 description: Circuit schematic data
 *     responses:
 *       200:
 *         description: Updated circuit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Circuit'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - not the owner
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/NotFoundError'
 */
export async function PUT(request, { params }) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const body = await request.json();
        await dbConnect();

        const circuit = await Circuit.findById(id);
        if (!circuit) {
            return NextResponse.json({ message: "Circuit not found" }, { status: 404 });
        }

        // Check ownership
        if (circuit.author.toString() !== session.user.id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        Object.assign(circuit, body);
        await circuit.save();

        return NextResponse.json(circuit);
    } catch (error) {
        console.error("Error updating circuit:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/circuits/{id}:
 *   delete:
 *     tags:
 *       - Circuits
 *     summary: Delete a circuit
 *     description: Delete a circuit. Requires authentication and ownership or admin role.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Circuit ID
 *     responses:
 *       200:
 *         description: Circuit deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Circuit deleted"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - not the owner
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/NotFoundError'
 */
export async function DELETE(request, { params }) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        await dbConnect();

        const circuit = await Circuit.findById(id);
        if (!circuit) {
            return NextResponse.json({ message: "Circuit not found" }, { status: 404 });
        }

        // Check ownership
        if (circuit.author.toString() !== session.user.id && session.user.role !== 'admin') {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await Circuit.findByIdAndDelete(id);

        return NextResponse.json({ message: "Circuit deleted" });
    } catch (error) {
        console.error("Error deleting circuit:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
