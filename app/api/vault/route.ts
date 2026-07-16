import { NextResponse } from "next/server";
import { readVaultData, writeVaultData } from "@/app/lib/vaultStore";

export async function GET() {
  const data = await readVaultData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const nextData = await writeVaultData(body);
  return NextResponse.json(nextData);
}
