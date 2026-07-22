import { NextRequest, NextResponse } from "next/server";
import { generatePremiumReport } from "@/lib/ai";
import { getPremiumUnlockByWallet, hasPremiumAccess, recordPremiumUnlock } from "@/lib/db";

type VerifyPaymentBody = {
  wallet?: string;
  txHash?: string;
  amount?: number | string;
  recipient?: string;
  status?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as VerifyPaymentBody;
    const wallet = body.wallet?.trim();
    const txHash = body.txHash?.trim();
    const recipient = body.recipient?.trim();
    const status = body.status?.trim().toLowerCase();

    const isValidTxHash = (hash: unknown): hash is string =>
      typeof hash === "string" && /^0x[a-fA-F0-9]{64}$/.test(hash);

    if (!wallet || !txHash || !isValidTxHash(txHash)) {
      return NextResponse.json(
        {
          success: false,
          error: "Wallet and valid transaction hash are required.",
        },
        { status: 400 }
      );
    }

    const expectedRecipient = "0x9cbe261601b890cf4687a62d5b85ed2fe3de919f";
    const normalizedRecipient = recipient?.toLowerCase();
    const normalizedStatus = status === "success" || status === "confirmed" ? "success" : status;
    const parsedAmount = typeof body.amount === "string" ? Number(body.amount) : Number(body.amount ?? 0);

    if (
      parsedAmount < 1 ||
      normalizedRecipient !== expectedRecipient ||
      normalizedStatus !== "success"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment verification failed.",
        },
        { status: 402 }
      );
    }

    console.log("VERIFY PAYMENT REQUEST");
    console.log({
      wallet,
      txHash,
      amount: parsedAmount,
      recipient: normalizedRecipient,
      status: normalizedStatus,
    });
    console.log("RECORDING PREMIUM ACCESS");
    console.log(getPremiumUnlockByWallet(wallet));

    if (!hasPremiumAccess(wallet)) {
      recordPremiumUnlock(wallet, txHash);
    }

    const premiumRecord = getPremiumUnlockByWallet(wallet);
    const report = await generatePremiumReport("Brazil");

    return NextResponse.json({
      success: true,
      report,
      txHash: premiumRecord?.tx_hash ?? txHash,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to verify payment.",
      },
      { status: 500 }
    );
  }
}
