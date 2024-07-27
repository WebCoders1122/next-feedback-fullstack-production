// make signup route using nextjs server route
import { NextRequest, NextResponse } from "next/server";
import dbConnet from "@/lib/dbConnect";
import User from "@/model/UserModel";
import bcrypt from "bcryptjs";
import getformattedDate from "@/lib/getFormattedDate";

export async function POST(request: NextRequest) {
  await dbConnet();
  const { username, email, password } = await request.json();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const expiryDate = new Date(Date.now() + 3600000);
    const verfiyToken = Math.floor(100000 + Math.random() * 900000);
    const createAt = getformattedDate(new Date());
    const user = await User.findOne({ email });
    const messages: MessageInterface[] = [];
    if (user) {
      //TODO check user email and verification status
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
        messages,
      });
      const savedUser = await newUser.save();
    }
    // to send email using sender
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
