import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import { auth } from "@/auth";

export async function GET(request, { params }) {
    try {
        const { id } = params;
        await dbConnect();

        // Try finding by ID first, then slug
        let post;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            post = await Post.findById(id).populate("author", "name image");
        } else {
            post = await Post.findOne({ slug: id }).populate("author", "name image");
        }

        if (!post) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error("Error fetching post:", error);
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
        const body = await request.json();
        await dbConnect();

        let post = await Post.findById(id);
        if (!post) {
            // Try slug if ID lookup fails (though usually PUT uses ID)
            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                post = await Post.findOne({ slug: id });
            }
        }

        if (!post) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        // Check ownership
        if (post.author.toString() !== session.user.id && session.user.role !== 'admin') {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        Object.assign(post, body);
        await post.save();

        return NextResponse.json(post);
    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        await dbConnect();

        let post = await Post.findById(id);
        if (!post && !id.match(/^[0-9a-fA-F]{24}$/)) {
            post = await Post.findOne({ slug: id });
        }

        if (!post) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        if (post.author.toString() !== session.user.id && session.user.role !== 'admin') {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await Post.findByIdAndDelete(post._id);

        return NextResponse.json({ message: "Post deleted" });
    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
