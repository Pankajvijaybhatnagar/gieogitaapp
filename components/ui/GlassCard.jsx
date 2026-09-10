import { BlurView } from 'expo-blur';
import { StyleSheet, View } from 'react-native';
import { glass } from '@/constants/theme';

// Reusable frosted-glass surface: BlurView + a soft white overlay (so it
// reads as warm glass, not gray fog) + a bright hairline edge + a soft
// shadow. The shadow lives on the outer (non-clipped) wrapper since
// `overflow: hidden` — needed to clip the blur to rounded corners — would
// otherwise clip the shadow too.
export default function GlassCard({
  children,
  style,
  contentStyle,
  radius = 22,
  intensity = glass.intensity,
  tint = glass.tint,
  overlayColor = glass.overlay,
  borderColor = glass.border,
  noShadow = false,
}) {
  return (
    <View
      style={[
        !noShadow && styles.shadowWrap,
        { borderRadius: radius },
        style,
      ]}>
      <View style={[styles.clip, { borderRadius: radius, borderColor }]}>
        <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: overlayColor }]} />
        <View style={[styles.content, contentStyle]}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    shadowColor: glass.shadow,
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 6
  },
  clip: {
    overflow: 'hidden',
    borderWidth: 1
  },
  content: {
    position: 'relative'
  }
});
