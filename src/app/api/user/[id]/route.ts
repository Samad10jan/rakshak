import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ GET user by ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const param = await params;
        const { id } = param


        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                details: {
                    include: {
                        trustedFriends: true,
                        sosHistory: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, user });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: "Error fetching user", error: error.message },
            { status: 500 }
        );
    }
}

// ✅ PUT update user info
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await req.json();
        const { username, email, phoneNumber } = body;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { username, email, phoneNumber },
        });

        return NextResponse.json({
            success: true,
            message: "User updated successfully",
            user: updatedUser,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: "Error updating user", error: error.message },
            { status: 500 }
        );
    }
}

// ✅ DELETE user and all linked records
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: "Error deleting user", error: error.message },
            { status: 500 }
        );
    }
}
