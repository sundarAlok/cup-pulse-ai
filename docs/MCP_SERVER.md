# MCP Server for CupPulse AI

This documentation describes the Model Context Protocol (MCP) server built for CupPulse AI. It exposes football intelligence tools to AI agents and internal workflows.

## Overview

The MCP server is available as a Next.js API route at `/api/mcp`.

### Supported tools

1. `getMatches()` — returns recent World Cup match data.
2. `getLiveMatches()` — returns only live or in-play matches.
3. `getTeamStats(team)` — returns team profile details, ratings, and AI summary.
4. `predictMatch(team1, team2)` — uses AI to return match winner prediction.
5. `simulateTournament()` — simulates tournament outcomes across many runs.
6. `getTournamentBracket()` — returns the current tournament bracket structure.
7. `getTopPredictions()` — returns the top AI match prediction candidates.

## API usage

### GET requests

All GET requests use `action` as a query parameter.

Example:

```http
GET /api/mcp?action=getMatches
```

Supported actions:

- `getMatches`
- `getLiveMatches`
- `getTeamStats&team=<teamName>`
- `getTournamentBracket`
- `getTopPredictions`

### POST requests

All POST requests use an `action` field in the JSON body.

Example:

```http
POST /api/mcp
Content-Type: application/json

{
  "action": "predictMatch",
  "team1": "Brazil",
  "team2": "France"
}
```

Supported actions:

- `predictMatch` with `team1` and `team2`
- `simulateTournament` with optional `runs`

## Deployment

1. Install dependencies:

```bash
npm install
```

2. Set environment variables:

- `FOOTBALL_API_KEY` — football-data.org API key
- `GROQ_API_KEY` — Groq chat API key

3. Run the app:

```bash
npm run dev
```

4. Test the MCP endpoints:

```bash
curl "http://localhost:3000/api/mcp?action=getMatches"
```

## Error handling

The MCP API returns JSON with `success: false` for invalid parameters or server errors, and HTTP status codes 400 or 500.
