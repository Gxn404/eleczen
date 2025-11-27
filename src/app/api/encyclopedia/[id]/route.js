import dbConnect from "@/lib/db";
import Component from "@/models/Component";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await dbConnect();

  try {
    const deletedComponent = await Component.findByIdAndDelete(id);
    if (!deletedComponent) {
      return NextResponse.json(
        { error: "Component not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}

export async function PUT(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await dbConnect();

  try {
    const body = await request.json();
    const component = await Component.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!component) {
      return NextResponse.json(
        { error: "Component not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: component });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}
