import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { aboutInitiatives, COLORS } from './constant';
import { SectionHeader } from './Sharedui';

export default function InitiativesSection() {
  const router = useRouter();

  return (
    <>
      <SectionHeader title="🌿 Our" accent="Initiatives" />
      <View style={styles.aboutSection}>
        <Text style={styles.aboutHeading}>
          Serving With{' '}
          <Text style={styles.aboutHeadingAccent}>Spiritual Purpose</Text>
          {'\n'}And Social Responsibility
        </Text>
        <Text style={styles.aboutDesc}>
          GIEO Gita is a spiritual mission dedicated to spreading the timeless wisdom of
          the Bhagwad Gita. Our aim is to cultivate values, inspire transformation, and
          serve society with love, devotion, and selfless service.
        </Text>
        {aboutInitiatives.map((init) => (
          <TouchableOpacity
            key={init.title}
            style={styles.initiativeCard}
            activeOpacity={0.85}
            onPress={() => router.push(init.route)}  
          >
            <View style={styles.initiativeIcon}>
              <Text style={styles.initiativeIconText}>{init.icon}</Text>
            </View>
            <View style={styles.initiativeText}>
              <Text style={styles.initiativeTitle}>{init.title}</Text>
              <Text style={styles.initiativeDesc}>{init.desc}</Text>
            </View>
            <FontAwesome name="chevron-right" size={12} color={COLORS.goldDark} />
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  aboutSection: {
    backgroundColor: COLORS.richBrown,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.3)',
  },
  aboutHeading: {
    color: COLORS.cream,
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 24,
    marginBottom: 10,
  },
  aboutHeadingAccent: { color: COLORS.goldLight },
  aboutDesc: {
    color: 'rgba(253,246,227,0.65)',
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: 14,
  },
  initiativeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(201,162,39,0.08)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.2)',
  },
  initiativeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(201,162,39,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initiativeIconText: { fontSize: 20 },
  initiativeText: { flex: 1 },
  initiativeTitle: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '700',
  },
  initiativeDesc: {
    color: 'rgba(253,246,227,0.55)',
    fontSize: 10,
    marginTop: 2,
    fontStyle: 'italic',
  },
});