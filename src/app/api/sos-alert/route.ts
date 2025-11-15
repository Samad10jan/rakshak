import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { corsHeaders } from "@/lib/cors";

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

// =============================
// CREATE SOS ALERT (POST)
// =============================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, location, status } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Find userDetails row using userId
    const userDetails = await prisma.userDetails.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!userDetails) {
      return NextResponse.json(
        { success: false, message: "User details not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Create SOS Alert
    const sos = await prisma.sOSAlert.create({
      data: {
        userDetailsId: userDetails.id,
        location: location || {},
        status: status || "active",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "SOS alert created successfully",
        sos,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("Error creating SOS alert:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error creating SOS alert",
        error: error.message,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

// =============================
// ADMIN — GET ALL SOS ALERTS
// =============================
export async function GET() {
  try {
    const allSOS = await prisma.sOSAlert.findMany({
      include: { userDetails: true },
      orderBy: { timestamp: "desc" },
    });

    return NextResponse.json(
      {
        success: true,
        total: allSOS.length,
        allSOS,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching SOS alerts",
        error: error.message,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
