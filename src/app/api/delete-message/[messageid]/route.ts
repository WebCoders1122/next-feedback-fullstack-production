// creating delete message from DB route with next js

import { User } from "next-auth";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/model/UserModel";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnet from "@/lib/dbConnect";

type Params = {
  params: {
    messageid: string;
  };
};

export async function DELETE(request: NextRequest, { params }: Params) {
  await dbConnet();
  const session = await getServerSession(authOptions);
  const user = session?.user as User;
  const messageID = params.messageid;

  if (!session && !user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const updateUser = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageID } } }
    );
    if (!updateUser) return;
    if (updateUser.modifiedCount === 0) {
      return NextResponse.json(
        {
          error: updateUser,
          success: false,
          message: "Message was not delete dut to some problem",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, message: "Message Deleted Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Error while Deleting message from Database" },
      { status: 500 }
    );
  }
}
