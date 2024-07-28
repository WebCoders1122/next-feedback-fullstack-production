// nextjs route that allows anonymus people to send a message to any user
import User from "@/model/UserModel";
import { NextRequest, NextResponse } from "next/server";
import dbConnet from "@/lib/dbConnect";

export async function POST(request: NextRequest) {
  await dbConnet();
  const { username, content }: { username: string; content: string } =
    await request.json();
  if (!username || !content) {
    return NextResponse.json(
      { success: false, message: "Invalid Required Data" },
      { status: 400 }
    );
  }
  try {
    //find user from db
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    //check if user accepting messages or not
    if (user.isAcceptingMessages === false) {
      return NextResponse.json(
        { success: false, message: "User not Accepting Feedback" },
        { status: 405 }
      );
    }
    const createAt = new Date(Date.now());
    user.messages?.push({
      content: content,
      createAt: createAt,
    } as MessageInterface);
    await user.save();
    return NextResponse.json(
      { success: true, message: "Feedback Sent Successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error Sending Feedback to User",
        errorOBJ: error,
      },
      { status: 500 }
    );
  }
}
