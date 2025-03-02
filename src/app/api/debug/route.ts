import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Disable caching for this route

export async function GET() {
  return NextResponse.json({ 
    message: "API debug endpoint is working!",
    timestamp: new Date().toISOString()
  });
}