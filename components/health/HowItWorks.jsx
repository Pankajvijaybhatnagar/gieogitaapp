import { StyleSheet, Text, View } from 'react-native';
import { C, HOW_STEPS } from './constants';
import { SectionHead } from './SharedUI';

export default function HowItWorks() {
  return (
    <View style={styles.howSection}>
      <SectionHead label="PROCESS" title="How To" accent="Book?" />
      <View style={styles.howStepsCol}>
        {HOW_STEPS.map((step, i) => (
          <View key={i} style={styles.howStep}>
            <View style={styles.howStepLeft}>
              <View style={styles.howNumBadge}>
                <Text style={styles.howNum}>{step.num}</Text>
              </View>
              {i < HOW_STEPS.length - 1 && <View style={styles.howConnector} />}
            </View>
            <View style={styles.howStepContent}>
              <View style={styles.howStepCard}>
                <Text style={styles.howStepIcon}>{step.icon}</Text>
                <View style={styles.howStepTextCol}>
                  <Text style={styles.howStepTitle}>{step.title}</Text>
                  <Text style={styles.howStepDesc}>{step.desc}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  howSection:  { paddingHorizontal: 20 },
  howStepsCol: { gap: 0 },
  howStep:     { flexDirection: 'row', gap: 14 },
  howStepLeft: { alignItems: 'center', width: 36 },
  howNumBadge: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: C.deepBrown, borderWidth: 1.5, borderColor: C.gold,
    alignItems: 'center', justifyContent: 'center',
  },
  howNum:        { fontSize: 11, fontWeight: '800', color: C.goldLight },
  howConnector:  { width: 2, flex: 1, backgroundColor: C.goldBorder, marginVertical: 4, minHeight: 16 },
  howStepContent:{ flex: 1, paddingBottom: 14 },
  howStepCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: C.white, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: C.goldBorder,
  },
  howStepIcon:    { fontSize: 22 },
  howStepTextCol: { flex: 1 },
  howStepTitle:   { fontSize: 13, fontWeight: '800', color: C.deepBrown, marginBottom: 3 },
  howStepDesc:    { fontSize: 11, color: '#666', lineHeight: 16 },
});