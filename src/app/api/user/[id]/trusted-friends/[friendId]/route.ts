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
            { status: 500, headers: corsHeaders }
        );
    }
}

//  DELETE remove friend
export async function DELETE(
    req: NextRequest, { params }: { params: Promise<{ friendId: string }> }
) {
    try {
        const param = await params;

        const { friendId } = param;

        if (!friendId) {
            return NextResponse.json({ success: false, message: "Friend not found" }, { status: 404, headers: corsHeaders });
        }
        await prisma.trustedFriend.delete({
            where: { id: friendId },
        });

        return NextResponse.json({
            success: true,
            message: "Friend deleted successfully",
        }, { status: 200, headers: corsHeaders });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: "Error deleting friend", error: error.message },
            { status: 500, headers: corsHeaders }
        );
    }
}
