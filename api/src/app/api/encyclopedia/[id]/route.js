import dbConnect from "../../../lib/db";
import Component from "../../../lib/models/Component";
import { NextResponse } from "next/server";
import { auth } from "../../../lib/auth/auth";

export const dynamic = "force-dynamic";

/**
 * @swagger
 * /api/encyclopedia/{id}:
 *   put:
 *     tags:
 *       - Encyclopedia
 *     summary: Update encyclopedia entry
 *     description: Update an encyclopedia entry. Requires authentication.
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
 *             type: object
 *     responses:
 *       200:
 *         description: Updated entry
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
export async function PUT(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await dbConnect();

  try {
    const body = await request.json();
    const component = await Component.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!component) {
      return NextResponse.json(
        { error: "Component not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: component });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}

/**
 * @swagger
 * /api/encyclopedia/{id}:
 *   delete:
 *     tags:
 *       - Encyclopedia
 *     summary: Delete encyclopedia entry
 *     description: Delete an encyclopedia entry. Requires authentication.
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
 *         description: Entry deleted
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await dbConnect();

  try {
    const deletedComponent = await Component.findByIdAndDelete(id);
    if (!deletedComponent) {
      return NextResponse.json(
        { error: "Component not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}
