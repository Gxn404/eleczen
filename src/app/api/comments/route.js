import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Comment from "@/models/Comment";
import { auth } from "@/auth";

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
