import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/brandColors';
import { spacing, type } from '@/constants/theme';

export default function PaymentLoading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={COLORS.saffron} />

      <Text style={styles.text}>Connecting to secure payment gateway...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    marginTop: spacing.sm,
    ...type.footnote,
    color: COLORS.warmBrown
  }
});
