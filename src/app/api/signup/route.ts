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
  try {
    const hashedPassword = await getHashedPass(password);
    const { verfiyToken, expiryDate, createAt } = getVerificationDetails();
    const user = await User.findOne({ email });
    if (user) {
      if (user.isVerified) {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 400 }
        );
      } else {
        const updatedUser = await User.findOneAndUpdate(
          { email },
          {
            $set: {
              username,
              password: hashedPassword,
              verfiyToken,
              verifyTokenExpiry: expiryDate,
              isVerified: false,
              isAcceptingMessages: true,
              createdAt: createAt,
              messages: [],
            },
          },
          { new: true }
        );
      }
    } else {
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        verfiyToken,
        verifyTokenExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        createdAt: createAt,
        messages: [],
      });
      const savedUser = await newUser.save();
    }
    // to send email using sender
    await sendVerificationEmail(username, email, verfiyToken);
    // sending response
    return NextResponse.json({ message: "Signup Successful" }, { status: 201 });
  } catch (error) {
    console.error("user registeration failed due to error", error);
    return NextResponse.json(
      { error: "user registeration failed due to error" },
      { status: 500 }
    );
  }

  //   console.log(username, email, password);
  return NextResponse.json({ message: "Signup Successful" });
}
