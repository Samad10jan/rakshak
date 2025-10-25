import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

//  GET user details
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      details: userDetails,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error fetching user details", error: error.message },
      { status: 500 }
    );
  }
}

// ✅ PUT update user details (address, codeWord, message)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { permanentAddress, codeWord, message } = body;

    const userDetails = await prisma.userDetails.findUnique({
      where: { userId: id },
    });

    if (!userDetails) {
      return NextResponse.json(
        { success: false, message: "User details not found" },
        { status: 404 }
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

    return NextResponse.json({
      success: true,
      message: "User details updated successfully",
      details: updatedDetails,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error updating user details", error: error.message },
      { status: 500 }
    );
  }
}
