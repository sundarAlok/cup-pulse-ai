import { NextRequest, NextResponse } from "next/server";
import { buildPremiumReport } from "@/lib/premium";
import { getPremiumUnlockByWallet, hasPremiumAccess } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const paid = body?.paid === true;
    const wallet = typeof body?.wallet === "string" ? body.wallet.trim() : "";

    if (!paid && !wallet) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment verification or wallet access required.",
          unlockFeeUsd: 0.25,
        },
        { status: 400 }
      );
    }

    if (!paid && !hasPremiumAccess(wallet)) {
      return NextResponse.json(
        {
          success: false,
          error: "Premium access not found for this wallet.",
          unlockFeeUsd: 0.25,
        }
      );
    }

    const report = buildPremiumReport();
    const premiumRecord = getPremiumUnlockByWallet(wallet);

    return NextResponse.json({
      success: true,
      report,
      txHash: premiumRecord?.tx_hash,
    });
  } catch (error) {
    console.error("Premium report error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to generate premium report.",
      },
      { status: 500 }
    );
  }
}
