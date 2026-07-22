import { type ZodType } from "zod";
import {
  getMatches,
  getLiveMatches,
  getTeamStats,
  predictMatch,
  simulateTournament,
  getTournamentBracket,
  getTopPredictions,
} from "../lib/mcp";
import {
  emptyInputSchema,
  getMatchesSchema,
  getLiveMatchesSchema,
  getTeamStatsSchema,
  predictMatchSchema,
  simulateTournamentSchema,
  getTournamentBracketSchema,
  getTopPredictionsSchema,
  predictionInputSchema,
  simulationInputSchema,
  teamStatsInputSchema,
} from "./schemas";

type ToolDefinition = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  schema: ZodType<Record<string, unknown>>;
  handler: (args: Record<string, unknown>) => Promise<unknown> | unknown;
};

export const tools: ToolDefinition[] = [
  {
    name: "getMatches",
    description: "Get recent World Cup matches.",
    inputSchema: emptyInputSchema,
    schema: getMatchesSchema,
    handler: async () => {
      const matches = await getMatches();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(matches, null, 2),
          },
        ],
      };
    },
  },
  {
    name: "getLiveMatches",
    description: "Get live or in-play matches.",
    inputSchema: emptyInputSchema,
    schema: getLiveMatchesSchema,
    handler: async () => {
      const matches = await getLiveMatches();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(matches, null, 2),
          },
        ],
      };
    },
  },
  {
    name: "getTeamStats",
    description: "Get team intelligence and current form details.",
    inputSchema: teamStatsInputSchema,
    schema: getTeamStatsSchema,
    handler: async (args) => {
      const { team } = args as { team: string };
      const stats = await getTeamStats(team);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(stats, null, 2),
          },
        ],
      };
    },
  },
  {
    name: "predictMatch",
    description: "Predict the winner of a match between two teams.",
    inputSchema: predictionInputSchema,
    schema: predictMatchSchema,
    handler: async (args) => {
      const { team1, team2 } = args as { team1: string; team2: string };
      const result = await predictMatch(team1, team2);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  },
  {
    name: "simulateTournament",
    description: "Simulate a tournament and return champion probabilities.",
    inputSchema: simulationInputSchema,
    schema: simulateTournamentSchema,
    handler: async (args) => {
      const { runs } = args as { runs: number };
      const result = simulateTournament(runs);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  },
  {
    name: "getTournamentBracket",
    description: "Get the current tournament bracket structure.",
    inputSchema: emptyInputSchema,
    schema: getTournamentBracketSchema,
    handler: async () => {
      const bracket = getTournamentBracket();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(bracket, null, 2),
          },
        ],
      };
    },
  },
  {
    name: "getTopPredictions",
    description: "Get the top match predictions.",
    inputSchema: emptyInputSchema,
    schema: getTopPredictionsSchema,
    handler: async () => {
      const predictions = await getTopPredictions();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(predictions, null, 2),
          },
        ],
      };
    },
  },
];

export type MCPTool = (typeof tools)[number];
