import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { corsHeaders } from "@/lib/cors";

export async function OPTIONS() {
  // Handle preflight requests
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

// ✅ CREATE SOS Alert
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userDetailsId, location, status } = body;

    if (!userDetailsId) {
      return NextResponse.json(
        { success: false, message: "userDetailsId is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const sos = await prisma.sOSAlert.create({
      data: {
        userDetailsId,
        location: location || {},
        status: status || "active",
      },
    });

    return NextResponse.json({
      success: true,
      message: "SOS alert created successfully",
      sos,
    }, { status: 201, headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error creating SOS alert", error: error.message },
       { status: 500, headers: corsHeaders }
    );
  }
}

// ✅ GET All SOS Alerts
export async function GET() {
  try {
    const allSOS = await prisma.sOSAlert.findMany({
      include: { userDetails: true },
      orderBy: { timestamp: "desc" },
    });

    return NextResponse.json({
      success: true,
      total: allSOS.length,
      allSOS,
    }, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error fetching SOS alerts", error: error.message },
       { status: 500, headers: corsHeaders }
    );
  }
}
