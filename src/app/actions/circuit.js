"use server";
import { saveCircuit } from "@/lib/notion";

export async function saveCircuitAction(name, circuitData) {
    try {
        const response = await saveCircuit(name, circuitData);
        return { success: true, id: response.id };
    } catch (error) {
        console.error("Failed to save circuit:", error);
        return { success: false, error: error.message };
    }
}
