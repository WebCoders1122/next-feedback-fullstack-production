import { Body, Head, Html } from "@react-email/components";

type Props = {
  username: string;
  verifyToken: string;
};
const verifyEmailTempelate = ({ username, verifyToken }: Props) => {
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
          to verify and complete your signup process.
        </p>
        <code>{verifyToken}</code>
        <span>This code is valid for one hour only</span>
      </Body>
    </Html>
  );
};
export default verifyEmailTempelate;
