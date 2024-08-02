// nextjs route to get all messseges of session users by DB
import UserModel from "@/model/UserModel";
import { NextRequest, NextResponse } from "next/server";
import dbConnet from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  await dbConnet();
  //   getting server session and sending response if not found
  // const session = await getServerSession(authOptions);
  // if (!session) {
  //   return NextResponse.json(
  //     { success: false, message: "You are not Authorized to get messages" },
  //     { status: 401 }
  //   );
  // }
  //getting user id from session and sending response if not found
  // const userID = session.user?._id;
  // if (!userID) {
  //   return NextResponse.json(
  //     { success: false, message: "Unauthorized UserID" },
  //     { status: 401 }
  //   );
  // }
  //Converting string id to mongoose objectId
  const userObjectId = new mongoose.Types.ObjectId("66acfc113e9f10d5df03b76c");
  try {
    //getting all messages of user by userID
    const userMessageData = await UserModel.aggregate([
      //finds user
      { $match: { _id: userObjectId } },
      //get all messeges and make seperate objects with user found
      { $unwind: "$messages" },
      //sort messages by date
      { $sort: { "messages.createAt": -1 } },
      // make signle object with these sorted messages
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" },
        },
      },
    ]).exec();
    return NextResponse.json(
      {
        success: true,
        message: "Messages Found from DB",
        messages: userMessageData[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: error,
        success: false,
        message: "Error in getting messages from DB",
      },
      { status: 500 }
    );
  }
}
