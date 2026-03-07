// src/app/api/sos-alert/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { corsHeaders } from "@/lib/cors";

export async function OPTIONS() {
  // Handle preflight requests
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}
//  GET specific SOS by ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const sos = await prisma.sOSAlert.findUnique({
      where: { id },
      include: { userDetails: true, media: true },
    });

    if (!sos) {
      return NextResponse.json({ success: false, message: "SOS not found" },  { status: 404, headers: corsHeaders });
    }

    return NextResponse.json({ success: true, sos }, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error fetching SOS alert", error: error.message },
       { status: 500, headers: corsHeaders }
    );
  }
}

//  UPDATE SOS (location or stop)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { location, status } = body;

    const sos = await prisma.sOSAlert.update({
      where: { id },
      data: {
        location: location || undefined,
        status: status || undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: "SOS updated successfully",
      sos,
    }, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error updating SOS alert", error: error.message },
       { status: 500, headers: corsHeaders }
    );
  }
}

//  DELETE SOS
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await prisma.sOSAlert.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "SOS alert deleted successfully",
    }, { status: 204, headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Error deleting SOS alert", error: error.message },
       { status: 500, headers: corsHeaders }
    );
  }
}
