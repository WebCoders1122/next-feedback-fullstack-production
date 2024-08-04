import { Body, Head, Html } from "@react-email/components";

type Props = {
  username: string;
  verifyCode: string;
};
const verifyEmailTempelate = ({ username, verifyCode }: Props) => {
  return (
    <Html>
      <Head>
        <title>Verify Email</title>
      </Head>
      <Body>
        <h1>Verify Email</h1>
        <h3>Dear {username}!</h3>
        <p>
          Welcome to Anonymous Feedback website. Please enter the following code
          to verify and complete your signup process.
        </p>
        <h3 className='text-2xl font-bold'>{verifyCode}</h3>
        <br />
        <p>This code is valid for one hour only</p>
        <p>with best Regards</p>
        <h3>Anonymous Feedback App Team</h3>
      </Body>
    </Html>
  );
};
export default verifyEmailTempelate;
