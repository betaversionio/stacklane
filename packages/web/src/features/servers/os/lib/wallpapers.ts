export interface WallpaperOption {
  id: string;
  label: string;
  type: 'gradient' | 'image';
  value: string;
}

export const DEFAULT_WALLPAPER_ID = 'image-betaversion';

// Helper to build an SVG data-URI pattern wallpaper
function svgPattern(svg: string, bg: string): string {
  const encoded = encodeURIComponent(svg.replace(/\s+/g, ' ').trim());
  return `url("data:image/svg+xml,${encoded}"), linear-gradient(${bg}, ${bg})`;
}

// --- SVG pattern definitions ---
const PATTERN_GRID = svgPattern(
  `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
    <path d="M0 0h40v40H0z" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>
  </svg>`,
  '#09090b',
);

const PATTERN_DOTS = svgPattern(
  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
    <circle cx="10" cy="10" r="1.5" fill="rgba(255,255,255,0.12)"/>
  </svg>`,
  '#0c0c0f',
);

const PATTERN_DIAGONAL = svgPattern(
  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
    <path d="M-4,4 l8,-8 M0,16 l16,-16 M12,20 l8,-8" stroke="rgba(255,255,255,0.06)" stroke-width="1.5"/>
  </svg>`,
  '#0f1117',
);

const PATTERN_HONEYCOMB = svgPattern(
  `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="100">
    <path d="M28 66L0 50V16l28-16 28 16v34L28 66zm0 0l28 16v34l-28 16L0 116V82l28-16z"
      fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  </svg>`,
  '#0a0a12',
);

const PATTERN_CIRCUIT = svgPattern(
  `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60">
    <path d="M0 30h15m0 0a3 3 0 1 0 0-1m0 1h12a3 3 0 0 1 3 3v12m0 0a3 3 0 1 0 1 0m-1 0v-12a3 3 0 0 1 3-3h12"
      fill="none" stroke="rgba(56,189,248,0.12)" stroke-width="1"/>
    <path d="M30 0v15m0 0a3 3 0 1 0 1 0m-1 0v12a3 3 0 0 1-3 3H15"
      fill="none" stroke="rgba(56,189,248,0.12)" stroke-width="1"/>
  </svg>`,
  '#060a10',
);

const PATTERN_CROSSES = svgPattern(
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
    <path d="M10 6h4v4h4v4h-4v4h-4v-4H6v-4h4z" fill="rgba(255,255,255,0.04)" />
  </svg>`,
  '#0e0e14',
);

const PATTERN_ISOMETRIC = svgPattern(
  `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="70">
    <path d="M0 35 L20 0 L40 35 L20 70Z" fill="none" stroke="rgba(168,85,247,0.1)" stroke-width="0.8"/>
  </svg>`,
  '#0b0816',
);

const PATTERN_WAVES = svgPattern(
  `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="16">
    <path d="M0 8 Q10 0 20 8 Q30 16 40 8 Q50 0 60 8 Q70 16 80 8" fill="none" stroke="rgba(34,211,238,0.1)" stroke-width="1"/>
  </svg>`,
  '#070b10',
);

export const WALLPAPERS: WallpaperOption[] = [
  // ── Gradients ──
  {
    id: 'gradient-sunset',
    label: 'Sunset',
    type: 'gradient',
    value:
      'bg-gradient-to-br from-orange-400 via-rose-400 to-purple-500 dark:from-orange-900 dark:via-rose-900 dark:to-purple-950',
  },
  {
    id: 'gradient-ocean',
    label: 'Ocean',
    type: 'gradient',
    value:
      'bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-500 dark:from-blue-900 dark:via-cyan-900 dark:to-teal-950',
  },
  {
    id: 'gradient-forest',
    label: 'Forest',
    type: 'gradient',
    value:
      'bg-gradient-to-br from-emerald-400 via-green-400 to-lime-500 dark:from-emerald-900 dark:via-green-900 dark:to-lime-950',
  },
  {
    id: 'gradient-lavender',
    label: 'Lavender',
    type: 'gradient',
    value:
      'bg-gradient-to-br from-purple-400 via-violet-400 to-indigo-500 dark:from-purple-900 dark:via-violet-900 dark:to-indigo-950',
  },
  {
    id: 'gradient-midnight',
    label: 'Midnight',
    type: 'gradient',
    value:
      'bg-gradient-to-br from-slate-700 via-gray-800 to-zinc-900 dark:from-slate-900 dark:via-gray-950 dark:to-zinc-950',
  },
  {
    id: 'gradient-aurora',
    label: 'Aurora',
    type: 'gradient',
    value:
      'bg-gradient-to-br from-green-400 via-cyan-400 to-purple-500 dark:from-green-900 dark:via-cyan-900 dark:to-purple-950',
  },
  {
    id: 'gradient-flamingo',
    label: 'Flamingo',
    type: 'gradient',
    value:
      'bg-gradient-to-br from-pink-400 via-fuchsia-400 to-rose-500 dark:from-pink-900 dark:via-fuchsia-900 dark:to-rose-950',
  },
  {
    id: 'gradient-ember',
    label: 'Ember',
    type: 'gradient',
    value:
      'bg-gradient-to-br from-red-500 via-orange-500 to-amber-400 dark:from-red-950 dark:via-orange-900 dark:to-amber-900',
  },
  {
    id: 'gradient-arctic',
    label: 'Arctic',
    type: 'gradient',
    value:
      'bg-gradient-to-br from-sky-200 via-blue-300 to-indigo-400 dark:from-sky-900 dark:via-blue-950 dark:to-indigo-950',
  },
  {
    id: 'gradient-moss',
    label: 'Moss',
    type: 'gradient',
    value:
      'bg-gradient-to-br from-lime-400 via-emerald-500 to-teal-600 dark:from-lime-950 dark:via-emerald-950 dark:to-teal-950',
  },

  // ── Patterns (SVG-based, self-contained) ──
  {
    id: 'image-betaversion',
    label: 'BetaVersion',
    type: 'image',
    value: 'https://media.betaversion.io/brand/betaversion-default.png',
  },
  {
    id: 'image-grid',
    label: 'Grid',
    type: 'image',
    value: PATTERN_GRID,
  },
  {
    id: 'image-dots',
    label: 'Dots',
    type: 'image',
    value: PATTERN_DOTS,
  },
  {
    id: 'image-diagonal',
    label: 'Diagonal',
    type: 'image',
    value: PATTERN_DIAGONAL,
  },
  {
    id: 'image-honeycomb',
    label: 'Honeycomb',
    type: 'image',
    value: PATTERN_HONEYCOMB,
  },
  {
    id: 'image-circuit',
    label: 'Circuit',
    type: 'image',
    value: PATTERN_CIRCUIT,
  },
  {
    id: 'image-crosses',
    label: 'Crosses',
    type: 'image',
    value: PATTERN_CROSSES,
  },
  {
    id: 'image-isometric',
    label: 'Isometric',
    type: 'image',
    value: PATTERN_ISOMETRIC,
  },
  {
    id: 'image-waves',
    label: 'Waves',
    type: 'image',
    value: PATTERN_WAVES,
  },

  // ── Photos (Unsplash) ──
  {
    id: 'photo-northern-lights',
    label: 'Northern Lights',
    type: 'image',
    value:
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80&fit=crop',
  },
  {
    id: 'photo-mountain-lake',
    label: 'Mountain Lake',
    type: 'image',
    value:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80&fit=crop',
  },
  {
    id: 'photo-desert-dunes',
    label: 'Desert Dunes',
    type: 'image',
    value:
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1920&q=80&fit=crop',
  },
  {
    id: 'photo-tropical-beach',
    label: 'Tropical Beach',
    type: 'image',
    value:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80&fit=crop',
  },
  {
    id: 'photo-starry-night',
    label: 'Starry Night',
    type: 'image',
    value:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80&fit=crop',
  },
  {
    id: 'photo-nebula',
    label: 'Nebula',
    type: 'image',
    value:
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80&fit=crop',
  },
  {
    id: 'photo-abstract-gradient',
    label: 'Abstract Flow',
    type: 'image',
    value:
      'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=80&fit=crop',
  },
  {
    id: 'photo-misty-forest',
    label: 'Misty Forest',
    type: 'image',
    value:
      'https://images.unsplash.com/photo-1511497584788-876760111969?w=1920&q=80&fit=crop',
  },
  {
    id: 'photo-cherry-blossoms',
    label: 'Cherry Blossoms',
    type: 'image',
    value:
      'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1920&q=80&fit=crop',
  },
  {
    id: 'photo-ocean-aerial',
    label: 'Ocean Aerial',
    type: 'image',
    value:
      'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80&fit=crop',
  },
  {
    id: 'photo-autumn-forest',
    label: 'Autumn Forest',
    type: 'image',
    value:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80&fit=crop',
  },
  {
    id: 'photo-milky-way',
    label: 'Milky Way',
    type: 'image',
    value:
      'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=1920&q=80&fit=crop',
  },
  {
    id: 'photo-snowy-mountains',
    label: 'Snowy Mountains',
    type: 'image',
    value:
      'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1920&q=80&fit=crop',
  },
  {
    id: 'photo-waterfall',
    label: 'Waterfall',
    type: 'image',
    value:
      'https://images.unsplash.com/photo-1432405972618-c6b0cfba8673?w=1920&q=80&fit=crop',
  },
  {
    id: 'photo-volcano',
    label: 'Volcano',
    type: 'image',
    value:
      'https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=1920&q=80&fit=crop',
  },
  {
    id: 'photo-city-night',
    label: 'City Night',
    type: 'image',
    value:
      'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1920&q=80&fit=crop',
  },
  {
    id: 'photo-coral-reef',
    label: 'Coral Reef',
    type: 'image',
    value:
      'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=1920&q=80&fit=crop',
  },
  {
    id: 'photo-lavender-field',
    label: 'Lavender Field',
    type: 'image',
    value:
      'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=1920&q=80&fit=crop',
  },
  {
    id: 'photo-earth-from-space',
    label: 'Earth',
    type: 'image',
    value:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80&fit=crop',
  },
  {
    id: 'photo-dark-clouds',
    label: 'Storm Clouds',
    type: 'image',
    value:
      'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920&q=80&fit=crop',
  },
];
