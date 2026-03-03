# StackLane

Browser-based OS-like UI for managing remote servers via SSH.

![Version](https://img.shields.io/badge/version-0.1.4-blue)
![License](https://img.shields.io/badge/license-MIT-green)

![Dashboard](https://raw.githubusercontent.com/betaversionio/stacklane/main/images/19-dashboard.png)

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

### 🖥️ Terminal

Full interactive SSH terminal with xterm.js, customizable themes, and one-click app installation.

![Terminal](https://raw.githubusercontent.com/betaversionio/stacklane/main/images/16-terminal-fullscreen.png)

**App Catalog** - Install popular self-hosted apps with one click:

![App Catalog](https://raw.githubusercontent.com/betaversionio/stacklane/main/images/01-terminal-app-catalog.png)

**Customization** - Multiple themes, fonts, and text sizes:

![Terminal Appearance](https://raw.githubusercontent.com/betaversionio/stacklane/main/images/02-terminal-appearance.png)

### 📁 File Manager

Browse, upload, download, and edit files over SFTP with a modern file explorer interface.

![File Manager](https://raw.githubusercontent.com/betaversionio/stacklane/main/images/09-file-manager.png)

### 📊 Stats Monitor

Real-time CPU, memory, disk, and network monitoring for your servers.

![Monitor](https://raw.githubusercontent.com/betaversionio/stacklane/main/images/11-monitor-stats.png)

### 🗄️ Storage Management

Connect and manage S3-compatible storage buckets (AWS S3, Cloudflare R2, etc.).

![Storage](https://raw.githubusercontent.com/betaversionio/stacklane/main/images/14-storage-buckets.png)

### 🔐 Keychain

Store SSH keys for passwordless authentication across all your servers.

![Keychain](https://raw.githubusercontent.com/betaversionio/stacklane/main/images/13-keychain.png)

### 🖼️ OS Integration

Access your server's desktop environment directly from the browser.

![OS Desktop](https://raw.githubusercontent.com/betaversionio/stacklane/main/images/07-os-desktop.png)

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

| Layer    | Technology                                      |
| -------- | ----------------------------------------------- |
| Frontend | React 19, TypeScript, Tailwind CSS v4, Radix UI |
| Terminal | xterm.js                                        |
| Backend  | NestJS, Express, ssh2, WebSocket (ws)           |
| Database | SQLite (sql.js) + Drizzle ORM                   |
| Build    | Turborepo, pnpm workspaces, Vite                |
| CLI      | Commander.js                                    |

## License

MIT
