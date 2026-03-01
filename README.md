# StackLane

Browser-based OS-like UI for managing remote servers via SSH.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Quick Start

```bash
npx stacklane
```

Or install globally:

```bash
npm i -g stacklane
stacklane
```

Opens a browser UI at `http://localhost:3721` where you can manage SSH connections, browse files via SFTP, open terminals, and monitor server stats.

## CLI Options

```
stacklane [options]

Options:
  -p, --port <number>  Port to run on (default: 3721)
  --no-open            Don't open browser automatically
  -V, --version        Output version number
  -h, --help           Display help
```

## Features

- **Terminal** - Full interactive SSH terminal (xterm.js)
- **File Manager** - Browse, upload, download, and edit files over SFTP
- **Stats Monitor** - Real-time CPU, memory, disk, and network stats
- **Connections** - Save and manage multiple SSH server connections
- **Keychain** - Store SSH keys for passwordless authentication
- **Tunnels** - Create SSH port forwarding tunnels
- **Buckets** - Organize connections into groups

## Development

### Prerequisites

- Node.js 18+
- pnpm 9+

### Setup

```bash
git clone https://github.com/betaversionio/stacklane.git
cd StackLane
pnpm install
```

### Dev Mode

Run the server and web frontend with hot reload:

```bash
pnpm dev
```

Or run them separately:

```bash
pnpm dev:server   # NestJS server on :3721
pnpm dev:web      # Vite dev server on :5173 (proxies API to :3721)
```

### Project Structure

```
packages/
  shared/    - Shared TypeScript types (API, connection, stats, etc.)
  server/    - NestJS backend (SSH, SFTP, WebSocket terminal, stats)
  web/       - React frontend (Vite + Tailwind CSS v4 + Radix UI)
  cli/       - CLI entry point + npm package bundling
```

### Build

```bash
pnpm build          # Build all packages
pnpm build:pkg      # Build + bundle into publishable CLI package
```

### Test Locally

```bash
pnpm build:pkg      # Full build
pnpm link:cli       # Link globally
stacklane           # Run it
pnpm unlink:cli     # Unlink when done
```

### Publish

```bash
pnpm publish:dry    # Dry run
pnpm publish:npm    # Publish to npm
```

## Tech Stack

| Layer    | Technology                                          |
| -------- | --------------------------------------------------- |
| Frontend | React 19, TypeScript, Tailwind CSS v4, Radix UI     |
| Terminal | xterm.js                                            |
| Backend  | NestJS, Express, ssh2, WebSocket (ws)               |
| Database | SQLite (sql.js) + Drizzle ORM                       |
| Build    | Turborepo, pnpm workspaces, Vite                    |
| CLI      | Commander.js                                        |

## License

MIT
