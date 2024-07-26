import mongoose, { Schema, Document } from "mongoose";
import { string } from "zod";

export interface MessageInterface extends Document {
  content: string;
  createAt: Date;
}

const messageSchema: Schema<MessageInterface> = new Schema({
  content: { type: String, required: [true, "Message Content Required"] },
  createAt: {
    type: Date,
    required: [true, "Message Creation Date is required"],
  },
});

export interface UserInterface extends Document {
  username: string;
  email: string;
  password: string;
  verfiyToken: string;
  verifyTokenExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  createdAt: Date;
  messages: MessageInterface[];
}

const userSchema: Schema<UserInterface> = new Schema({
  username: {
    type: String,
    required: [true, "Username Required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email Required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password Required"],
  },
  verfiyToken: {
    type: String,
    required: [true, "Verify Token Required"],
  },
  verifyTokenExpiry: {
    type: Date,
    required: [true, "Verify Token Expiry Required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    required: [true, "User Creation Date Required"],
  },
  messages: {
    type: [messageSchema],
  },
});

const User =
  (mongoose.models.User as mongoose.Model<UserInterface>) ||
  mongoose.model("User", userSchema);

export default User;
