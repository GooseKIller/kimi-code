import { writeFileSync } from 'node:fs';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const pidFile = process.env['KIMI_TEST_ORPHAN_PID_FILE'];
if (pidFile !== undefined && pidFile !== '') {
  writeFileSync(pidFile, String(process.pid));
}

const server = new McpServer({ name: 'orphan-stdout', version: '0.0.1' });

server.registerTool(
  'sever_stdout',
  { description: 'Responds, then closes stdout and keeps running', inputSchema: {} },
  () => {
    setTimeout(() => {
      process.stdout.end();
    }, 100);
    return { content: [{ type: 'text', text: 'severing' }] };
  },
);

await server.connect(new StdioServerTransport());

setInterval(() => {}, 60_000);
