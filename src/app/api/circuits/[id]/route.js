import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Circuit from "@/models/Circuit";
import { auth } from "@/auth";

export async function GET(request, { params }) {
    try {
        const { id } = params;
        await dbConnect();

        const circuit = await Circuit.findById(id).populate("author", "name image");

        if (!circuit) {
            return NextResponse.json({ message: "Circuit not found" }, { status: 404 });
        }

        // Check visibility
        const session = await auth();
        if (!circuit.isPublic) {
            if (!session || circuit.author._id.toString() !== session.user.id) {
                return NextResponse.json({ message: "Forbidden" }, { status: 403 });
            }
        }

        return NextResponse.json(circuit);
    } catch (error) {
        console.error("Error fetching circuit:", error);
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

        const circuit = await Circuit.findById(id);
        if (!circuit) {
            return NextResponse.json({ message: "Circuit not found" }, { status: 404 });
        }

        // Check ownership
        if (circuit.author.toString() !== session.user.id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        Object.assign(circuit, body);
        await circuit.save();

        return NextResponse.json(circuit);
    } catch (error) {
        console.error("Error updating circuit:", error);
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

        const circuit = await Circuit.findById(id);
        if (!circuit) {
            return NextResponse.json({ message: "Circuit not found" }, { status: 404 });
        }

        // Check ownership
        if (circuit.author.toString() !== session.user.id && session.user.role !== 'admin') {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await Circuit.findByIdAndDelete(id);

        return NextResponse.json({ message: "Circuit deleted" });
    } catch (error) {
        console.error("Error deleting circuit:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
