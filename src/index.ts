import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import { randomUUID } from "node:crypto";
import express from "express";
import { SERVER_TOOLS } from "./constants";
import { listModels, runOllama, startOllama } from "./ollama-executor";

const app = express();
const port = 4269;

app.use(express.json());

// Handle POST requests for client-to-server communication
app.post('/mcp', async (req, res) => {
  let transport: StreamableHTTPServerTransport;
    // New initialization request
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      enableDnsRebindingProtection: true,
      allowedHosts: ['127.0.0.1'],
      // DNS rebinding protection is disabled by default for backwards compatibility. If you are running this server
      // locally, make sure to set:
      // enableDnsRebindingProtection: true,
      // allowedHosts: ['127.0.0.1'],
    });


    const server = new McpServer({
      name: "ollama-mcp",
      version: "1.0.0"
    });

    server.registerTool(SERVER_TOOLS.LIST_MODELS, {
      title: "List Models",
      description: "Lists all available models",
    }, async() => ({
      content: [{
        type: "text",
        text: "Available models:\n\n" + await listModels()
      }]
    }));

    // Connect to the MCP server
    await server.connect(transport);

    await transport.handleRequest(req, res, req.body);
  });

app.listen(port, async() => {
    console.log(`Server listening on port ${port}`);
});