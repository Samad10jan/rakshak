import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { corsHeaders } from "@/lib/cors";

// Preflight request handler
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}
// /api/user/[id]/trusted-friends/[friendId]
//  PUT update friend info
export async function PUT(req: NextRequest, { params }: { params: Promise<{ friendId: string }> }
) {
    try {
        const param = await params;

        const { friendId } = param;
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
        }, { status: 200, headers: corsHeaders });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: "Error updating friend", error: error.message },
            { status: 500,headers: corsHeaders }
        );
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { friendId: string } }) {
  try {
    const { friendId } = params;

    // Check if the friend exists
    const friend = await prisma.trustedFriend.findUnique({ where: { id: friendId } });
    if (!friend) {
      return NextResponse.json({
        success: false,
        message: "Friend not found",
      }, { status: 404, headers: corsHeaders });
    }

    // Delete the friend
    await prisma.trustedFriend.delete({ where: { id: friendId } });

    return NextResponse.json({
      success: true,
      message: "Friend deleted successfully",
    }, { status: 200, headers: corsHeaders });

  } catch (error: any) {
    console.error("Delete friend error:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting friend", error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
