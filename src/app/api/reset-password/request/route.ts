import { NextRequest, NextResponse } from "next/server";
import User from "@/model/UserModel";
import dbConnet from "@/lib/dbConnect";
import getVerificationDetails from "@/helpers/getVerificationDetails";
import sendVerificationEmail from "@/lib/resendEmail";

export async function POST(request: NextRequest) {
  await dbConnet();
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json(
      { success: false, message: "Email required to reset password" },
      { status: 400 }
    );
  }
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    const { verifyCode, expiryDate, createAt } = getVerificationDetails();
    existingUser.verifyCode = verifyCode;
    existingUser.verifyCodeExpiry = expiryDate;
    const updatedUser = await existingUser.save();
    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not updated",
        },
        { status: 503 }
      );
    }
    //send email to user for verification
    const emailType: string = "RESET";
    await sendVerificationEmail(existingUser.username, verifyCode, emailType);
    return NextResponse.json(
      {
        success: true,
        message: "Verification code sent to your email",
        email: email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(
      error,
      "Error while sending verification code for password reset"
    );
    return NextResponse.json(
      {
        success: false,
        message: "Error while sending verification code",
      },
      { status: 500 }
    );
  }
}
