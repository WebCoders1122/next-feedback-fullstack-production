// nextjs route for updating and getting isAcceptingMessage status of user with getServerSession
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import User from "@/model/UserModel";
import dbConnet from "@/lib/dbConnect";

//method to update user is Accepting status
export async function PATCH(request: NextRequest) {
  await dbConnet();
  const { isAcceptingMessages } = await request.json();
  // woring body data
  if (!isAcceptingMessages) {
    return NextResponse.json(
      { success: false, message: "Accepting Message is required" },
      { status: 400 }
    );
  }
  const session = await getServerSession(authOptions);
  // No session means no login ==> so shouldn't change any user status
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "You are not authorized to perform this action",
      },
      { status: 401 }
    );
  }
  // find user id from session
  const userID = session.user?._id;
  if (!userID) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { isAcceptingMessages: isAcceptingMessages },
      { new: true }
    );
    return NextResponse.json(
      { success: true, message: "Message Accepting Status Updated" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error updating Message Accepting Status" },
      { status: 500 }
    );
  }
}

// to get status for current user
export async function GET(request: NextRequest) {
  await dbConnet();
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "You are not authorized to perform this action",
      },
      { status: 401 }
    );
  }
  const userID = session.user?._id;
  try {
    const user = await User.findById(userID);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    // sending status of accepting messages to frontend
    return NextResponse.json(
      {
        success: true,
        message: "Message Accepting Status",
        isAcceptingMessages: user.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching Message Accepting Status" },
      { status: 500 }
    );
  }
}
