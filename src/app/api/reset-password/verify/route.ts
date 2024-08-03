import dbConnet from "@/lib/dbConnect";
import User from "@/model/UserModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnet();
  const { username, codeToVerify } = await request.json();
  try {
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 400 }
      );
    }
    const isCorrectCode = existingUser.verifyCode === codeToVerify;
    const isNotExpiredCode =
      new Date(existingUser.verifyCodeExpiry as Date) > new Date();
    if (!isCorrectCode || !isNotExpiredCode) {
      return Response.json(
        { success: false, message: "Invalid / Expired Verification code" },
        { status: 400 }
      );
    }
    existingUser.verifyCode = undefined;
    existingUser.verifyCodeExpiry = undefined;
    existingUser.resetPassword = true;
    const updatedUser = await existingUser.save();
    if (!updatedUser) {
      return Response.json(
        { success: false, message: "Verification Failed" },
        { status: 400 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Verification Successfull",
        username: username,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error, "Error while verifying code at reset-password/verify");
    return NextResponse.json(
      { success: false, message: "Verification of Code Failed", error: error },
      { status: 500 }
    );
  }
}
