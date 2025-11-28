import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      select: false, // Don't return password by default
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    provider: {
      type: String,
      default: "credentials", // google, github, credentials
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    savedCircuits: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Circuit",
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
