import { DESIGN } from '@/constants/design';
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
  howSection: {
    paddingHorizontal: 16,
    paddingTop: 20
  },
  stepsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  stepCard: {
    width: (width - 52) / 2,
    backgroundColor: DESIGN.colors.surface,
    borderRadius: 24,
    padding: 14,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    alignItems: 'center',
    shadowColor: C.deepBrown,
    shadowOpacity: 0.045,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 10,
    elevation: 2
  },
  stepNumBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  stepNum: {
    fontSize: 12,
    fontWeight: "600",
    color: C.deepBrown
  },
  stepIcon: {
    fontSize: 24,
    marginBottom: 6
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: C.deepBrown,
    textAlign: 'center',
    marginBottom: 4
  },
  stepDesc: {
    fontSize: 12,
    color: C.warmBrown,
    textAlign: 'center',
    lineHeight: 18
  }
});