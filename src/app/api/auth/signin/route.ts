import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const user = await prisma.user.findUnique({
      where: { phoneNumber: body.phoneNumber },
      include:{
        details:true
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User does not exist" },
        { status: 404 }
      );
    }
    

    return NextResponse.json(
      { success: true, message: "Sign-in successful", user },
      { status: 200 }
    );
  } catch (error: any) {

    console.error(error);

    return NextResponse.json(
      { success: false, message: "Error during sign-in", error: error.message },
      { status: 500 }
    );
  }
}
