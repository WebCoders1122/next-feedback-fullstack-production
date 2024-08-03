import { Document } from "mongoose";
export interface ApiResponseInterface {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: MessageInterface[];
}

export interface MessageInterface extends Document {
  _id?: string;
  content: string;
  createAt: Date;
}

export interface UserInterface extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string | undefined;
  verifyCodeExpiry: Date | undefined;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  resetPassword: Boolean | undefined;
  createdAt: Date;
  messages?: MessageInterface[];
}
