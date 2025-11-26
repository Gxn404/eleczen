import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Component from "@/models/Component";

export const dynamic = "force-dynamic";

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  try {
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }

    const components = await Component.find(query).sort({ name: 1 });
    return NextResponse.json({ success: true, data: components });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const component = await Component.create(body);
    return NextResponse.json(
      { success: true, data: component },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}
