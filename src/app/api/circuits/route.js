import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Circuit from "@/models/Circuit";
import { auth } from "@/auth";

/**
 * @swagger
 * /api/circuits:
 *   get:
 *     summary: Retrieve a list of circuits
 *     description: Retrieve a list of circuits, optionally filtered by user ID or public status.
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: The ID of the user to filter circuits by
 *       - in: query
 *         name: public
 *         schema:
 *           type: boolean
 *         description: Filter for public circuits only
 *     responses:
 *       200:
 *         description: A list of circuits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   isPublic:
 *                     type: boolean
 *                   author:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       image:
 *                         type: string
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new circuit
 *     description: Create a new circuit. Requires authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - data
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *               data:
 *                 type: object
 *     responses:
 *       201:
 *         description: The created circuit
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const publicOnly = searchParams.get("public") === 'true';

    await dbConnect();

    let query = {};
    if (userId) {
      query.author = userId;
    } else if (publicOnly) {
      query.isPublic = true;
    } else {
      // Default: show public circuits
      query.isPublic = true;
    }

    const circuits = await Circuit.find(query)
      .populate("author", "name image")
      .sort({ updatedAt: -1 });

    return NextResponse.json(circuits);
  } catch (error) {
    console.error("Error fetching circuits:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    await dbConnect();

    const circuit = await Circuit.create({
      ...body,
      author: session.user.id || session.user._id,
    });

    return NextResponse.json(circuit, { status: 201 });
  } catch (error) {
    console.error("Error creating circuit:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
