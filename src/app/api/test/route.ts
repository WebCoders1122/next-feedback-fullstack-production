import dbConnet from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnet();
  return NextResponse.json({ message: "test route" });
}
