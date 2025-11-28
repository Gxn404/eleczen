import mongoose from "mongoose";

const ComponentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a component name"],
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      enum: ["IC", "Resistor", "Capacitor", "Transistor", "Diode", "Sensor", "Microcontroller", "Other"],
    },
    specifications: {
      type: Map,
      of: String,
    },
    datasheetUrl: {
      type: String,
    },
    pinoutImage: {
      type: String,
    },
    pricing: {
      type: Map,
      of: String, // e.g., "Mouser": "$0.50"
    },
    tags: [String],
  },
  { timestamps: true }
);

// Auto-generate slug from name
ComponentSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});

export default mongoose.models.Component || mongoose.model("Component", ComponentSchema);
