import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);
import { ApiResponse } from '@/types/ApiResponse';
import VerificationEmail from '../../emails/VerificationEmail';

export async function sendVerificationEmail(
    email: string, username: string, verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery Messenger | Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return { success: true, message: "Verification Email send successfully!" }
    } catch (emailError) {
        console.error("Error while sending Verification Email", emailError);
        return { success: false, message: "Failed to send Verification Email" }
    }
}