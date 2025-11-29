import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const sendEmail = async (to, subject, html) => {
    if (!resend) {
        console.warn("RESEND_API_KEY is not set. Email not sent.");
        return { success: false, error: "Missing API Key" };
    }

    try {
        const data = await resend.emails.send({
            from: 'ElecZen <onboarding@resend.dev>', // Use resend.dev for testing if no domain
            to: [to],
            subject: subject,
            html: html,
        });
        return { success: true, data };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
    }
};

export const sendOTP = async (email, otp) => {
    const subject = "Your ElecZen Verification Code";
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #06b6d4;">ElecZen</h1>
            <p>Your verification code is:</p>
            <h2 style="background: #f3f4f6; padding: 10px; border-radius: 5px; display: inline-block; letter-spacing: 5px;">${otp}</h2>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
        </div>
    `;
    return sendEmail(email, subject, html);
};
