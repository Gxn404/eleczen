import mongoose from "mongoose";

const CircuitSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a circuit name"],
            trim: true,
        },
        description: {
            type: String,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
        data: {
            type: Object, // Stores the JSON state of the circuit (components, wires, settings)
            required: true,
        },
        thumbnail: {
            type: String, // URL to a screenshot/thumbnail
        },
        tags: [String],
        forkedFrom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Circuit",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Circuit || mongoose.model("Circuit", CircuitSchema);
