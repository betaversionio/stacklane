import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Res,
  Req,
  Inject,
} from "@nestjs/common";
import type { Request, Response } from "express";
import type {
  ApiResponse,
  BucketInfo,
  BucketObjectListing,
  BucketStats,
} from "@stacklane/shared";
import { StorageClientService } from "./storage-client.service.js";

@Controller("storage/:credentialId/explore")
export class StorageExplorerController {
  constructor(
    @Inject(StorageClientService)
    private readonly storage: StorageClientService
  ) {}

  @Get("buckets")
  async listBuckets(
    @Param("credentialId") credentialId: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<ApiResponse<BucketInfo[]>> {
    try {
      const buckets = await this.storage.listBuckets(credentialId);
      return { success: true, data: buckets };
    } catch (err: any) {
      res.status(400);
      return { success: false, error: err.message };
    }
  }

  @Get("objects")
  async listObjects(
    @Param("credentialId") credentialId: string,
    @Query("bucket") bucket: string,
    @Query("prefix") prefix: string,
    @Query("token") token: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<ApiResponse<BucketObjectListing>> {
    try {
      const listing = await this.storage.listObjects(
        credentialId,
        bucket,
        prefix || undefined,
        token || undefined
      );
      return { success: true, data: listing };
    } catch (err: any) {
      res.status(400);
      return { success: false, error: err.message };
    }
  }

  @Get("stats")
  async getStats(
    @Param("credentialId") credentialId: string,
    @Query("bucket") bucket: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<ApiResponse<BucketStats>> {
    try {
      const stats = await this.storage.getBucketStats(credentialId, bucket);
      return { success: true, data: stats };
    } catch (err: any) {
      res.status(400);
      return { success: false, error: err.message };
    }
  }

  @Get("download")
  async getDownloadUrl(
    @Param("credentialId") credentialId: string,
    @Query("bucket") bucket: string,
    @Query("key") key: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<ApiResponse<string>> {
    try {
      const url = await this.storage.getPresignedDownloadUrl(
        credentialId,
        bucket,
        key
      );
      return { success: true, data: url };
    } catch (err: any) {
      res.status(400);
      return { success: false, error: err.message };
    }
  }

  @Get("view")
  async getViewUrl(
    @Param("credentialId") credentialId: string,
    @Query("bucket") bucket: string,
    @Query("key") key: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<ApiResponse<string>> {
    try {
      const url = await this.storage.getPresignedViewUrl(
        credentialId,
        bucket,
        key
      );
      return { success: true, data: url };
    } catch (err: any) {
      res.status(400);
      return { success: false, error: err.message };
    }
  }

  @Post("upload")
  async uploadObject(
    @Param("credentialId") credentialId: string,
    @Query("bucket") bucket: string,
    @Query("prefix") prefix: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<ApiResponse> {
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(Buffer.from(chunk));
      }
      const body = Buffer.concat(chunks);
      const fileName = (req.headers["x-file-name"] as string) || "upload";
      const contentType =
        (req.headers["content-type"] as string) || "application/octet-stream";
      const key = (prefix || "") + fileName;

      await this.storage.uploadObject(
        credentialId,
        bucket,
        key,
        body,
        contentType
      );
      res.status(201);
      return { success: true };
    } catch (err: any) {
      res.status(400);
      return { success: false, error: err.message };
    }
  }

  @Delete("objects")
  async deleteObjects(
    @Param("credentialId") credentialId: string,
    @Query("bucket") bucket: string,
    @Query("key") key: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<ApiResponse> {
    try {
      if (key) {
        await this.storage.deleteObject(credentialId, bucket, key);
      }
      return { success: true };
    } catch (err: any) {
      res.status(400);
      return { success: false, error: err.message };
    }
  }
}
