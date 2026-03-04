import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type {
  ApiResponse,
  CloudProviderCredential,
  CloudProviderCredentialInput,
  CloudProviderTestConnectionRequest,
  CloudProviderTestConnectionResponse,
  CloudResourceDiscoveryResponse,
  CloudResourceImportRequest,
  CloudResourceImportResponse,
} from '@stacklane/shared';
import { CloudProvidersService } from './cloud-providers.service.js';

@Controller('cloud-providers')
export class CloudProvidersController {
  constructor(private readonly cloudProvidersService: CloudProvidersService) {}

  /**
   * Test cloud provider credentials without saving
   * POST /cloud-providers/test-connection
   */
  @Post('test-connection')
  @HttpCode(HttpStatus.OK)
  async testConnection(
    @Body() request: CloudProviderTestConnectionRequest,
  ): Promise<ApiResponse<CloudProviderTestConnectionResponse>> {
    const result = await this.cloudProvidersService.testConnection(request);
    return {
      success: result.success,
      data: result,
    };
  }

  /**
   * Create and save cloud provider credentials
   * POST /cloud-providers
   */
  @Post()
  async create(
    @Body() input: CloudProviderCredentialInput,
  ): Promise<ApiResponse<CloudProviderCredential>> {
    const credential = await this.cloudProvidersService.createCredential(input);
    return {
      success: true,
      data: credential,
    };
  }

  /**
   * Get all cloud provider credentials
   * GET /cloud-providers
   */
  @Get()
  async findAll(): Promise<ApiResponse<CloudProviderCredential[]>> {
    const credentials = await this.cloudProvidersService.getAllCredentials();
    return {
      success: true,
      data: credentials,
    };
  }

  /**
   * Get a specific cloud provider credential
   * GET /cloud-providers/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<CloudProviderCredential>> {
    const credential = await this.cloudProvidersService.getCredentialById(id);
    return {
      success: true,
      data: credential,
    };
  }

  /**
   * Delete a cloud provider credential
   * DELETE /cloud-providers/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.cloudProvidersService.deleteCredential(id);
  }

  /**
   * Discover all resources (compute + storage) from a cloud provider
   * GET /cloud-providers/:id/discover
   */
  @Get(':id/discover')
  async discover(
    @Param('id') id: string,
  ): Promise<ApiResponse<CloudResourceDiscoveryResponse>> {
    const discovery = await this.cloudProvidersService.discoverResources(id);
    return {
      success: true,
      data: discovery,
    };
  }

  /**
   * Import selected cloud resources
   * POST /cloud-providers/import
   */
  @Post('import')
  async import(
    @Body() request: CloudResourceImportRequest,
  ): Promise<ApiResponse<CloudResourceImportResponse>> {
    const result = await this.cloudProvidersService.importResources(request);
    return {
      success: result.success,
      data: result,
    };
  }
}
