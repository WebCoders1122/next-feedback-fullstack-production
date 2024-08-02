// configuration of 'resend' for sending email to user
import { Resend } from "resend";
import verifyEmailTempelate from "../../emails/verifyEmailTempelate";
import { ApiResponseInterface } from "../../types";
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendVerificationEmail(
  username: string,
  email: string,
  verifyCode: string
): Promise<ApiResponseInterface> {
  try {
    const emailResponse = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "webcoders1122@gmail.com",
      subject: "Feedback App | Verify Your Email Address",
      react: verifyEmailTempelate({ username, verifyCode }),
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
// TODO: send verification success email after completion of project
export async function sendVerificationSuccessMail(username: string) {
  // return <div>resendEmail</div>;
}
