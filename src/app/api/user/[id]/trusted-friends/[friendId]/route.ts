import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ PUT update friend info
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; friendId: string } }
) {
  try {
    const { friendId } = params;
    const body = await req.json();
    const { name, phone } = body;

    const updatedFriend = await prisma.trustedFriend.update({
      where: { id: friendId },
      data: { name, phone },
    });

    return NextResponse.json({
      success: true,
      message: "Friend updated successfully",
      friend: updatedFriend,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error updating friend", error: error.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE remove friend
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; friendId: string } }
) {
  try {
    const { friendId } = params;

    await prisma.trustedFriend.delete({
      where: { id: friendId },
    });

    return NextResponse.json({
      success: true,
      message: "Friend deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error deleting friend", error: error.message },
      { status: 500 }
    );
  }
}
