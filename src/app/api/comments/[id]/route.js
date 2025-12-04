import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Comment from "@/models/Comment";
import { auth } from "@/auth";

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

        // Check ownership or admin role
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

        // Check ownership
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
