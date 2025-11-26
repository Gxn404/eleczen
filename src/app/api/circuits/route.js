// api/circuits/route.js
import { NextResponse } from "next/server";

// In-memory storage (replace with database in production)
const circuits = new Map();

export async function POST(request) {
  try {
    const { circuitData, circuitId } = await request.json();

    if (!circuitId) {
      return NextResponse.json(
        { error: "Circuit ID required" },
        { status: 400 },
      );
    }

    // Validate circuit data
    if (!circuitData || !circuitData.components || !circuitData.connections) {
      return NextResponse.json(
        { error: "Invalid circuit data structure" },
        { status: 400 },
      );
    }

    // Store circuit
    circuits.set(circuitId, {
      ...circuitData,
      savedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      circuitId,
      message: "Circuit saved successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const circuitId = searchParams.get("id");

    if (!circuitId) {
      return NextResponse.json({
        circuits: Array.from(circuits.entries()).map(([id, data]) => ({
          id,
          ...data,
        })),
      });
    }

    const circuit = circuits.get(circuitId);
    if (!circuit) {
      return NextResponse.json({ error: "Circuit not found" }, { status: 404 });
    }

    return NextResponse.json({ ...circuit, id: circuitId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const circuitId = searchParams.get("id");

    if (!circuitId || !circuits.has(circuitId)) {
      return NextResponse.json({ error: "Circuit not found" }, { status: 404 });
    }

    circuits.delete(circuitId);
    return NextResponse.json({ success: true, message: "Circuit deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
