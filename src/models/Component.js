import mongoose from "mongoose";

const ComponentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a component name"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category"], // e.g., Resistor, Capacitor, IC
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    symbol: {
      type: String, // URL or SVG string
    },
    specifications: {
      type: Map,
      of: String, // Key-value pairs for specs like "Tolerance": "5%"
    },
    images: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.models.Component ||
  mongoose.model("Component", ComponentSchema);
