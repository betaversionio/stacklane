import { Controller, Get, Post, Put, Delete, Param, Body, Res, Inject } from "@nestjs/common";
import type { Response } from "express";
import type { ApiResponse, BucketCredential, BucketCredentialInput } from "@stacklane/shared";
import { BucketsService } from "./buckets.service.js";

@Controller("buckets")
export class BucketsController {
  constructor(@Inject(BucketsService) private readonly buckets: BucketsService) {}

  @Get()
  list(): ApiResponse<BucketCredential[]> {
    return { success: true, data: this.buckets.list() };
  }

  @Get(":id")
  get(
    @Param("id") id: string,
    @Res({ passthrough: true }) res: Response
  ): ApiResponse<BucketCredential> | ApiResponse {
    const cred = this.buckets.get(id);
    if (!cred) {
      res.status(404);
      return { success: false, error: "Bucket credential not found" };
    }
    return { success: true, data: cred };
  }

  @Post()
  create(
    @Body() input: BucketCredentialInput,
    @Res({ passthrough: true }) res: Response
  ): ApiResponse<BucketCredential> {
    const cred = this.buckets.create(input);
    res.status(201);
    return { success: true, data: cred };
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() updates: Partial<BucketCredential>,
    @Res({ passthrough: true }) res: Response
  ): ApiResponse<BucketCredential> | ApiResponse {
    const updated = this.buckets.update(id, updates);
    if (!updated) {
      res.status(404);
      return { success: false, error: "Bucket credential not found" };
    }
    return { success: true, data: updated };
  }

  @Delete(":id")
  remove(
    @Param("id") id: string,
    @Res({ passthrough: true }) res: Response
  ): ApiResponse {
    const deleted = this.buckets.delete(id);
    if (!deleted) {
      res.status(404);
      return { success: false, error: "Bucket credential not found" };
    }
    return { success: true };
  }
}
