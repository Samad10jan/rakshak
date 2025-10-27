import { NextResponse } from "next/server";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // replace with your frontend domain in production
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function withCors(json: any, status = 200) {
  return NextResponse.json(json, { status, headers: corsHeaders });
}

export async function handleOptions() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}
