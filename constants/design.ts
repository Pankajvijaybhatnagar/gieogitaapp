import { Platform } from 'react-native';

/** Shared visual language. Content and service contracts live outside this layer. */
export const DESIGN = {
  colors: {
    canvas: '#F8F5F0', surface: '#FFFFFF', soft: '#F0EAE2',
    ink: '#292328', muted: '#74696A', plum: '#55334A', plumSoft: '#EFE7ED',
    accent: '#A65338', accentSoft: '#F6E9DF', gold: '#B39562', goldDark: '#80653B',
    border: '#E7DFD7', sage: '#536B58', sageSoft: '#EAF0E8',
  },
  fonts: {
    editorial: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, serif' }),
  },
  radius: { card: 24, field: 14, button: 16, chip: 100 },
  shadow: {
    shadowColor: '#30212B', shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.055, shadowRadius: 16, elevation: 2,
  },
} as const;
