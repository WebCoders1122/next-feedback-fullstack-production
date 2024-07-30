import { Document } from "mongoose";
interface MessageInterface extends Document {
  content: string;
  createAt: Date;
}

interface UserInterface extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string | undefined;
  verifyCodeExpiry: Date | undefined;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  createdAt: Date;
  messages?: MessageInterface[];
}

interface ApiResponseInterface {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: MessageInterface[];
}
