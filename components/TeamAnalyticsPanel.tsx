"use client";

import Image from "next/image";
import React from "react";

type TeamAnalyticsData = {
  name: string;
  ranking: string;
  attack: string;
  defense: string;
  form: string;
  probability: string;
  xg: string;
  recent: string[];
  summary: string;
};

const flagMap: Record<string, string> = {
  Argentina: "ar",
  Brazil: "br",
  France: "fr",
  England: "gb",
  Germany: "de",
  Spain: "es",
  Portugal: "pt",
  Mexico: "mx",
  USA: "us",
  Canada: "ca",
  Japan: "jp",
  Australia: "au",
  Morocco: "ma",
  Croatia: "hr",
  Netherlands: "nl",
  Belgium: "be",
  Uruguay: "uy",
  Serbia: "rs",
  Poland: "pl",
  Denmark: "dk",
  Switzerland: "ch",
  "South Korea": "kr",
  "Saudi Arabia": "sa",
  Qatar: "qa",
  Ecuador: "ec",
  Cameroon: "cm",
  Ghana: "gh",
  Senegal: "sn",
  Tunisia: "tn",
  "South Africa": "za",
};

const getFlagSrc = (teamName: string) => {
  const countryCode = flagMap[teamName];
  return countryCode ? `https://flagcdn.com/w40/${countryCode}.png` : undefined;
};

type TeamAnalyticsPanelProps = {
  team: TeamAnalyticsData | null;
};

export default function TeamAnalyticsPanel({ team }: TeamAnalyticsPanelProps) {
  const placeholder: TeamAnalyticsData = {
    name: "Select a team",
    ranking: "--",
    attack: "--",
    defense: "--",
    form: "--",
    probability: "--",
    xg: "--",
    recent: ["Select a node to see performance details."],
    summary: "Team analytics will appear here when you click a team or match node in the graph.",
  };
  const data = team ?? placeholder;

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-premium">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          {getFlagSrc(data.name) ? (
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-slate-100">
              <Image
                src={getFlagSrc(data.name)!}
                alt={`${data.name} flag`}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
          ) : null}
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Team Intelligence Panel</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">{data.name}</h3>
          </div>
        </div>
        <div className="rounded-full bg-slate-50 px-4 py-2 text-sm text-slate-600 shadow-sm">
          {team ? "Live team analytics" : "Awaiting selection"}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl bg-slate-50 p-4">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">FIFA Ranking</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{data.ranking}</div>
        </div>

        <div className="rounded-3xl bg-slate-50 p-4">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Attack Rating</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{data.attack}</div>
        </div>

        <div className="rounded-3xl bg-slate-50 p-4">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Defense Rating</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{data.defense}</div>
        </div>

        <div className="rounded-3xl bg-slate-50 p-4">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Form Score</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{data.form}</div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Tournament Win Probability</div>
          <div className="mt-3 text-3xl font-bold text-slate-900">{data.probability}</div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" style={{ width: data.probability.replace("%", "") + "%" }} />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Expected Goals</div>
          <div className="mt-3 text-3xl font-bold text-slate-900">{data.xg}</div>
          <div className="mt-3 text-sm text-slate-600">Projected expected goals based on current form and offensive pressure.</div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-3xl bg-slate-50 p-5 shadow-sm">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Recent Form</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {data.recent.map((item, index) => (
              <li key={index} className="rounded-2xl bg-white p-3">{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">AI Summary</div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{data.summary}</p>
        </div>
      </div>
    </div>
  );
}

export type { TeamAnalyticsData };