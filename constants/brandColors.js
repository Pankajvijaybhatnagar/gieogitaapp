// Shared brand color tokens for screens still using inline StyleSheet objects
// (as opposed to NativeWind className usage). Same key names as the old
// palette so every consumer keeps working — values now express a warm,
// spiritual, white-based theme (saffron + temple maroon + antique gold).
// Single source of truth: update here and it cascades everywhere.
//
// NOTE: deepBrown/warmBrown/richBrown used to be dark PANEL backgrounds.
// They are now text/accent colors — panels should use `cream` (white) or
// `creamDark` (warm off-white) as their background instead.
import { DESIGN } from './design';

export const COLORS = {
  deepBrown: DESIGN.colors.ink,
  warmBrown: DESIGN.colors.muted,
  richBrown: DESIGN.colors.plum,
  gold: DESIGN.colors.gold,
  goldLight: '#DFC99F',
  goldDark: DESIGN.colors.goldDark,
  cream: DESIGN.colors.canvas,
  creamDark: DESIGN.colors.soft,
  saffron: DESIGN.colors.accent,
  saffronLight: '#CD8B6E',
  textDark: DESIGN.colors.ink,
  white: '#FFFFFF',
  liveRed: '#5A2606',
  dangerRed: '#5A2606',
  dangerLight: '#5A2606',
};

// RGB triplets for the same tokens, for spots that use rgba(r,g,b,alpha) literals.
export const RGB = {
  gold: '179,149,98',
  goldLight: '223,201,159',
  deepBrown: '41,35,40',
  cream: '248,245,240',
  saffron: '166,83,56',
  dangerRed: '192,57,43',
  goldDark: '128,101,59',
  maroon: '85,51,74',
};
