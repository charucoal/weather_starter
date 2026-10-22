# Weather Starter Themes

Themes are selected from the dropdown in the top-right corner. The selection is stored in `localStorage` (`weather-starter:theme`) and applied as `data-theme` on `<html>`. Registered themes live in `frontend/src/state/theme.tsx`. Token values live in `frontend/src/index.css`.

## Status

| # | Theme | Status | Registry ID |
|---|-------|--------|-------------|
| 1 | Glass Horizon | Implemented as **Apple** (default) | `apple` |
| 2 | Nordic Minimal | Implemented | `nordic` |
| 3 | Neo-Brutalist Weather | Proposed | |
| 4 | OLED Night | Proposed | |
| 5 | Terminal Weather | Proposed | |
| 6 | Editorial Almanac | Proposed | |
| 7 | Synthwave Forecast | Proposed | |
| 8 | Soft Neumorphism | Proposed | |
| 9 | Material Weather | Proposed | |
| 10 | Instrument Panel | Proposed | |
| 11 | Pastel Sky | Proposed | |
| 12 | Monochrome Mono | Proposed | |
| 13 | Topographic Map | Proposed | |
| 14 | Cyberpunk HUD | Proposed | |
| 15 | Botanical Weather | Proposed | |
| 16 | Dynamic Condition Theme | Proposed | |

Note: #1 Glass Horizon describes the existing baseline design, so it is registered as "Apple" rather than duplicated.

## Themes

### 1. Glass Horizon (Apple, implemented)
Frosted glass cards over a soft blue-gray atmospheric gradient.
- **Color:** blue-gray gradient (`#6f8aa8` to `#3c5066`), white text at varying opacity.
- **Typography:** system sans, uppercase tracked section labels, light numerals.
- **Cards:** translucent white fill (`white/8`), `backdrop-blur-xl`, thin white border, 16px radius.
- **Density:** medium, generous padding.

### 2. Nordic Minimal (implemented)
Flat Scandinavian calm. No blur or gradients, just clean geometry.
- **Color:** warm off-white background (`#f5f5f2`), white surfaces, one muted sage accent (`#5b7a63`), four text tiers from `#23261f` down to `#a8ab9f`.
- **Typography:** system sans, normal-case labels, weight and size carry hierarchy. No webfont is loaded.
- **Cards:** solid white, 1px hairline border (`#e4e4e0`), 10px radius, faint shadow.
- **Density:** low to medium, with whitespace between sections.

### 3. Neo-Brutalist Weather
Loud, raw, unapologetic blocks with hard edges.
- **Color:** high-contrast black and white base with one acid accent (yellow or lime).
- **Typography:** bold condensed sans or monospace, oversized numerals.
- **Cards:** thick black borders, hard offset shadows with no blur, no radius.
- **Density:** medium to high, deliberately asymmetric grid.

### 4. OLED Night
True-black dark mode for low-light use and battery savings.
- **Color:** pure black background, cards in `#111` to `#161`, a desaturated accent per condition (icy blue for cold, amber for hot).
- **Typography:** system sans, thin weights, high legibility.
- **Cards:** flat dark gray, subtle lighter border, rounded corners.
- **Density:** medium, condensed numerics.

### 5. Terminal Weather
Developer and CLI-inspired.
- **Color:** black background, phosphor green or amber monochrome text.
- **Typography:** monospace throughout (JetBrains Mono or IBM Plex Mono), ASCII-style dividers.
- **Cards:** bordered boxes that mimic terminal panes, `[ ]` bracket framing.
- **Density:** high, compact line-based layout.

### 6. Editorial Almanac
Newspaper and vintage almanac page.
- **Color:** cream paper background, black ink text, one muted red or navy accent.
- **Typography:** serif headlines (Playfair or Georgia), small-caps labels, rule lines.
- **Cards:** no shadow. Sections are separated by thin rules instead of boxes, in a column layout.
- **Density:** high information density, text-forward.

### 7. Synthwave Forecast
Retro-futuristic neon with an 80s sunset feel.
- **Color:** deep purple and magenta gradient sky, neon cyan and pink accents, grid horizon motif.
- **Typography:** bold geometric sans or a retro display face for headers.
- **Cards:** dark translucent panels with neon glow borders.
- **Density:** medium, bold hero numerals.

### 8. Soft Neumorphism
Tactile, pillowy soft UI with embossed light and shadow.
- **Color:** a single pale base hue (light gray-blue) used across all surfaces.
- **Typography:** rounded sans (Quicksand or Nunito).
- **Cards:** no borders, paired soft shadows (light top-left, dark bottom-right) for raised or inset effects.
- **Density:** low to medium, large touch-friendly tiles.

### 9. Material Weather
Material Design 3 style, elevation-based.
- **Color:** dynamic tonal palette that shifts with weather condition, surface tints.
- **Typography:** Roboto or Google Sans with a clear type scale.
- **Cards:** filled tonal surfaces, elevation shadows on interaction, pill-shaped chips.
- **Density:** medium, consistent 8dp spacing grid.

### 10. Instrument Panel
Aviation and marine cockpit, with analog gauges and dials.
- **Color:** dark gunmetal background, amber or green gauge accents.
- **Typography:** monospace or stencil faces for numerals, small-caps labels.
- **Cards:** circular gauge and dial widgets in place of flat bars, riveted panel borders.
- **Density:** high, dashboard-like with many small instruments.

### 11. Pastel Sky
Soft and approachable for a general consumer audience.
- **Color:** pastel gradient that shifts with time of day (peach dawn, lavender dusk, mint day).
- **Typography:** rounded, friendly sans (Baloo or Comfortaa for headers).
- **Cards:** white cards with colored soft shadows, large corner radius.
- **Density:** low, icon-forward with larger illustrations.

### 12. Monochrome Mono
Severe black, white, and gray. Typography-first, no color.
- **Color:** grayscale only, with one accent reserved for alerts.
- **Typography:** hierarchy from weight and size rather than color.
- **Cards:** flat, separated by whitespace or thin dividers only.
- **Density:** medium, type-driven hierarchy.

### 13. Topographic Map
Cartography-inspired, with contour lines and survey-map motifs.
- **Color:** parchment, sage green, and brown tones like a physical relief map.
- **Typography:** serif or slab-serif labels that mimic map legends.
- **Cards:** contour-line background texture, compass-rose accents.
- **Density:** medium. Integrates well with the existing map tile.

### 14. Cyberpunk HUD
Futuristic heads-up display with sci-fi interface panels.
- **Color:** near-black background, electric cyan and magenta accents, scanline texture.
- **Typography:** angular tech face (Orbitron-style) for numerals.
- **Cards:** angled corners (`clip-path`), glowing edge borders, data-stream decoration.
- **Density:** high, dense readouts with animated accent lines.

### 15. Botanical Weather
Organic, nature-forward, earthy and calm.
- **Color:** warm terracotta, forest green, and cream palette.
- **Typography:** warm humanist serif or sans (Lora).
- **Cards:** textured paper-like background, leaf and branch iconography, soft rounded edges.
- **Density:** low, with breathing room between sections.

### 16. Dynamic Condition Theme
The palette changes with the live weather condition: sunny is warm gold, rain is cool blue-gray, snow is icy white, storms are deep violet.
- **Color:** condition-driven palette swap at runtime.
- **Typography:** one consistent sans across all states. Color is the variable.
- **Cards:** one consistent glass or flat shell, with only accent and gradient changing.
- **Density:** medium, same layout in every state.

## Design considerations

### Shared constraints
- **Token layer first.** Components use `var(--token)` classes, so a new theme is mostly a `:root[data-theme='<id>']` block in `index.css` plus a `THEMES` entry. Themes that change structure need component work as well.
- **Data-viz colors stay fixed.** The air quality and UV gradient bars, the 10-day temperature range, and the sun/cloud icons carry meaning, so they should stay readable on every background. Re-check them whenever a theme's background changes.
- **Map pins are not themed.** Pins in `LocationsMap.tsx` sit on map tiles, not the page background, so they keep their current colors.
- **Contrast.** Every theme needs readable text at all four tiers (`--text-primary` through `--text-faint`), including error text and disabled states.
- **Responsive.** Layouts must hold at phone width. Only the layout density should change between themes, not the breakpoints.
- **No external fonts by default.** Nordic avoids a webfont dependency. Themes that need a specific typeface (Terminal, Synthwave, Editorial, Botanical) should decide whether to add one and check it against the CSP and load cost.

### Per-theme notes beyond tokens
- **Neo-Brutalist:** needs radius and shadow tokens set to hard offsets (`--radius-card: 0`, hard `--card-shadow`).
- **Terminal:** needs a global monospace font stack and bracket framing, which means touching the label and card markup.
- **Editorial:** needs rule-line separators instead of card borders, which means changing `TileShell` and the section containers.
- **Neumorphism:** needs dual shadows, which the single `--card-shadow` token does not cover. It needs a second shadow token or a combined value.
- **Instrument Panel:** needs gauge components in place of the `ScaleBar` and `Compass` tiles, so it is a larger component change.
- **Cyberpunk HUD:** `clip-path` corners need per-card shape handling, and scanlines need a body-level overlay.
- **Dynamic Condition:** needs a runtime mapping from `WeatherSnapshot.condition` to a palette, set as token overrides on `<html>`. The mapping should be a small pure function so it can be tested.
- **Topographic and Botanical:** need background texture assets. Inline them as `data:` URIs or CSS, since external hosts are blocked by the viewer CSP.

### Open questions
- Whether theme-specific fonts are acceptable, given the no-external-font decision in Nordic.
- Whether Dynamic Condition should replace the static themes or be its own registry entry.
- Whether a theme should be able to change layout (tile order, column count) or only visuals.
