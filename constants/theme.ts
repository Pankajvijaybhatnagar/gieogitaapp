/**
 * Design tokens for the app. Mirrors the palette/scale defined in tailwind.config.js
 * so that non-NativeWind contexts (LinearGradient colors, icon colors, StatusBar,
 * navigation theming) stay in sync with the className-based styling.
 *
 * Theme: warm spiritual palette — white/cream surfaces with saffron, temple
 * maroon and antique gold accents. No dark panels, no neon.
 */
import { Platform } from 'react-native';
import { DESIGN } from './design';

export const palette = {
  saffron: {
    50: '#FFF4E9',
    100: '#FFE3C7',
    200: '#FFC98F',
    300: '#CD8B6E',
    400: '#EE8A38',
    500: '#A65338',
    600: '#C85D12',
    700: '#A2480D',
    800: '#7C3609',
    900: '#5A2606',
  },
  maroon: {
    50: '#FBEEEF',
    100: '#F3D2D6',
    200: '#DFA3AA',
    300: '#C6737F',
    400: '#A6394A',
    500: '#55334A',
    600: '#6E1D2A',
    700: '#54151F',
    800: '#3D0F16',
  },
  gold: {
    50: '#FDF8EC',
    100: '#F7E9C2',
    200: '#EDD48F',
    300: '#DFC99F',
    400: '#D4AF37',
    500: '#B39562',
    600: '#80653B',
    700: '#7D6416',
  },
  sand: {
    50: '#FFFFFF',
    100: '#FCFAF7',
    150: '#F0EAE2',
    200: '#FDF1E1',
    300: '#E7DFD7',
    400: '#E9D6B8',
  },
  ink: {
    50: '#EFE7DA',
    100: '#DDD0BC',
    300: '#C9BBA8',
    500: '#8A7863',
    700: '#74696A',
    900: '#292328',
  },
  success: '#3E8E5A',
  warning: '#C9821F',
  danger: '#C0392B',
};

export const gradients = {
  sunrise: [palette.saffron[400], palette.gold[400]],
  temple: [palette.maroon[600], palette.maroon[500]],
  gold: [palette.saffron[500], palette.gold[400]],
  warmGlow: [palette.saffron[300], palette.saffron[500]],
  // Soft page wash behind frosted-glass cards — subtle, not a wallpaper.
  pageWash: ['#FFFFFF', '#FFF7EC', '#FFEFDD'],
};

// Glassmorphism tokens — translucent surfaces need a blur + a soft tint +
// a bright hairline edge to read as "glass" rather than flat white.
export const glass = {
  tint: 'light', // BlurView tint
  intensity: 20, // BlurView intensity
  overlay: 'rgba(255,253,249,0.94)', // translucent fill drawn over the blur
  overlayStrong: 'rgba(255,253,249,0.98)',
  border: 'rgba(255,255,255,0.6)', // top highlight edge
  borderGold: 'rgba(179,149,98,0.25)', // warm hairline variant
  shadow: palette.maroon[700],
};

export const Colors = {
  light: {
    text: palette.ink[900],
    textMuted: palette.ink[500],
    background: DESIGN.colors.canvas,
    surface: '#FFFFFF',
    surfaceMuted: palette.sand[150],
    border: palette.sand[300],
    tint: palette.saffron[500],
    icon: palette.ink[500],
    tabIconDefault: palette.ink[300],
    tabIconSelected: palette.saffron[600],
  },
  dark: {
    text: palette.ink[50],
    textMuted: palette.ink[300],
    background: palette.ink[900],
    surface: palette.ink[700],
    surfaceMuted: palette.ink[700],
    border: palette.ink[700],
    tint: palette.saffron[400],
    icon: palette.ink[300],
    tabIconDefault: palette.ink[500],
    tabIconSelected: palette.saffron[400],
  },
};

// ── Apple-style layout system ────────────────────────────────────────────
// Generous, consistent spacing/radius/type scale + soft (not colorful)
// shadows. Used to give every screen the same "properly spaced" rhythm
// instead of ad-hoc paddings per component.
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  sm: 10,
  md: 14,
  lg: 22,
  xl: 28,
  pill: 999,
};

// Soft, mostly-neutral shadows — depth comes from spacing/contrast, not
// colorful glows. Spread these onto a card's outer View.
export const shadow = {
  card: {
    shadowColor: '#292328',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  raised: {
    shadowColor: '#292328',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.065,
    shadowRadius: 24,
    elevation: 3,
  },
};

export const hairline = 'rgba(41,35,40,0.08)';

// Type scale loosely modeled on iOS text styles (Large Title / Title /
// Headline / Body / Subhead / Footnote) — bold, confident sizes with room
// to breathe, not cramped or italic.
export const type = {
  largeTitle: { fontFamily: DESIGN.fonts.editorial, fontSize: 34, lineHeight: 43, fontWeight: '400', letterSpacing: -0.5 },
  title: { fontFamily: DESIGN.fonts.editorial, fontSize: 26, lineHeight: 34, fontWeight: '400', letterSpacing: -0.3 },
  headline: { fontSize: 17, lineHeight: 24, fontWeight: '600' },
  body: { fontSize: 15, fontWeight: '400', lineHeight: 24 },
  subhead: { fontSize: 13, fontWeight: '500' },
  footnote: { fontSize: 12, fontWeight: '400' },
  caption: { fontSize: 11, fontWeight: '600', letterSpacing: 0.4 },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
