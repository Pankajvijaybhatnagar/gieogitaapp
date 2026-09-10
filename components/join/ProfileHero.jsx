import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/brandColors';
import { hairline, radii, shadow, spacing, type } from '@/constants/theme';

export default function ProfileHero({ profile }) {
  const router = useRouter();

  const location = [profile?.tehsil, profile?.state, profile?.country]
    .filter(Boolean)
    .join(', ');

  return (
    <View style={styles.wrapper}>
      <View style={styles.banner}>
        <View style={styles.patternOne} />
        <View style={styles.patternTwo} />

        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
        </Pressable>

        <Text style={styles.om}>ॐ</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.avatarOuter}>
          <View style={styles.avatarInner}>
            {profile?.pic ? (
              <Image
                source={{ uri: profile.pic }}
                style={styles.avatar}
                contentFit="cover"
                transition={300}
              />
            ) : (
              <View style={styles.avatarFallback}>
                <Ionicons name="person" size={58} color={COLORS.warmBrown} />
              </View>
            )}
          </View>
        </View>

        <View style={styles.memberBadge}>
          <Ionicons name="checkmark-circle" size={15} color={COLORS.white} />

          <Text style={styles.memberBadgeText}>GIEO GITA MEMBER</Text>
        </View>

        <Text style={styles.name}>{profile?.name || 'GIEO Gita Member'}</Text>

        {!!profile?.designation && (
          <Text style={styles.designation}>{profile.designation}</Text>
        )}

        {!!location && (
          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={16}
              color={COLORS.goldDark}
            />

            <Text style={styles.location}>{location}</Text>
          </View>
        )}

        {!!profile?.interest && (
          <View style={styles.wingBadge}>
            <Text style={styles.wingLabel}>WING</Text>

            <Text style={styles.wingValue}>{profile.interest}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.sm + 4
  },
  banner: {
    height: 140,
    backgroundColor: COLORS.richBrown,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center'
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.22)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  patternOne: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    top: -85,
    left: -65
  },
  patternTwo: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    right: -100,
    top: -115
  },
  om: {
    color: 'rgba(255,255,255,0.09)',
    fontSize: 88,
    fontWeight: '700',
    marginTop: 6
  },
  card: {
    marginHorizontal: spacing.md,
    marginTop: -66,
    borderRadius: 24,
    backgroundColor: COLORS.cream,
    paddingHorizontal: spacing.lg - 6,
    paddingTop: 76,
    paddingBottom: spacing.lg,
    alignItems: 'center',
    ...shadow.raised,
    borderColor: hairline,
    borderWidth: 1,
    shadowOpacity: 0.045,
    elevation: 2
  },
  avatarOuter: {
    position: 'absolute',
    top: -63,
    width: 130,
    height: 130,
    borderRadius: radii.pill,
    padding: 5,
    backgroundColor: COLORS.creamDark
  },
  avatarInner: {
    flex: 1,
    borderRadius: radii.pill,
    backgroundColor: COLORS.cream,
    padding: 3
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: radii.pill
  },
  avatarFallback: {
    flex: 1,
    borderRadius: radii.pill,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center'
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.goldDark,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm + 3,
    paddingVertical: spacing.xs + 1
  },
  memberBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1
  },
  name: {
    marginTop: spacing.sm + 5,
    ...type.title,
    fontSize: 25,
    color: COLORS.deepBrown,
    textAlign: 'center'
  },
  designation: {
    marginTop: spacing.xs,
    color: COLORS.goldDark,
    fontSize: 14,
    fontWeight: '700'
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm + 1,
    gap: 4
  },
  location: {
    color: COLORS.warmBrown,
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 280
  },
  wingBadge: {
    marginTop: spacing.md - 1,
    borderRadius: radii.md - 1,
    backgroundColor: COLORS.creamDark,
    paddingHorizontal: spacing.lg - 6,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7
  },
  wingLabel: {
    color: COLORS.warmBrown,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.4
  },
  wingValue: {
    color: COLORS.deepBrown,
    fontSize: 12,
    fontWeight: "600"
  }
});
