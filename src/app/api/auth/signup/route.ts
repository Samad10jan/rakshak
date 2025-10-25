// app/api/auth/signup/route.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, phoneNumber } = body;

    // Server-Side Validation
    if (!phoneNumber || phoneNumber.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }
    if (!username || username.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Username is required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        phoneNumber,
        details: {
          create: {
            message: "HELP!!", // default message
          },
        },
      },
      include: { details: true },
    });

    return NextResponse.json(
      { success: true, message: "User registered successfully", user: newUser },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error("Error in signup:", error);
    return NextResponse.json(
      { success: false, message: "Error creating user", error: error.message },
      { status: 500 }
    );
  }
}
