// configuration of 'nodemailer' for sending email to user
import verifyEmailTempelate from "../../emails/verifyEmailTempelate";
import { ApiResponseInterface } from "../../types";
import resetPasswordVerifyEmail from "../../emails/resetPasswordVerifyEmail";
import nodemailer from "nodemailer";

export default async function sendVerificationEmail(
  username: string,
  verifyCode: string,
  emailType: string,
  email?: string
): Promise<ApiResponseInterface> {
  try {
    // making transported with nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "webuser0808@gmail.com",
        pass: process.env.GMAIL_PASS,
      },
    });
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: "webuser0808@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY"
          ? "Feedback | Verify Your Email Address"
          : "Feedback | Reset Your Password",
      html:
        emailType === "VERIFY"
          ? `<h1>Verify Email</h1>
      <h3>Dear ${username}!</h3>
      <p>
        Welcome to Feedback website. Please enter the following code
        to verify and complete your signup process.
      </p>
      <h3 className='text-2xl font-bold'>${verifyCode}</h3>
      <br />
      <p>This code is valid for one hour only</p>
      <p>with best Regards</p>
      <h3>Feedback App Team</h3>`
          : ` <h1>Verify Email</h1>
      <h3>Dear ${username}!</h3>
      <p>
        Welcome to Feedback website. Please enter the following code
        to verify and reset your password.
      </p>
      <h3 className='text-2xl font-bold'>${verifyCode}</h3>
      <br />
      <p>This code is valid for one hour only</p>
      <p>with best Regards</p>
      <h3>Feedback Team</h3>`,
    });

    console.log("Message sent: %s", info.messageId, info);
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
