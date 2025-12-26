import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Component from "@/models/Component";
import { auth } from "@/auth";

/**
 * @swagger
 * /api/components:
 *   get:
 *     tags:
 *       - Components
 *     summary: Get all components
 *     description: Retrieve a list of all available electronic components
 *     responses:
 *       200:
 *         description: List of components
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Component'
 *       500:
 *         $ref: '#/components/responses/NotFoundError'
 */
export async function GET(request) {
    try {
        await dbConnect();
        const components = await Component.find({}).sort({ name: 1 });
        return NextResponse.json(components);
    } catch (error) {
        console.error("Error fetching components:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/components:
 *   post:
 *     tags:
 *       - Components
 *     summary: Create a new component
 *     description: Add a new component to the global library. Requires admin authentication.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 example: "NE555"
 *               type:
 *                 type: string
 *                 enum: [resistor, capacitor, inductor, diode, transistor, ic, subckt]
 *                 example: "ic"
 *               category:
 *                 type: string
 *                 example: "ICs/Timer"
 *               metadata:
 *                 type: object
 *                 properties:
 *                   description:
 *                     type: string
 *                   manufacturer:
 *                     type: string
 *                   datasheet:
 *                     type: string
 *                     format: uri
 *     responses:
 *       201:
 *         description: Component created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Component'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/NotFoundError'
 */
export async function POST(request) {
    try {
        const session = await auth();
        // Assuming only admin can add components to the global library
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        await dbConnect();

        const component = await Component.create(body);

        return NextResponse.json(component, { status: 201 });
    } catch (error) {
        console.error("Error creating component:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
