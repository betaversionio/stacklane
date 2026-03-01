# StackLane

Browser-based OS-like UI for managing remote servers via SSH.

[![npm version](https://img.shields.io/npm/v/stacklane)](https://www.npmjs.com/package/stacklane)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](https://github.com/betaversionio/stacklane/blob/main/LICENSE)

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

- **Terminal** - Full interactive SSH terminal powered by xterm.js
- **File Manager** - Browse, upload, download, and edit files over SFTP
- **Stats Monitor** - Real-time CPU, memory, disk, and network stats
- **Connections** - Save and manage multiple SSH server connections
- **Keychain** - Store SSH keys for passwordless authentication
- **Tunnels** - Create SSH port forwarding tunnels
- **Buckets** - Organize connections into groups

## Requirements

- Node.js 18+

## License

MIT
