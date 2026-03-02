import { Module } from "@nestjs/common";
import { StorageController } from "./storage.controller.js";
import { StorageExplorerController } from "./storage-explorer.controller.js";
import { StorageService } from "./storage.service.js";
import { StorageClientService } from "./storage-client.service.js";

@Module({
  controllers: [StorageController, StorageExplorerController],
  providers: [StorageService, StorageClientService],
  exports: [StorageService],
})
export class StorageModule {}
