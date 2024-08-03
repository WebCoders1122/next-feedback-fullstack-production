import mongoose, { Schema } from "mongoose";
import { MessageInterface, UserInterface } from "../../types";

const messageSchema: Schema<MessageInterface> = new Schema({
  content: { type: String, required: [true, "Message Content Required"] },
  createAt: {
    type: Date,
    required: [true, "Message Creation Date is required"],
  },
});

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
    match: [
      /^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/gim,
      "Please enter a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Password Required"],
  },
  verifyCode: {
    type: String,
  },
  verifyCodeExpiry: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetPassword: {
    type: Boolean,
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
