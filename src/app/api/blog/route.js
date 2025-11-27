import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import { auth } from "@/auth";

export async function GET() {
  try {
    await dbConnect();
    const posts = await Post.find({}).sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    // Check if user is authenticated and is an admin
    // Note: In a real app, you might want to check session.user.role === "admin"
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Basic validation
    if (!data.title || !data.slug || !data.content) {
      return NextResponse.json(
        { message: "Title, slug, and content are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check for existing slug
    const existingPost = await Post.findOne({ slug: data.slug });
    if (existingPost) {
      return NextResponse.json(
        { message: "A post with this slug already exists" },
        { status: 400 }
      );
    }

    const post = await Post.create({
      ...data,
      author: session.user.id || session.user._id,
      tags: data.tags ? data.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
