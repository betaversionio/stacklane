import { Module } from "@nestjs/common";
import { TunnelController } from "./tunnel.controller.js";
import { TunnelService } from "./tunnel.service.js";

@Module({
  controllers: [TunnelController],
  providers: [TunnelService],
})
export class TunnelModule {}
