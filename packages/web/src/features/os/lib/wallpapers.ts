export interface WallpaperOption {
  id: string;
  label: string;
  type: "gradient" | "image";
  value: string;
}

export const DEFAULT_WALLPAPER_ID = "image-betaversion";

export const WALLPAPERS: WallpaperOption[] = [
  {
    id: "image-betaversion",
    label: "BetaVersion",
    type: "image",
    value: "/wallpapers/betaversion-default.png",
  },
  // Gradients
  {
    id: "gradient-sunset",
    label: "Sunset",
    type: "gradient",
    value:
      "bg-gradient-to-br from-orange-400 via-rose-400 to-purple-500 dark:from-orange-900 dark:via-rose-900 dark:to-purple-950",
  },
  {
    id: "gradient-ocean",
    label: "Ocean",
    type: "gradient",
    value:
      "bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-500 dark:from-blue-900 dark:via-cyan-900 dark:to-teal-950",
  },
  {
    id: "gradient-forest",
    label: "Forest",
    type: "gradient",
    value:
      "bg-gradient-to-br from-emerald-400 via-green-400 to-lime-500 dark:from-emerald-900 dark:via-green-900 dark:to-lime-950",
  },
  {
    id: "gradient-lavender",
    label: "Lavender",
    type: "gradient",
    value:
      "bg-gradient-to-br from-purple-400 via-violet-400 to-indigo-500 dark:from-purple-900 dark:via-violet-900 dark:to-indigo-950",
  },
  {
    id: "gradient-midnight",
    label: "Midnight",
    type: "gradient",
    value:
      "bg-gradient-to-br from-slate-700 via-gray-800 to-zinc-900 dark:from-slate-900 dark:via-gray-950 dark:to-zinc-950",
  },
  {
    id: "gradient-aurora",
    label: "Aurora",
    type: "gradient",
    value:
      "bg-gradient-to-br from-green-400 via-cyan-400 to-purple-500 dark:from-green-900 dark:via-cyan-900 dark:to-purple-950",
  },
  // Local SVG images
  {
    id: "image-waves",
    label: "Waves",
    type: "image",
    value: "/wallpapers/abstract-waves.svg",
  },
  {
    id: "image-geometric",
    label: "Geometric",
    type: "image",
    value: "/wallpapers/geometric.svg",
  },
  {
    id: "image-mountains",
    label: "Mountains",
    type: "image",
    value: "/wallpapers/mountains.svg",
  },
  {
    id: "image-circles",
    label: "Circles",
    type: "image",
    value: "/wallpapers/circles.svg",
  },
  {
    id: "image-mesh",
    label: "Mesh",
    type: "image",
    value: "/wallpapers/mesh.svg",
  },
  {
    id: "image-topology",
    label: "Topology",
    type: "image",
    value: "/wallpapers/topology.svg",
  },
  // Web-hosted photos (Unsplash)
  {
    id: "photo-northern-lights",
    label: "Northern Lights",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80&fit=crop",
  },
  {
    id: "photo-mountain-lake",
    label: "Mountain Lake",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80&fit=crop",
  },
  {
    id: "photo-desert-dunes",
    label: "Desert Dunes",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1920&q=80&fit=crop",
  },
  {
    id: "photo-tropical-beach",
    label: "Tropical Beach",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80&fit=crop",
  },
  {
    id: "photo-starry-night",
    label: "Starry Night",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80&fit=crop",
  },
  {
    id: "photo-nebula",
    label: "Nebula",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80&fit=crop",
  },
  {
    id: "photo-abstract-gradient",
    label: "Abstract Flow",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=80&fit=crop",
  },
  {
    id: "photo-misty-forest",
    label: "Misty Forest",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1511497584788-876760111969?w=1920&q=80&fit=crop",
  },
  {
    id: "photo-cherry-blossoms",
    label: "Cherry Blossoms",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1920&q=80&fit=crop",
  },
  {
    id: "photo-ocean-aerial",
    label: "Ocean Aerial",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80&fit=crop",
  },
];
