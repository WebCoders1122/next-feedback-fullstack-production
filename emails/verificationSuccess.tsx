import { Body, Head, Html } from "@react-email/components";

type Props = {
  username: string;
};
const verificationSuccess = ({ username }: Props) => {
  return (
    <Html>
      <Head>
        <title>Verification Successful!</title>
      </Head>
      <Body>
        <h1>Verification Successful!</h1>
        <h3>Dear {username}!</h3>
        <p>
          You have successfully verified your email address. Your account is now
          active. Please click on link below to login you account.
        </p>
        <a
          className='text-xl bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-800 cursor-pointer m-3'
          href={process.env.DOMAIN + "/login"}
          target='_blank'>
          Click here to Login
        </a>
        <br />
        <p>with best Regards</p>
        <h3>Anonymous Feedback Team</h3>
      </Body>
    </Html>
  );
};
