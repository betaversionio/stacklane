import { Module } from "@nestjs/common";
import { BucketsController } from "./buckets.controller.js";
import { BucketsService } from "./buckets.service.js";

@Module({
  controllers: [BucketsController],
  providers: [BucketsService],
  exports: [BucketsService],
})
export class BucketsModule {}
