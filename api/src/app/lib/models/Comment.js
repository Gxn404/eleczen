import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, "Please provide comment content"],
            trim: true,
            maxlength: [1000, "Comment cannot be more than 1000 characters"],
        },
        post: {
            type: String, // Changed from ObjectId to String to support blog slugs/IDs
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
