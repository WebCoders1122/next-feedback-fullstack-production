// creating next js route for 6 digit code verification with zod
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { verifySchema } from "@/schemas/verifySchema";
import User from "@/model/UserModel";
import dbConnet from "@/lib/dbConnect";

const verifyCodeQuerySchema = z.object({
  verifyCode: verifySchema,
});

export async function PATCH(request: NextRequest) {
  await dbConnet();
  const { codeToVerify, username } = await request.json();
  if (!codeToVerify) {
    return NextResponse.json(
      { success: false, message: "Verification Code Required" },
      { status: 400 }
    );
  }

  const validationResult = verifyCodeQuerySchema.safeParse({
    verifyCode: {
      Code: codeToVerify,
    },
  });
  // this if will check for erros in case of validation fails and send error messeges to users
  if (!validationResult.success) {
    const validationErrorsArray =
      validationResult.error.format().verifyCode?._errors || [];
    const velidationErrorMessage =
      validationErrorsArray?.length > 0
        ? validationErrorsArray?.join(", ")
        : "Validation Failed";
    return NextResponse.json(
      { success: false, message: velidationErrorMessage },
      { status: 400 }
    );
  }

  try {
    // now find the user based on username from DB
    const userToVerify = await User.findOne({ username });
    if (!userToVerify) {
      return NextResponse.json(
        { success: false, message: "User Not Found" },
        { status: 404 }
      );
    }
    //check the code is true and not expired
    const isCorrectCode = userToVerify.verifyCode === codeToVerify;
    const isNotExpiredCode =
      new Date(userToVerify.verifyCodeExpiry as Date) > new Date(Date.now());
    if (!isCorrectCode) {
      console.log("code incorect ");

      return NextResponse.json(
        { success: false, message: "Invalid Verification Code" },
        { status: 400 }
      );
    } else if (!isNotExpiredCode) {
      console.log("code expired ");

      //TODO: make a logic to resend code instead for signing up again
      return NextResponse.json(
        {
          success: false,
          message: "Verification Code Expired. Please SignUp Again",
        },
        { status: 400 }
      );
    }
    console.log("valid code and user");

    userToVerify.isVerified = true;
    userToVerify.verifyCode = undefined;
    userToVerify.verifyCodeExpiry = undefined;
    await userToVerify.save();
    console.log("user verified", userToVerify);
    return NextResponse.json(
      {
        success: true,
        message: "User Verified Successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Verification of Code Failed", error: error },
      { status: 500 }
    );
  }
}
