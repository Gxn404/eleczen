import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Comment from "@/models/Comment";
import { auth } from "@/auth";

/**
 * @swagger
 * /api/comments:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Get comments for a blog post
 *     description: Retrieve all comments for a specific blog post
 *     parameters:
 *       - in: query
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blog post
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   content:
 *                     type: string
 *                   post:
 *                     type: string
 *                   author:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       image:
 *                         type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/NotFoundError'
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get("postId");

        if (!postId) {
            return NextResponse.json(
                { message: "Post ID is required" },
                { status: 400 }
            );
        }

        await dbConnect();
        const comments = await Comment.find({ post: postId })
            .populate("author", "name image")
            .sort({ createdAt: -1 });

        return NextResponse.json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * @swagger
 * /api/comments:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Create a new comment
 *     description: Add a comment to a blog post. Requires authentication.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - postId
 *             properties:
 *               content:
 *                 type: string
 *                 description: Comment text
 *                 example: "Great article! Very helpful."
 *               postId:
 *                 type: string
 *                 description: ID of the blog post
 *                 example: "507f1f77bcf86cd799439011"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 content:
 *                   type: string
 *                 post:
 *                   type: string
 *                 author:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     image:
 *                       type: string
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/NotFoundError'
 */
export async function POST(request) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { content, postId } = await request.json();

        if (!content || !postId) {
            return NextResponse.json(
                { message: "Content and Post ID are required" },
                { status: 400 }
            );
        }

        await dbConnect();
        const comment = await Comment.create({
            content,
            post: postId,
            author: session.user.id || session.user._id, // Handle different session structures
        });

        const populatedComment = await Comment.findById(comment._id).populate(
            "author",
            "name image"
        );

        return NextResponse.json(populatedComment, { status: 201 });
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
