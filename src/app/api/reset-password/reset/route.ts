import dbConnet from "@/lib/dbConnect";
import User from "@/model/UserModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnet();
  const { password, username } = await request.json();
  if (!password || !username) {
    return NextResponse.json(
      { success: false, message: "Please provide all fields" },
      { status: 400 }
    );
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    if (!user.resetPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "User has not requested for password reset",
        },
        { status: 400 }
      );
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    user.resetPassword = undefined;
    const updatedUser = await user.save();
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "Error while resetting password" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: true, message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(
      error,
      "Error while resetting password on reset-password/reset"
    );
    return NextResponse.json(
      {
        success: false,
        message: "Error while resetting password",
        error: error,
      },
      { status: 500 }
    );
  }
}
