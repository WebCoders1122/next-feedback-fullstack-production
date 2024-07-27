// configuration of 'resend' for sending email to user
import { Resend } from "resend";
import verifyEmailTempelate from "../../emails/verifyEmailTempelate";
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendVerificationEmail(
  username: string,
  email: string,
  verifyToken: string
): Promise<ApiResponseInterface> {
  try {
    const emailResponse = await resend.emails.send({
      from: "feedbackapp@resend.com",
      to: email,
      subject: "Feedback App | Verify Your Email Address",
      react: verifyEmailTempelate({ username, verifyToken }),
    });
    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.error(error, "Error while sending email");
    return {
      success: false,
      message: "Error while sending email",
    };
  }
}
