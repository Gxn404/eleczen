import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Component from "@/models/Component";
import { auth } from "@/auth";

export async function GET(request, { params }) {
    try {
        const { id } = params;
        await dbConnect();

        let component;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            component = await Component.findById(id);
        } else {
            component = await Component.findOne({ slug: id });
        }

        if (!component) {
            return NextResponse.json({ message: "Component not found" }, { status: 404 });
        }

        return NextResponse.json(component);
    } catch (error) {
        console.error("Error fetching component:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const body = await request.json();
        await dbConnect();

        let component = await Component.findById(id);
        if (!component && !id.match(/^[0-9a-fA-F]{24}$/)) {
            component = await Component.findOne({ slug: id });
        }

        if (!component) {
            return NextResponse.json({ message: "Component not found" }, { status: 404 });
        }

        Object.assign(component, body);
        await component.save();

        return NextResponse.json(component);
    } catch (error) {
        console.error("Error updating component:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        await dbConnect();

        let component = await Component.findById(id);
        if (!component && !id.match(/^[0-9a-fA-F]{24}$/)) {
            component = await Component.findOne({ slug: id });
        }

        if (!component) {
            return NextResponse.json({ message: "Component not found" }, { status: 404 });
        }

        await Component.findByIdAndDelete(component._id);

        return NextResponse.json({ message: "Component deleted" });
    } catch (error) {
        console.error("Error deleting component:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
