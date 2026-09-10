// ─── COLOR PALETTE ────────────────────────────────────────────────────────────
// Sourced from the shared design tokens (constants/brandColors.js) so this
// module cannot drift from the rest of the app's palette.
import { COLORS, RGB } from '@/constants/brandColors';

export const C = {
  deepBrown:    COLORS.deepBrown,
  warmBrown:    COLORS.warmBrown,
  richBrown:    COLORS.richBrown,
  gold:         COLORS.gold,
  goldLight:    COLORS.goldLight,
  goldDark:     COLORS.goldDark,
  goldPale:     `rgba(${RGB.gold},0.10)`,
  goldBorder:   `rgba(${RGB.gold},0.30)`,
  cream:        COLORS.cream,
  creamDark:    COLORS.creamDark,
  saffron:      COLORS.saffron,
  saffronLight: COLORS.saffronLight,
  white:        COLORS.white,
  green:        '#27AE60',
};