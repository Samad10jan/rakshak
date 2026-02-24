import { corsHeaders } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function OPTIONS() {
  // Handle preflight requests (CORS)
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phoneNumber, password } = body;

    if (!phoneNumber || !password) {
      return NextResponse.json(
        { success: false, message: "Phone number and password are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // IMPORTANT: do NOT omit password
    const user = await prisma.user.findUnique({
      where: { phoneNumber },
      include: {
        details: {
          select: {
            codeWord: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User does not exist" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Manual password check (since not hashed)
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, message: "Incorrect password" },
        { status: 401, headers: corsHeaders }
      );
    }

    // Remove password before sending response
    const { password: _, ...safeUser } = user;

    return NextResponse.json(
      { success: true, message: "Sign-in successful", user: safeUser },
      { status: 200, headers: corsHeaders }
    );

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error during sign-in" },
      { status: 500, headers: corsHeaders }
    );
  }
}
