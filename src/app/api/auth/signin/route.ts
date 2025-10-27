import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:8081", // or replace * with "http://localhost:8081"
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  // Handle preflight requests
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const user = await prisma.user.findUnique({
      where: { phoneNumber: body.phoneNumber },
      include: { details: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User does not exist" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, message: "Sign-in successful", user },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error during sign-in", error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
