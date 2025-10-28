import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { corsHeaders } from "@/lib/cors";

export async function OPTIONS() {
  // Handle preflight requests
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}
export async function GET(req: NextRequest, { params }: { params: Promise<{ userid: string }> }) {
  try {
    const { userid } = await params;

    const userDetails = await prisma.userDetails.findUnique({
      where: { userId:userid },
      include: {
        sosHistory: {
          include: { media: true },
          orderBy: { timestamp: "desc" },
        },
      },
    });


    if (!userDetails) {
      return NextResponse.json(
        { success: false, message: "User not found or no details" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json({
      success: true,
      total: userDetails.sosHistory.length,
      sosHistory: userDetails.sosHistory,
    }, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error fetching user SOS history", error: error.message },
       { status: 500, headers: corsHeaders }
    );
  }
}
