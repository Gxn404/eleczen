import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Circuit from "@/models/Circuit";
import { auth } from "@/auth";

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
