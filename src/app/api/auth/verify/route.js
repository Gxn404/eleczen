import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        const { email, otp, newPassword } = await request.json();

        if (!email || !otp) {
            return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 });
        }

        await dbConnect();
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        if (user.otp !== otp || user.otpExpires < new Date()) {
            return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
        }

        if (newPassword) {
            // Reset Password Mode
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
        } else {
            // Just Verification Mode
            user.isVerified = true;
        }

        // Clear OTP
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        return NextResponse.json({ message: "Success" }, { status: 200 });

    } catch (error) {
        console.error("Verify OTP Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
