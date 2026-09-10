import { View } from 'react-native';
import { COLORS } from '@/constants/brandColors';
import { radii, shadow } from '@/constants/theme';
import { DESIGN } from '@/constants/design';

// Flat, Apple-style card: white surface, soft neutral shadow, generous
// radius. No blur, no gradients — depth comes from spacing + a quiet
// shadow, not color.
export default function Card({ children, style, radius = radii.lg, raised = false }) {
  return (
    <View
      style={[
        {
          backgroundColor: COLORS.white,
          borderWidth: 1,
          borderColor: DESIGN.colors.border,
          borderRadius: radius,
          overflow: 'hidden',
        },
        raised ? shadow.raised : shadow.card,
        style,
      ]}>
      {children}
    </View>
  );
}
