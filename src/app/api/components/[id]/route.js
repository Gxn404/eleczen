import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Component from "@/models/Component";
import { auth } from "@/auth";

/**
 * @swagger
 * /api/components/{id}:
 *   get:
 *     tags:
 *       - Components
 *     summary: Get a single component
 *     description: Retrieve a component by ID or slug
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Component ID or slug
 *     responses:
 *       200:
 *         description: Component details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Component'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
export async function GET(request, { params }) {
    try {
        const { id } = params;
        await dbConnect();

        let component;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            component = await Component.findById(id);
        } else {
            component = await Component.findOne({ slug: id });
        }

        if (!component) {
            return NextResponse.json({ message: "Component not found" }, { status: 404 });
        }

        return NextResponse.json(component);
    } catch (error) {
        console.error("Error fetching component:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/components/{id}:
 *   put:
 *     tags:
 *       - Components
 *     summary: Update a component
 *     description: Update component details. Requires admin authentication.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Component'
 *     responses:
 *       200:
 *         description: Updated component
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
export async function PUT(request, { params }) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const body = await request.json();
        await dbConnect();

        let component = await Component.findById(id);
        if (!component && !id.match(/^[0-9a-fA-F]{24}$/)) {
            component = await Component.findOne({ slug: id });
        }

        if (!component) {
            return NextResponse.json({ message: "Component not found" }, { status: 404 });
        }

        Object.assign(component, body);
        await component.save();

        return NextResponse.json(component);
    } catch (error) {
        console.error("Error updating component:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/components/{id}:
 *   delete:
 *     tags:
 *       - Components
 *     summary: Delete a component
 *     description: Delete a component. Requires admin authentication.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Component deleted
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
export async function DELETE(request, { params }) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        await dbConnect();

        let component = await Component.findById(id);
        if (!component && !id.match(/^[0-9a-fA-F]{24}$/)) {
            component = await Component.findOne({ slug: id });
        }

        if (!component) {
            return NextResponse.json({ message: "Component not found" }, { status: 404 });
        }

        await Component.findByIdAndDelete(component._id);

        return NextResponse.json({ message: "Component deleted" });
    } catch (error) {
        console.error("Error deleting component:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
