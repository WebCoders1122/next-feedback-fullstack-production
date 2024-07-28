// next js route for username validation
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import User from "@/model/UserModel";
import dbConnet from "@/lib/dbConnect";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: NextRequest) {
  await dbConnet();
  //1st approact to get username from body
  //   const username = await request.json();
  // 2nd approach to get username from query
  const { searchParams } = new URL(request.url);
  const newUsername = searchParams.get("username");
  if (!newUsername) {
    return NextResponse.json(
      { success: false, message: "username is required" },
      { status: 400 }
    );
  }
  // checking username validation with zod and retrung response
  const validationResult = usernameQuerySchema.safeParse({
    username: newUsername,
  });
  if (!validationResult.success) {
    //getting erros provided by zod for specific username field and converting them to an array
    const validationErrorArray =
      validationResult.error.format().username?._errors || [];
    const validationErrorMessages =
      validationErrorArray.length > 0
        ? validationErrorArray.join(".")
        : "Username not Validated";
    return NextResponse.json(
      { success: false, message: validationErrorMessages },
      { status: 400 }
    );
  }
  try {
    const validatedUsername = validationResult.data.username;
    // search that username is taken by a verified users or not
    const isUsernameTaken = await User.findOne({
      username: validatedUsername,
      isVerified: true,
    });
    // if username already taken by a verified user
    if (isUsernameTaken) {
      return NextResponse.json(
        { success: false, message: "username is already taken" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: true, message: "username is available" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error while fetching username" },
      { status: 500 }
    );
  }
}
