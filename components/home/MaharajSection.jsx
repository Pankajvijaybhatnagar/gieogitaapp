import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RGB } from '@/constants/brandColors';
import { radii, shadow, spacing, type } from '@/constants/theme';
import { COLORS } from './constant';
import { SectionHeader } from './Sharedui';

export default function MaharajSection() {
  const router = useRouter();

  return (
    <>
      <SectionHeader/>

      <View style={styles.wrapper}>
        <View style={styles.panel}>
          {/* Decorative background rings, same language as the app's hero banners */}
          <View style={styles.ringOne} />
          <View style={styles.ringTwo} />
          <Text style={styles.omWatermark}>ॐ</Text>

          <View style={styles.photoFrame}>
            <Image
              source={require('@/assets/images/maharaj-ji.png')}
              style={styles.photo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.goldLine} />

          <Text style={styles.prefix}>GITA MANISHI</Text>

          <Text style={styles.name}>Swami Shri{'\n'}Gyananand Ji Maharaj</Text>

          <Text style={styles.mission}>
            Spreading the eternal wisdom of the Bhagavad Gita through pravachan,
            satsang &amp; selfless seva.
          </Text>

          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.cta}
            onPress={() => router.push('/home/promotional')}>
            <Text style={styles.ctaText}>Watch Pravachans</Text>
            <View style={styles.ctaIcon}>
              <Ionicons name="play" size={12} color={COLORS.richBrown} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.md,
  },
  panel: {
    backgroundColor: COLORS.richBrown,
    borderRadius: radii.xl,
    overflow: 'hidden',
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    ...shadow.raised,
    shadowColor: COLORS.richBrown,
  },
  ringOne: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    top: -90,
    left: -70,
  },
  ringTwo: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    bottom: -60,
    right: -55,
  },
  omWatermark: {
    position: 'absolute',
    top: 4,
    right: spacing.md,
    fontSize: 72,
    color: 'rgba(255,255,255,0.08)',
    fontWeight: '700',
  },
  photoFrame: {
    width: '78%',
    aspectRatio: 1434 / 1663,
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: `rgba(${RGB.gold}, 0.35)`,
    marginBottom: spacing.md,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  goldLine: {
    width: 40,
    height: 3,
    borderRadius: radii.pill,
    backgroundColor: COLORS.gold,
    marginBottom: spacing.sm,
  },
  prefix: {
    ...type.caption,
    color: COLORS.gold,
    fontSize: 11,
    letterSpacing: 2.5,
  },
  name: {
    ...type.title,
    fontSize: 21,
    color: COLORS.white,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 27,
  },
  mission: {
    ...type.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.78)',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: spacing.sm,
    maxWidth: 280,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: COLORS.white,
    borderRadius: radii.pill,
    paddingVertical: 10,
    paddingHorizontal: spacing.md + 2,
    marginTop: spacing.lg,
  },
  ctaText: {
    ...type.subhead,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.richBrown,
  },
  ctaIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: `rgba(${RGB.maroon}, 0.14)`,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
