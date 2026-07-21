import { z } from "zod";

export const getMatchesSchema = z.object({});

export const getLiveMatchesSchema = z.object({});

export const getTeamStatsSchema = z.object({
  team: z.string().min(1),
});

export const predictMatchSchema = z.object({
  team1: z.string().min(1),
  team2: z.string().min(1),
});

export const simulateTournamentSchema = z.object({
  runs: z.number().int().positive().max(1000).optional().default(100),
});

export const getTournamentBracketSchema = z.object({});

export const getTopPredictionsSchema = z.object({});

export const emptyInputSchema = {
  type: "object",
  properties: {},
  additionalProperties: false,
};

export const teamStatsInputSchema = {
  type: "object",
  properties: {
    team: {
      type: "string",
      description: "Team name to inspect",
    },
  },
  required: ["team"],
  additionalProperties: false,
};

export const predictionInputSchema = {
  type: "object",
  properties: {
    team1: {
      type: "string",
      description: "First team name",
    },
    team2: {
      type: "string",
      description: "Second team name",
    },
  },
  required: ["team1", "team2"],
  additionalProperties: false,
};

export const simulationInputSchema = {
  type: "object",
  properties: {
    runs: {
      type: "integer",
      minimum: 1,
      maximum: 1000,
      default: 100,
      description: "Number of tournament simulations to run",
    },
  },
  additionalProperties: false,
};
