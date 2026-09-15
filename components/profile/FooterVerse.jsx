import { StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { C } from './constants';

export default function FooterVerse() {
  return (
    <Animated.View entering={FadeInDown.delay(400)} style={styles.footerVerse}>
      <Text style={styles.footerVerseText}>
        {
          '"मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु।\nमामेवैष्यसि सत्यं ते प्रतिजाने प्रियोऽसि मे॥"'
        }
      </Text>
      <Text style={styles.footerVerseRef}>— Bhagwad Gita 18.65</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  footerVerse: {
    backgroundColor: C.cream,
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: C.goldBorder,
    borderLeftWidth: 3,
    borderLeftColor: C.gold,
  },
  footerVerseText: {
    fontSize: 12,
    color: C.deepBrown,
    lineHeight: 20,
    marginBottom: 8,
  },
  footerVerseRef: {
    fontSize: 12,
    color: C.goldDark,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'right',
  },
});
