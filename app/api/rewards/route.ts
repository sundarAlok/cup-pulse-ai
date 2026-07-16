import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    reward: "10 USDC",
    transactionHash: "demo-cctp-transaction",
    message: "Reward claimed successfully",
  });
}