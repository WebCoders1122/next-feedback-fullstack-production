import { Body, Html, Head } from "@react-email/components";

export default async function resetPasswordVerifyEmail(
  username: string,
  verifyCode: string
) {
  return (
    <Html>
      <Head>
        <title>Verify Email</title>
      </Head>
      <Body>
        <h1>Verify Email</h1>
        <h3>Dear {username}!</h3>
        <p>
          Welcome to Anonymus Feedback website. Please enter the following code
          to verify and reset your password.
        </p>
        <h3 className='text-2xl font-bold'>{verifyCode}</h3>
        <br />
        <p>This code is valid for one hour only</p>
        <p>with best Regards</p>
        <h3>Feedback App Team</h3>
      </Body>
    </Html>
  );
}
