"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import GlassCard from "@/components/GlassCard";

const teams = [
  { id: "spain", name: "Spain", strength: 96, color: "from-red-400 to-orange-500" },
  { id: "argentina", name: "Argentina", strength: 94, color: "from-sky-400 to-cyan-500" },
  { id: "france", name: "France", strength: 92, color: "from-blue-500 to-indigo-500" },
  { id: "brazil", name: "Brazil", strength: 90, color: "from-yellow-400 to-green-500" },
  { id: "england", name: "England", strength: 89, color: "from-slate-400 to-slate-700" },
  { id: "germany", name: "Germany", strength: 88, color: "from-amber-500 to-slate-600" },
  { id: "portugal", name: "Portugal", strength: 87, color: "from-emerald-500 to-emerald-700" },
  { id: "netherlands", name: "Netherlands", strength: 86, color: "from-orange-400 to-red-500" },
];

const bracketSeeds = [
  ["spain", "argentina"],
  ["france", "england"],
  ["brazil", "germany"],
  ["portugal", "netherlands"],
];

const getTeam = (id: string) => teams.find((team) => team.id === id)!;

const simulateMatch = (teamA: typeof teams[number], teamB: typeof teams[number]) => {
  const scoreA = teamA.strength + (Math.random() - 0.5) * 20;
  const scoreB = teamB.strength + (Math.random() - 0.5) * 20;
  return scoreA >= scoreB ? teamA : teamB;
};

const runBracket = () => {
  const qfWinners = bracketSeeds.map(([home, away]) => {
    const winner = simulateMatch(getTeam(home), getTeam(away));
    return winner;
  });

  const semi1 = simulateMatch(qfWinners[0], qfWinners[1]);
  const semi2 = simulateMatch(qfWinners[2], qfWinners[3]);

  const finalWinner = simulateMatch(semi1, semi2);
  const runnerUp = finalWinner.id === semi1.id ? semi2 : semi1;

  return {
    qfWinners,
    semiFinalists: [semi1, semi2],
    champion: finalWinner,
    runnerUp,
  };
};

const initializeCounts = () => {
  const counts = {
    champion: Object.fromEntries(teams.map((team) => [team.id, 0])),
    runnerUp: Object.fromEntries(teams.map((team) => [team.id, 0])),
    semiFinals: Object.fromEntries(teams.map((team) => [team.id, 0])),
    finals: Object.fromEntries(teams.map((team) => [team.id, 0])),
  };
  return counts;
};

type SimulationCounts = ReturnType<typeof initializeCounts>;

type BracketResult = ReturnType<typeof runBracket>;

export default function SimulatorPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [counts, setCounts] = useState<SimulationCounts>(initializeCounts());
  const [latestBracket, setLatestBracket] = useState<BracketResult | null>(null);
  const [simulations, setSimulations] = useState(0);

  const executeSimulation = async (batchSize: number) => {
    setIsRunning(true);
    const nextCounts = initializeCounts();
    let bracket: BracketResult | null = null;

    for (let i = 0; i < batchSize; i += 1) {
      const result = runBracket();
      bracket = result;
      nextCounts.champion[result.champion.id] += 1;
      nextCounts.runnerUp[result.runnerUp.id] += 1;
      nextCounts.semiFinals[result.semiFinalists[0].id] += 1;
      nextCounts.semiFinals[result.semiFinalists[1].id] += 1;
      nextCounts.finals[result.champion.id] += 1;
      nextCounts.finals[result.runnerUp.id] += 1;
    }

    setCounts(nextCounts);
    setSimulations(batchSize);
    setLatestBracket(bracket);
    setIsRunning(false);
  };

  const chartData = useMemo(() => {
    const total = Math.max(simulations, 1);
    return teams.map((team) => ({
      name: team.name,
      champion: (counts.champion[team.id] / total) * 100,
      finals: (counts.finals[team.id] / total) * 100,
      semis: (counts.semiFinals[team.id] / total) * 100,
      color: team.color,
    }));
  }, [counts, simulations]);

  const sortedChamps = [...chartData].sort((a, b) => b.champion - a.champion);
  const topChampion = simulations > 0 ? sortedChamps[0] : null;

  return (
    <div className="space-y-8 pb-24 px-28 py-24">
      <section className="flex flex-col gap-6 rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/30">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">AI Bracket Simulator</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-900">Simulate bracket outcomes for top international teams</h1>
            <p className="mt-3 max-w-2xl text-slate-600">Run tournament simulations using team strength, form, and randomness to inspect champion probability, bracket progression, and final matchup forecasts.</p>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <GlassCard className="space-y-3">
            <div className="text-sm uppercase tracking-[0.24em] text-slate-500">Simulations</div>
            <div className="text-4xl font-bold text-slate-900">{simulations}</div>
            <p className="text-sm text-slate-600">Total tournament runs in the current session.</p>
          </GlassCard>

          <GlassCard className="space-y-3">
            <div className="text-sm uppercase tracking-[0.24em] text-slate-500">Top Champion</div>
            <div className="text-4xl font-bold text-slate-900">
              {topChampion ? topChampion.name : "Run a simulation"}
            </div>
            <p className="text-sm text-slate-600">
              {topChampion
                ? `${topChampion.champion.toFixed(1)}% champion probability`
                : "No results yet — run a simulation to see the latest forecast."}
            </p>
          </GlassCard>

          <GlassCard className="space-y-3">
            <div className="text-sm uppercase tracking-[0.24em] text-slate-500">Simulation Speed</div>
            <div className="text-4xl font-bold text-slate-900">{isRunning ? "Running" : "Ready"}</div>
            <p className="text-sm text-slate-600">Use the buttons below to run 1, 100, or 1000 simulations.</p>
          </GlassCard>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <GlassCard className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Simulation controls</h2>
              <p className="mt-1 text-sm text-slate-600">Choose the number of runs and scan how probabilities change with scale.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {[1, 100, 1000].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => void executeSimulation(value)}
                  className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                  disabled={isRunning}
                >
                  {value.toLocaleString()} Run{value > 1 ? "s" : ""}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {teams.map((team) => (
              <div key={team.id} className="rounded-3xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{team.name}</p>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Strength {team.strength}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${team.color}`} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Champion probability</h2>
              <p className="mt-1 text-sm text-slate-600">Higher simulation counts reduce variance and surface stable favorites.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-500">{simulations || 1} runs</span>
          </div>

          <div className="space-y-3">
            {sortedChamps.map((entry) => (
              <div key={entry.name} className="space-y-2 rounded-3xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-slate-900">{entry.name}</span>
                  <span className="text-sm font-semibold text-slate-900">{entry.champion.toFixed(1)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${entry.color}`}
                    style={{ width: `${entry.champion.toFixed(1)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.85fr]">
        <GlassCard className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Tournament bracket preview</h2>
            <p className="mt-1 text-sm text-slate-600">The latest simulation run displays a proposed bracket outcome.</p>
          </div>

          {latestBracket ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {bracketSeeds.map(([home, away], index) => {
                  const winner = latestBracket.qfWinners[index];
                  return (
                    <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Quarterfinal {index + 1}</div>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span>{getTeam(home).name}</span>
                          <span className="text-slate-600">{winner.id === home ? "✔" : ""}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{getTeam(away).name}</span>
                          <span className="text-slate-600">{winner.id === away ? "✔" : ""}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { label: "Semifinal 1", team: latestBracket.semiFinalists[0] },
                  { label: "Semifinal 2", team: latestBracket.semiFinalists[1] },
                ].map((entry) => (
                  <div key={entry.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{entry.label}</div>
                    <div className="mt-3 text-lg font-semibold text-slate-900">{entry.team.name}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Final</div>
                <div className="mt-3 flex flex-col gap-2">
                  <div className="text-lg font-semibold text-slate-900">Champion: {latestBracket.champion.name}</div>
                  <div className="text-sm text-slate-600">Runner-up: {latestBracket.runnerUp.name}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-slate-500">
              Run a simulation to preview the bracket and champion path.
            </div>
          )}
        </GlassCard>

        <GlassCard className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Team progression forecast</h2>
            <p className="mt-1 text-sm text-slate-600">See how often each team reaches the semis, final, and title across simulations.</p>
          </div>

          <div className="space-y-4">
            {chartData.map((team) => (
              <div key={team.name} className="rounded-3xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-slate-900">{team.name}</span>
                  <span className="text-sm text-slate-600">Champ: {team.champion.toFixed(1)}%</span>
                </div>
                <div className="mt-3 space-y-3">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Final appearances</div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div className={`h-full rounded-full bg-gradient-to-r ${team.color}`} style={{ width: `${team.finals.toFixed(1)}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Semifinals</div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div className={`h-full rounded-full bg-gradient-to-r ${team.color}`} style={{ width: `${team.semis.toFixed(1)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
