// Spawns a short-lived, isolated `node server/server.js` child process with overridden
// env vars — used by A05 to force a real Groq failure without touching the user's
// already-running dev server (npm run server on :3001) or requiring them to manually
// swap keys.
import { spawn, ChildProcessWithoutNullStreams } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../..');

export interface SpawnedServer {
  child: ChildProcessWithoutNullStreams;
  baseUrl: string;
  logs: string;
  stop: () => void;
}

export async function spawnIsolatedServer(port: number, envOverrides: Record<string, string>): Promise<SpawnedServer> {
  const child = spawn('node', ['server/server.js'], {
    cwd: projectRoot,
    env: { ...process.env, PORT: String(port), ...envOverrides },
  });

  const state: SpawnedServer = {
    child,
    baseUrl: `http://localhost:${port}/api`,
    logs: '',
    stop: () => child.kill('SIGTERM'),
  };
  child.stdout.on('data', (chunk) => { state.logs += chunk.toString(); });
  child.stderr.on('data', (chunk) => { state.logs += chunk.toString(); });

  // Generous: this project's SQLite file lives on a WSL-mounted Windows drive, where
  // cold-start I/O (dotenv + initDb) has been observed taking 15s+ on its own.
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${state.baseUrl}/config/status`, { signal: AbortSignal.timeout(1000) });
      if (res.ok) return state;
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  child.kill('SIGTERM');
  throw new Error(`Isolated server on port ${port} did not become ready within 30s`);
}
