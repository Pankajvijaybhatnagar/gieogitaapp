import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { C, HOW_STEPS } from './constants';
import { SectionPillHeader } from './SharedUI';

const { width } = Dimensions.get('window');

export default function HowItWorks() {
  return (
    <View style={styles.howSection}>
      <SectionPillHeader label="HOW IT WORKS" />
      <View style={styles.stepsRow}>
        {HOW_STEPS.map((step) => (
          <View key={step.num} style={styles.stepCard}>
            <View style={styles.stepNumBadge}>
              <Text style={styles.stepNum}>{step.num}</Text>
            </View>
            <Text style={styles.stepIcon}>{step.icon}</Text>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDesc}>{step.desc}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  howSection: { paddingHorizontal: 16, paddingTop: 20 },
  stepsRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stepCard: {
    width: (width - 52) / 2,
    backgroundColor: C.deepBrown, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: C.goldBorder, alignItems: 'center',
  },
  stepNumBadge: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  stepNum:   { fontSize: 11, fontWeight: '800', color: C.deepBrown },
  stepIcon:  { fontSize: 24, marginBottom: 6 },
  stepTitle: { fontSize: 12, fontWeight: '800', color: C.goldLight, textAlign: 'center', marginBottom: 4 },
  stepDesc:  { fontSize: 10, color: 'rgba(253,246,227,0.6)', textAlign: 'center', lineHeight: 14, fontStyle: 'italic' },
});