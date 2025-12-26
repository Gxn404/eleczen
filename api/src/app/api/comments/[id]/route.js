import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import Comment from "../../../lib/models/Comment";
import { auth } from "../../../lib/auth/auth";

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     tags:
 *       - Comments
 *     summary: Update a comment
 *     description: Update comment content. Requires authentication and ownership.
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
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated comment
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - not the owner
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
export async function PUT(request, { params }) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const { content } = await request.json();

        if (!content) {
            return NextResponse.json({ message: "Content is required" }, { status: 400 });
        }

        await dbConnect();

        const comment = await Comment.findById(id);
        if (!comment) {
            return NextResponse.json({ message: "Comment not found" }, { status: 404 });
        }

        if (comment.author.toString() !== session.user.id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        comment.content = content;
        await comment.save();

        return NextResponse.json(comment);
    } catch (error) {
        console.error("Error updating comment:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     tags:
 *       - Comments
 *     summary: Delete a comment
 *     description: Delete a comment. Requires authentication and ownership or admin role.
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
 *         description: Comment deleted
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - not the owner
 *       404:
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

        const comment = await Comment.findById(id);
        if (!comment) {
            return NextResponse.json({ message: "Comment not found" }, { status: 404 });
        }

        if (comment.author.toString() !== session.user.id && session.user.role !== 'admin') {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await Comment.findByIdAndDelete(id);

        return NextResponse.json({ message: "Comment deleted" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
