// src/app/api/user/[id]/trusted-friends/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { corsHeaders } from "@/lib/cors";

const trustedFriendsLimit = 10;
//  Preflight request handler
export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: corsHeaders });
}


//  GET all trusted friends of a user
export async function GET(
    req: NextRequest, { params }: { params: Promise<{ id: string }> }
) {
    try {
        const param = await params;
        const { id } = param
        // console.log(id);

        const userDetails = await prisma.userDetails.findUnique({
            where: { userId: id },
            include: { trustedFriends: true }
        })
        // console.log(userDetails);


        if (!userDetails) {
            return NextResponse.json(
                { success: false, message: "User details not found" },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json({
            success: true,
            message: "User details fetched",
            friends: userDetails.trustedFriends,
        }, { status: 200, headers: corsHeaders });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: "Error fetching friends", error: error.message },
            { status: 500, headers: corsHeaders }
        );
    }
}

//  POST add a new trusted friend
export async function POST(
    req: NextRequest, { params }: { params: Promise<{ id: string }> }
) {
    try {
        const param = await params;


        const { id } = param;
        const body = await req.json();
        const { name, phone } = body;

        if (!name || !phone) {
            return NextResponse.json(
                { success: false, message: "Name and phone are required" },
                { status: 400, headers: corsHeaders }
            );
        }
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404, headers: corsHeaders }
            );
        }

        // normalize both numbers (VERY IMPORTANT)
        const normalizedInput = phone.replace(/\D/g, "");
        const normalizedUserPhone = user.phoneNumber.replace(/\D/g, "");

        // Prevent adding own number
        if (normalizedInput === normalizedUserPhone) {
            return NextResponse.json(
                { success: false, message: "You cannot add your own number as a trusted contact" },
                { status: 400, headers: corsHeaders }
            );
        }

        const userDetails = await prisma.userDetails.findUnique({
            where: { userId: id },
            include: { trustedFriends: true }
        });

        if (!userDetails) {
            return NextResponse.json(
                { success: false, message: "User details not found" },
                { status: 404, headers: corsHeaders }
            );
        }

        if (userDetails.trustedFriends.length >= trustedFriendsLimit) {
            return NextResponse.json(
                {
                    success: false,
                    message: `You can only add up to ${trustedFriendsLimit} trusted contacts`,
                },
                { status: 400 }
            );
        }

        const existing = await prisma.trustedFriend.findFirst({
            where: {
                userDetailsId: userDetails.id,
                phone
            }
        });

        if (existing) {
            return NextResponse.json(
                { success: false, message: "This number is already in your trusted list" },
                { status: 400, headers: corsHeaders }
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
        }, { status: 201, headers: corsHeaders });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: "Error adding friend", error: error.message },
            { status: 500, headers: corsHeaders }
        );
    }
}
