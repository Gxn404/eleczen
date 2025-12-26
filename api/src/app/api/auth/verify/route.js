import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import User from "../../../lib/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, otp, newPassword } = body;
        console.log("Verify API Request:", { email, otp, hasNewPassword: !!newPassword });

        if (!email || !otp) {
            console.log("Verify Failed: Missing email or otp");
            return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 });
        }

        await dbConnect();
        const user = await User.findOne({ email });

        if (!user) {
            console.log("Verify Failed: User not found for email:", email);
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        console.log("Verify Check:", {
            inputOtp: otp,
            dbOtp: user.otp,
            expires: user.otpExpires,
            now: new Date(),
            isExpired: user.otpExpires < new Date()
        });

        if (user.otp !== otp || user.otpExpires < new Date()) {
            console.log("Verify Failed: OTP mismatch or expired");
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
        console.log("Verify Success for:", email);

        return NextResponse.json({ message: "Success" }, { status: 200 });

    } catch (error) {
        console.error("Verify OTP Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
