import type { MarketplaceApp } from "@stacklane/shared";
import type { MarketplaceAppType } from "../os/types/window";

/** @deprecated Use `MarketplaceApp` from `@stacklane/shared` directly */
export type MarketplaceAppManifest = MarketplaceApp;

export interface InstalledApp {
  manifest: MarketplaceAppManifest;
  installedAt: number;
}

export function toMarketAppType(id: string): MarketplaceAppType {
  return `market:${id}`;
}

export function fromMarketAppType(appType: MarketplaceAppType): string {
  return appType.slice("market:".length);
}
