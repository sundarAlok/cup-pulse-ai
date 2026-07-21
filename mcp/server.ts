import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { tools } from "./tools";

const server = new Server(
  {
    name: "cup-pulse-ai",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: tools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
  })),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = tools.find((candidate) => candidate.name === request.params.name);

  if (!tool) {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }

  const parsed = tool.schema.safeParse(request.params.arguments ?? {});

  if (!parsed.success) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: parsed.error.flatten() }, null, 2),
        },
      ],
      isError: true,
    };
  }

  return tool.handler(parsed.data);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("CupPulse MCP server running on stdio");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
