import { Body, Html, Head } from "@react-email/components";

export default async function resetPasswordVerifyEmail(
  username: string,
  verifyCode: string
) {
  return (
    <div>
      <h1>Verify Email</h1>
      <h3>Dear {username}!</h3>
      <p>
        Welcome to Anonymous Feedback website. Please enter the following code
        to verify and reset your password.
      </p>
      <h3 className='text-2xl font-bold'>{verifyCode}</h3>
      <br />
      <p>This code is valid for one hour only</p>
      <p>with best Regards</p>
      <h3>Anonymous Feedback Team</h3>
    </div>
  );
}
