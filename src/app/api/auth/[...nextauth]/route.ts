import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    message: "Auth API funcionando",
    status: "ok" 
  });
}

export async function POST() {
  return NextResponse.json({ 
    message: "Auth API funcionando",
    status: "ok" 
  });
}