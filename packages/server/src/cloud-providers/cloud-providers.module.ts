import { Module } from '@nestjs/common';
import { CloudProvidersService } from './cloud-providers.service.js';
import { CloudProvidersController } from './cloud-providers.controller.js';
import { StoreModule } from '../store/store.module.js';
import { ConnectionsModule } from '../connections/connections.module.js';
import { StorageModule } from '../storage/storage.module.js';

@Module({
  imports: [StoreModule, ConnectionsModule, StorageModule],
  controllers: [CloudProvidersController],
  providers: [CloudProvidersService],
  exports: [CloudProvidersService],
})
export class CloudProvidersModule {}
