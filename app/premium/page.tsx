"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  BarChart2,
  Lock,
  LogOut,
  ShieldAlert,
  ShieldCheck,
  Wallet,
  Zap,
} from "lucide-react";
import { WORLD_CUP_2026_FINAL } from "@/lib/worldCupData";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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

const matchOverview = {
  homeTeam: WORLD_CUP_2026_FINAL.champion,
  awayTeam: WORLD_CUP_2026_FINAL.runnerUp,
  stadium: WORLD_CUP_2026_FINAL.finalVenue,
  kickoff: WORLD_CUP_2026_FINAL.kickoff,
  prediction: `${WORLD_CUP_2026_FINAL.finalMatch} • ${WORLD_CUP_2026_FINAL.finalScore}`,
  upsetChance: 18,
  keyInsight:
    "Spain's midfield control and quick transitions defined the final, while Argentina's pressure produced a narrow but decisive contest.",
};

const injuryReport = [
  { player: "Pedri", status: "Match-fit", impact: "Low" },
  { player: "Julián Álvarez", status: "Ready", impact: "Low" },
  { player: "Ferran Torres", status: "Ready", impact: "Low" },
  { player: "Enzo Fernández", status: "Managed workload", impact: "Medium" },
];

const teamComparison = [
  {
    id: "spain",
    name: "Spain",
    rating: 94,
    form: "WWWWW",
    expectedGoals: 2.4,
    possession: 59,
    momentum: 69,
    color: "from-red-400 to-orange-500",
  },
  {
    id: "argentina",
    name: "Argentina",
    rating: 92,
    form: "WWWDD",
    expectedGoals: 1.8,
    possession: 52,
    momentum: 58,
    color: "from-sky-400 to-cyan-500",
  },
];

export default function PremiumPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [txHash, setTxHash] = useState<string>("");
  const [hasPremium, setHasPremium] = useState(false);
  const [report, setReport] = useState<PremiumReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [, setUser] = useState<{ id: number; username: string; points: number } | null>(null);
  const [statusMessage, setStatusMessage] = useState("Checking login state...");
  const [selectedTeam, setSelectedTeam] = useState("spain");

  const radarMetrics = useMemo(
    () => [
      { metric: "Win Probability", Spain: 62, Argentina: 38 },
      { metric: "Momentum", Spain: 73, Argentina: 56 },
      { metric: "xG", Spain: 2.3, Argentina: 1.6 },
      { metric: "Possession", Spain: 59, Argentina: 52 },
      { metric: "Pressure", Spain: 68, Argentina: 58 },
    ],
    []
  );

  const momentumTimeline = useMemo(
    () => [
      { phase: "00-15", Spain: 52, Argentina: 48 },
      { phase: "16-30", Spain: 58, Argentina: 42 },
      { phase: "31-45", Spain: 62, Argentina: 38 },
      { phase: "46-60", Spain: 66, Argentina: 34 },
      { phase: "61-75", Spain: 69, Argentina: 31 },
      { phase: "76-90", Spain: 71, Argentina: 29 },
    ],
    []
  );

  const teamSummary = useMemo(
    () => ({
      homeTeam: matchOverview.homeTeam,
      awayTeam: matchOverview.awayTeam,
      stadium: matchOverview.stadium,
      kickoff: matchOverview.kickoff,
      prediction: matchOverview.prediction,
      upsetChance: matchOverview.upsetChance,
      keyInsight: matchOverview.keyInsight,
    }),
    []
  );

  const selectedProfile = useMemo(
    () => teamComparison.find((team) => team.id === selectedTeam) ?? teamComparison[0],
    [selectedTeam]
  );

  const radarData = useMemo(
    () =>
      radarMetrics.map((metric) => ({
        metric: metric.metric,
        Spain: metric.Spain,
        Argentina: metric.Argentina,
      })),
    [radarMetrics]
  );

  const barData = useMemo(
    () => [
      {
        name: "Spain",
        probability: 62,
        upset: 18,
      },
      {
        name: "Argentina",
        probability: 38,
        upset: 25,
      },
    ],
    []
  );

  const injuries = useMemo(
    () => injuryReport,
    []
  );

  const canViewPremiumContent = hasPremium || Boolean(report);

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
  <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_35%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_32%),linear-gradient(135deg,#f8fbff,#eef4ff)] py-24">
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      <GlassCard className="rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700">
              <Lock className="h-4 w-4" /> x402 Premium Insights
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
              Unlock elite football intelligence with an Injective testnet payment.
            </h1>
            <p className="mt-3 text-lg leading-8 text-slate-600">
              Connect a wallet, pay 1 INJ, verify the transaction server-side, and unlock a premium scouting report generated for your demo.
            </p>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Unlock Price</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">1 INJ</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Wallet className="h-4 w-4" /> Injective Wallet
            </div>

            <input
              value={walletAddress}
              onChange={(event) => setWalletAddress(event.target.value)}
              placeholder="inj1... or demo wallet"
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"
            />

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={connectWallet}
                disabled={isLoading || !isAuthenticated}
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
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

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
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

            {txHash ? (
              <div className="mt-3 text-xs text-slate-500">Tx hash: {txHash}</div>
            ) : null}
          </div>
        </div>

        {error ? <p className="mt-4 text-sm font-medium text-rose-600">{error}</p> : null}
      </GlassCard>

      <GlassCard className="rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
        {canViewPremiumContent ? (
          <div className="space-y-8">
            <section className="rounded-[32px] border border-slate-200 bg-slate-50 p-8">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-3xl space-y-4">
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700">
                    <ShieldCheck className="h-4 w-4 text-cyan-700" /> Premium War Room
                  </span>
                  <h2 className="text-4xl font-semibold tracking-tight text-slate-900">
                    World Cup Final Review for elite decision making
                  </h2>
                  <p className="max-w-2xl text-sm leading-7 text-slate-600">
                    Review final-tournament analytics, momentum heatmaps, injury impact, and decisive performance signals from the completed World Cup.
                  </p>
                </div>

                <div className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700">
                  Upset chance: {teamSummary.upsetChance}%
                </div>
              </div>
            </section>

            <div className="grid gap-6">
              <div className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                  <GlassCard className="border border-slate-200 bg-white p-6 shadow-none">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Injury impact</p>
                        <h3 className="mt-2 text-2xl font-semibold text-slate-900">Roster health</h3>
                      </div>
                      <ShieldAlert className="h-5 w-5 text-amber-500" />
                    </div>

                    <div className="mt-6 space-y-4">
                      {injuries.map((item) => (
                        <div
                          key={item.player}
                          className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="font-semibold text-slate-900">{item.player}</p>
                              <p className="text-sm text-slate-500">{item.status}</p>
                            </div>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                                item.impact === "Low"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {item.impact}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  <GlassCard className="border border-slate-200 bg-white p-6 shadow-none">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Performance radar</p>
                        <h3 className="mt-2 text-2xl font-semibold text-slate-900">Team strengths</h3>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-500">
                        Real-time
                      </span>
                    </div>

                    <div className="mt-6 h-[420px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="metric" tick={{ fill: "#475569", fontSize: 12 }} />
                          <PolarRadiusAxis angle={30} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                          <Radar
                            name="Spain"
                            dataKey="Spain"
                            stroke="#f97316"
                            fill="#fb923c"
                            fillOpacity={0.20}
                          />
                          <Radar
                            name="Argentina"
                            dataKey="Argentina"
                            stroke="#0284c7"
                            fill="#38bdf8"
                            fillOpacity={0.14}
                          />
                          <Tooltip
                            contentStyle={{
                              background: "#ffffff",
                              border: "1px solid #e2e8f0",
                              borderRadius: 12,
                              color: "#0f172a",
                            }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </GlassCard>
                </div>

                <GlassCard className="grid gap-6 border border-slate-200 bg-white p-6 lg:grid-cols-[0.95fr_0.85fr] shadow-none">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">Team comparison</h3>
                        <p className="text-sm text-slate-500">Select a profile to inspect momentum and tactical outlook.</p>
                      </div>
                      <div className="flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-700">
                        <Zap className="h-4 w-4 text-cyan-600" /> Live scouting
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {teamComparison.map((team) => (
                        <button
                          key={team.id}
                          type="button"
                          onClick={() => setSelectedTeam(team.id)}
                          className={`rounded-[24px] border px-4 py-4 text-left transition ${
                            selectedTeam === team.id
                              ? "border-cyan-300 bg-cyan-50"
                              : "border-slate-200 bg-white hover:border-cyan-200"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{team.name}</p>
                              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">
                                FIFA rating
                              </p>
                            </div>
                            <span className="text-2xl font-semibold text-slate-900">{team.rating}</span>
                          </div>

                          <div className="mt-4 grid gap-3 text-sm text-slate-600">
                            <div className="flex items-center justify-between">
                              <span>Form</span>
                              <span>{team.form}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>xG</span>
                              <span>{team.expectedGoals.toFixed(1)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Momentum</span>
                              <span>{team.momentum}%</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-5 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Selected profile</p>
                        <h3 className="mt-2 text-2xl font-semibold text-slate-900">{selectedProfile.name}</h3>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-500">
                        Priority
                      </span>
                    </div>

                    <div className="grid gap-3 text-sm text-slate-700">
                      <div className="flex items-center justify-between rounded-[20px] bg-white px-4 py-3">
                        <span>Possession</span>
                        <span>{selectedProfile.possession}%</span>
                      </div>
                      <div className="flex items-center justify-between rounded-[20px] bg-white px-4 py-3">
                        <span>Expected goals</span>
                        <span>{selectedProfile.expectedGoals.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-[20px] bg-white px-4 py-3">
                        <span>Momentum</span>
                        <span>{selectedProfile.momentum}%</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="grid gap-6 border border-slate-200 bg-white p-6 xl:grid-cols-[1fr_0.95fr] shadow-none">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-slate-500">
                      <BarChart2 className="h-4 w-4 text-cyan-600" /> Probability & upset pressure
                    </div>

                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                          <CartesianGrid stroke="#e2e8f0" opacity={0.7} vertical={false} />
                          <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
                          <Tooltip
                            contentStyle={{
                              background: "#ffffff",
                              border: "1px solid #e2e8f0",
                              borderRadius: 12,
                              color: "#0f172a",
                            }}
                          />
                          <Bar dataKey="probability" radius={[12, 12, 0, 0]}>
                            {barData.map((entry) => (
                              <Cell
                                key={`${entry.name}-probability`}
                                fill={entry.name === "Spain" ? "#f97316" : "#38bdf8"}
                              />
                            ))}
                          </Bar>
                          <Bar dataKey="upset" radius={[12, 12, 0, 0]} fill="#fb7185" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-4 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Match momentum</p>
                        <h3 className="mt-2 text-xl font-semibold text-slate-900">Phase control</h3>
                      </div>
                    </div>

                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={momentumTimeline} margin={{ top: 8, right: 18, left: -10, bottom: 0 }}>
                          <CartesianGrid stroke="#e2e8f0" opacity={0.7} vertical={false} />
                          <XAxis dataKey="phase" tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
                          <Tooltip
                            contentStyle={{
                              background: "#ffffff",
                              border: "1px solid #e2e8f0",
                              borderRadius: 12,
                              color: "#0f172a",
                            }}
                          />
                          <Line type="monotone" dataKey="Spain" stroke="#f97316" strokeWidth={3} dot={false} />
                          <Line type="monotone" dataKey="Argentina" stroke="#0284c7" strokeWidth={3} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </GlassCard>

                {report ? (
                  <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <GlassCard className="rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-none">
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Report</p>
                      <h2 className="mt-3 text-2xl font-semibold text-slate-900">{report.title}</h2>
                      <p className="mt-3 text-slate-600">{report.summary}</p>

                      <div className="mt-6 space-y-4">
                        {report.scouting.map((item, index) => (
                          <div
                            key={`${item.team}-${index}`}
                            className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <h3 className="font-semibold text-slate-900">{item.team}</h3>
                              <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
                                {item.signal}
                              </span>
                            </div>
                            <p className="mt-2 text-sm font-medium text-slate-700">{item.headline}</p>
                            <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                          </div>
                        ))}
                      </div>
                    </GlassCard>

                    <GlassCard className="rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-none">
                      <h2 className="text-2xl font-semibold text-slate-900">Tactical & simulation intelligence</h2>

                      <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Simulation Summary</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-slate-600">Favorite</span>
                          <span className="font-semibold text-slate-900">
                            {report.simulationSummary.favorite}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-slate-600">Upset Chance</span>
                          <span className="font-semibold text-slate-900">
                            {report.simulationSummary.upsetChance}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-slate-600">Confidence</span>
                          <span className="font-semibold text-slate-900">
                            {report.simulationSummary.confidence}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 space-y-3">
                        {report.tacticalAnalysis.map((item) => (
                          <div
                            key={item.title}
                            className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
                          >
                            <h3 className="font-semibold text-slate-900">{item.title}</h3>
                            <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 space-y-3">
                        {report.matchBreakdown.map((item) => (
                          <div
                            key={item.fixture}
                            className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
                          >
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
          </div>
        ) : (
          <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-10 text-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700">
                  <Lock className="h-4 w-4" /> Premium access required
                </span>
                <h2 className="text-3xl font-semibold text-slate-900">
                  Unlock the premium war-room experience
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-slate-600">
                  Once the wallet payment is verified, this section will show the full final recap, tactical charts, team comparison, and injury insights.
                </p>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">What becomes available</p>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li>• Match recap and prediction summary</li>
                  <li>• Momentum and probability charts</li>
                  <li>• Team comparison and tactical overlays</li>
                  <li>• Injury impact and roster health insights</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  </div>
);
}
