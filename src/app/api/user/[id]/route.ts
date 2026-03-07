// src/app/api/user/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { corsHeaders } from "@/lib/cors";

//  Preflight request handler
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

//  GET user by ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const param = await params;
        const { id } = param
        // console.log(id);
        


        const user = await prisma.user.findUnique({
            where: { id },
            
        });
        // console.log(user);
        

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json({ success: true, user },{ status: 200, headers: corsHeaders });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: "Error fetching user", error: error.message },
            { status: 500, headers: corsHeaders }
        );
    }
}

//  PUT update user info
export async function PUT(
    req: NextRequest, { params }: { params: Promise<{ id: string }> }
) {
    try {
        const param = await params;
        const { id } = param;

        const body = await req.json();
        const { username, email} = body;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { username, email },
        });

        return NextResponse.json({
            success: true,
            message: "User updated successfully",
            user: updatedUser,
        },{ status: 201, headers: corsHeaders });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: "Error updating user", error: error.message },
            { status: 500, headers: corsHeaders }
        );
    }
}

//  DELETE user and all linked records
export async function DELETE(
    req: NextRequest, { params }: { params: Promise<{ id: string }>}
) {
    try {
        const param = await params;

        const { id } = param;

        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: "User deleted successfully",
        },{ status: 204, headers: corsHeaders });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: "Error deleting user", error: error.message },
            { status: 500, headers: corsHeaders }
        );
    }
}
