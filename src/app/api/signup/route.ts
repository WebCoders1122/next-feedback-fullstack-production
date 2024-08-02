// make signup route using nextjs server route
import { NextRequest, NextResponse } from "next/server";
import dbConnet from "@/lib/dbConnect";
import User from "@/model/UserModel";
import sendVerificationEmail from "@/lib/resendEmail";
import getHashedPass from "@/helpers/getHashedPass";
import getVerificationDetails from "@/helpers/getVerificationDetails";

export async function POST(request: NextRequest) {
  await dbConnet();
  const { username, email, password } = await request.json();
  console.log(username, email, password);
  try {
    const hashedPassword = await getHashedPass(password);
    const { verifyCode, expiryDate, createAt } = getVerificationDetails();
    const user = await User.findOne({ email });
    if (user) {
      if (user.isVerified) {
        return NextResponse.json(
          { success: false, message: "User already exists" },
          { status: 400 }
        );
      } else {
        const updatedUser = await User.findOneAndUpdate(
          { email },
          {
            $set: {
              username,
              password: hashedPassword,
              verifyCode,
              verifyCodeExpiry: expiryDate,
              isVerified: false,
              isAcceptingMessages: true,
              createdAt: createAt,
              messages: [],
            },
          },
          { new: true }
        );
        console.log("updates");
      }
    } else {
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        createdAt: createAt,
        messages: [],
      });
      const savedUser = await newUser.save();
      console.log(savedUser, "saved user");
    }
    // to send email using sender
    // await sendVerificationEmail(username, email, verifyCode);
    // sending response
    return NextResponse.json(
      { success: true, message: "Signup Successful" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error, "user registeration failed due to error");
    return NextResponse.json(
      {
        success: false,
        message: "user registeration failed due to error",
        error: error,
      },
      { status: 500 }
    );
  }
}
