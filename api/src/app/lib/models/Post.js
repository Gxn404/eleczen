import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide a title"],
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            required: true,
        },
        content: {
            type: String,
            required: [true, "Please provide content"],
        },
        excerpt: {
            type: String,
        },
        coverImage: {
            type: String,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        tags: [String],
        published: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Auto-generate slug from title if not provided
PostSchema.pre("validate", function (next) {
    if (!this.slug && this.title) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
    }
    next();
});

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
