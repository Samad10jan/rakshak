import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Common CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Replace * with your frontend URL in production
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ✅ Preflight request handler
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

// ✅ GET user details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const userDetails = await prisma.userDetails.findUnique({
      where: { userId: id },
      include: {
        trustedFriends: true,
        sosHistory: {
          include: { media: true },
        },
      },
    });

    if (!userDetails) {
      return NextResponse.json(
        { success: false, message: "User details not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, details: userDetails },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching user details",
        error: error.message,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

// ✅ PUT update user details
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { permanentAddress, codeWord, message } = body;

    const userDetails = await prisma.userDetails.findUnique({
      where: { userId: id },
    });

    if (!userDetails) {
      return NextResponse.json(
        { success: false, message: "User details not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    const updatedDetails = await prisma.userDetails.update({
      where: { userId: id },
      data: {
        permanentAddress,
        codeWord,
        message,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "User details updated successfully",
        details: updatedDetails,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error updating user details",
        error: error.message,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
