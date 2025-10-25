import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ GET all trusted friends of a user
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const userDetails = await prisma.userDetails.findUnique({
      where: { userId: id },
      include: { trustedFriends: true },
    });

    if (!userDetails) {
      return NextResponse.json(
        { success: false, message: "User details not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      friends: userDetails.trustedFriends,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error fetching friends", error: error.message },
      { status: 500 }
    );
  }
}

// ✅ POST add a new trusted friend
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { name, phone } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, message: "Name and phone are required" },
        { status: 400 }
      );
    }

    const userDetails = await prisma.userDetails.findUnique({
      where: { userId: id },
    });

    if (!userDetails) {
      return NextResponse.json(
        { success: false, message: "User details not found" },
        { status: 404 }
      );
    }

    const friend = await prisma.trustedFriend.create({
      data: {
        name,
        phone,
        userDetailsId: userDetails.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Friend added successfully",
      friend,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error adding friend", error: error.message },
      { status: 500 }
    );
  }
}
