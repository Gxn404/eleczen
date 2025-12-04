import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Component from "@/models/Component";
import { auth } from "@/auth";

export async function GET(request) {
    try {
        await dbConnect();
        const components = await Component.find({}).sort({ name: 1 });
        return NextResponse.json(components);
    } catch (error) {
        console.error("Error fetching components:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await auth();
        // Assuming only admin can add components to the global library
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        await dbConnect();

        const component = await Component.create(body);

        return NextResponse.json(component, { status: 201 });
    } catch (error) {
        console.error("Error creating component:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
