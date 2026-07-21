# Deploying the CupPulse AI MCP Server

## Required environment variables

- `FOOTBALL_API_KEY` — API key for football-data.org
- `GROQ_API_KEY` — API key for Groq chat completions

## Install dependencies

```bash
npm install
```

## Run locally

```bash
npm run dev
```

## Production

Build the application:

```bash
npm run build
npm run start
```

## Test the MCP endpoints

```bash
curl "http://localhost:3000/api/mcp?action=getMatches"
curl "http://localhost:3000/api/mcp?action=getTeamStats&team=Brazil"
curl "http://localhost:3000/api/mcp" \
  -H "Content-Type: application/json" \
  -d '{"action":"predictMatch","team1":"Brazil","team2":"France"}'
```
