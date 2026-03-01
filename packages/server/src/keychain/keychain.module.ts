import { Module } from "@nestjs/common";
import { KeychainController } from "./keychain.controller.js";
import { KeychainService } from "./keychain.service.js";

@Module({
  controllers: [KeychainController],
  providers: [KeychainService],
  exports: [KeychainService],
})
export class KeychainModule {}
