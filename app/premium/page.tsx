"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Wallet, LogOut } from "lucide-react";
import GlassCard from "@/components/GlassCard";

type EthereumRequestArgs = {
  method: string;
  params?: unknown[];
};

type InjectiveProvider = {
  request: (args: EthereumRequestArgs) => Promise<unknown>;
};

type PremiumReport = {
  title: string;
  summary: string;
  scouting: Array<{ team: string; headline: string; signal: string; detail: string }>;
  tacticalAnalysis: Array<{ title: string; detail: string }>;
  simulationSummary: {
    favorite: string;
    upsetChance: string;
    confidence: string;
  };
  matchBreakdown: Array<{ fixture: string; insight: string }>;
};

type PremiumApiResponse = {
  success?: boolean;
  error?: string;
  report?: PremiumReport;
  txHash?: string;
};

export default function PremiumPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [txHash, setTxHash] = useState<string>("");
  const [hasPremium, setHasPremium] = useState(false);
  const [report, setReport] = useState<PremiumReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: number; username: string; points: number } | null>(null);
  const [statusMessage, setStatusMessage] = useState("Checking login state...");

  function saveWalletData(wallet: string, hash?: string) {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem("premiumWalletAddress", wallet);
    if (hash) {
      window.localStorage.setItem("premiumTxHash", hash);
    } else {
      window.localStorage.removeItem("premiumTxHash");
    }
  }

  function clearWalletData() {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem("premiumWalletAddress");
    window.localStorage.removeItem("premiumTxHash");
  }

  const connectWallet = async () => {
    if (typeof window === "undefined") {
      return;
    }

    if (!isAuthenticated) {
      setError("Please login before using premium features.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const ethereum = (window as unknown as { ethereum?: InjectiveProvider }).ethereum;

      if (!ethereum?.request) {
        throw new Error("No wallet provider found. Install MetaMask or another compatible wallet.");
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      const nextAddress = (accounts as string[])[0];
      if (!nextAddress) {
        throw new Error("No wallet account available.");
      }

      setWalletAddress(nextAddress);
      setTxHash("");
      setIsConnected(true);
      saveWalletData(nextAddress);
      setStatusMessage("Wallet connected. Checking premium access...");
      void checkPremiumAccess(nextAddress);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to connect wallet.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkPremiumAccess = async (wallet: string) => {
    try {
      const response = await fetch("/api/premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet, paid: false }),
      });

      const data = (await response.json()) as PremiumApiResponse;
      if (response.ok && data.success) {
        setHasPremium(true);
        if (data.txHash) {
          setTxHash(data.txHash);
          saveWalletData(wallet, data.txHash);
        }
        setStatusMessage(`Premium access already unlocked for ${wallet}.`);
        setReport(data.report ?? null);
        return;
      }

      setHasPremium(false);
      setTxHash("");
      saveWalletData(wallet);
      setStatusMessage("Wallet connected. You can now pay 1 INJ to unlock the report.");
    } catch (err) {
      console.warn("Premium access check failed:", err);
      setHasPremium(false);
      setTxHash("");
      saveWalletData(wallet);
      setStatusMessage("Wallet connected. You can now pay 1 INJ to unlock the report.");
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const loadAuth = async () => {
      try {
        const response = await fetch("/api/me");
        const data = await response.json();

        if (data.authenticated) {
          setIsAuthenticated(true);
          setUser(data.user);
          setStatusMessage("Logged in. Connect your wallet to start premium unlock.");
          return;
        }

        setIsAuthenticated(false);
        setUser(null);
        setStatusMessage("Please login to access premium features.");
      } catch (err) {
        console.error("Failed to verify auth:", err);
        setIsAuthenticated(false);
        setUser(null);
        setStatusMessage("Please login to access premium features.");
      }
    };

    void loadAuth();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isAuthenticated) {
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      const storedWalletAddress = window.localStorage.getItem("premiumWalletAddress") ?? "";
      const storedTxHash = window.localStorage.getItem("premiumTxHash") ?? "";

      if (storedWalletAddress) {
        setWalletAddress(storedWalletAddress);
        setTxHash(storedTxHash);
        setIsConnected(true);

        try {
          const response = await fetch("/api/premium", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ wallet: storedWalletAddress, paid: false }),
          });

          const data = (await response.json()) as PremiumApiResponse;
          if (response.ok && data.success) {
            setHasPremium(true);
            if (data.txHash) {
              setTxHash(data.txHash);
              saveWalletData(storedWalletAddress, data.txHash);
            }
            setStatusMessage(`Premium access already unlocked for ${storedWalletAddress}.`);
            setReport(data.report ?? null);
            return;
          }
        } catch (err) {
          console.warn("Premium access check failed:", err);
        }

        setHasPremium(false);
        setTxHash("");
        saveWalletData(storedWalletAddress);
        setStatusMessage("Wallet connected. You can now pay 1 INJ to unlock the report.");
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [isAuthenticated]);

  const fetchPremiumReport = async (wallet: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error("Please login before accessing premium features.");
      }

      setError(null);
      setIsLoading(true);
      setStatusMessage("Loading your premium report...");

      const response = await fetch("/api/premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet, paid: false }),
      });

      const data = (await response.json()) as PremiumApiResponse;
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to fetch premium report.");
      }

      setReport(data.report ?? null);
      setStatusMessage(`Premium report ready for ${wallet}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to fetch premium report.");
      setStatusMessage("Wallet connected. You can now pay 1 INJ to unlock the report.");
    } finally {
      setIsLoading(false);
    }
  };

  const unlockReport = async () => {
    if (!isAuthenticated) {
      setError("Please login before using premium features.");
      return;
    }

    if (!walletAddress.trim()) {
      setError("Connect a wallet address before paying.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setStatusMessage("Sending the payment transaction and verifying it on the backend...");

    const formatError = (error: unknown) => {
      if (error instanceof Error) return error.message;
      if (typeof error === "string") return error;
      return "Unable to unlock premium report.";
    };

    const isReceiptSuccessful = (receipt: { status?: unknown } | null) =>
      receipt !== null &&
      (receipt.status === "0x1" || receipt.status === 1 || receipt.status === true);

    try {
      const ethereum = (window as unknown as { ethereum?: InjectiveProvider }).ethereum;
      if (!ethereum?.request) {
        throw new Error("No wallet provider found. Install MetaMask or another compatible wallet.");
      }

      const recipient = "0x9cbe261601b890cf4687a62d5b85ed2fe3de919f";
      const txHash = (await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: walletAddress,
            to: recipient,
            value: "0xde0b6b3a7640000", // 1 INJ in wei
          },
        ],
      })) as string;

      setTxHash(txHash);
      setStatusMessage("Transaction submitted. Waiting for confirmation...");

      let receipt: { status?: unknown } | null = null;
      for (let i = 0; i < 20; i += 1) {
        receipt = (await ethereum.request({
          method: "eth_getTransactionReceipt",
          params: [txHash],
        })) as { status?: unknown } | null;

        if (isReceiptSuccessful(receipt)) {
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      if (!isReceiptSuccessful(receipt)) {
        throw new Error(
          receipt
            ? `Transaction failed with status ${String(receipt.status)}.`
            : "Transaction receipt was not found."
        );
      }

      setStatusMessage("Transaction confirmed. Verifying on the backend...");

      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: walletAddress,
          txHash,
          amount: 1,
          recipient,
          status: "success",
        }),
      });

      const data = (await response.json()) as PremiumApiResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Payment verification failed.");
      }

      setReport(data.report ?? null);
      setHasPremium(true);
      saveWalletData(walletAddress, txHash);
      setStatusMessage(`Transaction successful. Premium report unlocked for ${walletAddress}.`);
    } catch (err) {
      setError(formatError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress("");
    setIsConnected(false);
    setTxHash("");
    setHasPremium(false);
    setReport(null);
    setStatusMessage("Connect your Injective wallet to unlock the premium scouting report.");
    clearWalletData();
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_35%),linear-gradient(135deg,#f8fbff,#eef4ff)] px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <GlassCard className="rounded-4xl border border-slate-200/80 bg-white/80 p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700">
                <Lock className="h-4 w-4" /> x402 Premium Insights
              </div>
              <h1 className="mt-4 text-4xl font-semibold text-slate-900">Unlock elite football intelligence with an Injective testnet payment.</h1>
              <p className="mt-3 text-lg text-slate-600">Connect a wallet, pay 1 INJ, verify the transaction server-side, and unlock a premium scouting report generated for your demo.</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Unlock Price</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">1 INJ</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Wallet className="h-4 w-4" /> Injective Wallet
              </div>
              <input
                value={walletAddress}
                onChange={(event) => setWalletAddress(event.target.value)}
                placeholder="inj1... or demo wallet"
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
              />
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button type="button" onClick={connectWallet} disabled={isLoading || !isAuthenticated} className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
                  {isConnected ? "Wallet Connected" : "Connect Wallet"}
                </button>
                <button
                  type="button"
                  onClick={disconnectWallet}
                  disabled={!isConnected || isLoading}
                  className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="inline-flex items-center gap-2">
                    <LogOut className="h-4 w-4" /> Disconnect
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (hasPremium && !report) {
                      fetchPremiumReport(walletAddress);
                    } else {
                      unlockReport();
                    }
                  }}
                  disabled={
                    isLoading ||
                    !isAuthenticated ||
                    !walletAddress.trim() ||
                    (hasPremium && !!report)
                  }
                  className="relative overflow-hidden rounded-full bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="pointer-events-none absolute inset-0 bg-white/10 backdrop-blur-sm" />
                  <span className="relative inline-flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    {hasPremium ? (report ? "Premium Unlocked" : "Show premium report") : "Pay 1 INJ"}
                  </span>
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Demo flow</p>
              <ul className="mt-3 space-y-2">
                <li>1. Connect or paste an Injective-style wallet address.</li>
                <li>2. Pay 1 INJ to the demo recipient.</li>
                <li>3. The backend verifies the payment metadata and unlocks the premium report.</li>
              </ul>
              <div className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50 p-3 text-sm text-cyan-800">
                {statusMessage}
                {!isAuthenticated ? (
                  <p className="mt-2 text-xs text-slate-600">
                    Login first to enable premium wallet payment.
                  </p>
                ) : null}
              </div>
              {txHash ? <div className="mt-3 text-xs text-slate-500">Tx hash: {txHash}</div> : null}
            </div>
          </div>

          {error ? <p className="mt-4 text-sm font-medium text-rose-600">{error}</p> : null}
        </GlassCard>

        {report ? (
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <GlassCard className="rounded-4xl border border-slate-200/80 bg-white/80 p-8">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Report</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">{report.title}</h2>
              <p className="mt-3 text-slate-600">{report.summary}</p>

              <div className="mt-6 space-y-4">
                {report.scouting.map((item, index) => (
                  <div key={`${item.team}-${index}`} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-slate-900">{item.team}</h3>
                      <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">{item.signal}</span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-slate-700">{item.headline}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="rounded-4xl border border-slate-200/80 bg-white/80 p-8">
              <h2 className="text-2xl font-semibold text-slate-900">Tactical & simulation intelligence</h2>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Simulation Summary</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-slate-600">Favorite</span>
                  <span className="font-semibold text-slate-900">{report.simulationSummary.favorite}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-slate-600">Upset Chance</span>
                  <span className="font-semibold text-slate-900">{report.simulationSummary.upsetChance}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-slate-600">Confidence</span>
                  <span className="font-semibold text-slate-900">{report.simulationSummary.confidence}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {report.tacticalAnalysis.map((item) => (
                  <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                {report.matchBreakdown.map((item) => (
                  <div key={item.fixture} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">{item.fixture}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.insight}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        ) : null}
      </div>
    </div>
  );
}
