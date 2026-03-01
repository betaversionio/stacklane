import { Module } from "@nestjs/common";
import { StoreModule } from "./store/store.module.js";
import { SshModule } from "./ssh/ssh.module.js";
import { HealthModule } from "./health/health.module.js";
import { ConnectionsModule } from "./connections/connections.module.js";
import { KeychainModule } from "./keychain/keychain.module.js";
import { BucketsModule } from "./buckets/buckets.module.js";
import { SftpModule } from "./sftp/sftp.module.js";
import { StatsModule } from "./stats/stats.module.js";
import { TerminalModule } from "./terminal/terminal.module.js";
import { TunnelModule } from "./tunnel/tunnel.module.js";

@Module({
  imports: [
    StoreModule,
    SshModule,
    HealthModule,
    ConnectionsModule,
    KeychainModule,
    BucketsModule,
    SftpModule,
    StatsModule,
    TerminalModule,
    TunnelModule,
  ],
})
export class AppModule {}
