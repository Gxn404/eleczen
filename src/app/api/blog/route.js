import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import { auth } from "@/auth";

export async function GET(request) {
    try {
        await dbConnect();
        const posts = await Post.find({ published: true })
            .populate("author", "name image")
            .sort({ createdAt: -1 });
        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await auth();
        if (!session) { // Add role check if needed, e.g., session.user.role !== 'admin'
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        await dbConnect();

        const post = await Post.create({
            ...body,
            author: session.user.id || session.user._id,
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
