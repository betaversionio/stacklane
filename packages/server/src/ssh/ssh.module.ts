import { Global, Module } from "@nestjs/common";
import { SshService } from "./ssh.service.js";

@Global()
@Module({
  providers: [SshService],
  exports: [SshService],
})
export class SshModule {}
