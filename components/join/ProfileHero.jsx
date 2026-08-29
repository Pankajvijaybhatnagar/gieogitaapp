import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const COLORS = {
  primary: '#6E3F1F',
  secondary: '#A8692D',
  cream: '#FFF8EF',
  text: '#382418',
  muted: '#846F61',
};

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
          <Ionicons name="arrow-back" size={22} color="#FFF" />
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
                <Ionicons name="person" size={58} color="#9D7553" />
              </View>
            )}
          </View>
        </View>

        <View style={styles.memberBadge}>
          <Ionicons name="checkmark-circle" size={15} color="#FFF" />

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
              color={COLORS.secondary}
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
    marginBottom: 12,
  },

  banner: {
    height: 140,
    backgroundColor: COLORS.primary,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
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
    justifyContent: 'center',
  },

  patternOne: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    top: -85,
    left: -65,
  },

  patternTwo: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    right: -100,
    top: -115,
  },

  om: {
    color: 'rgba(255,255,255,0.09)',
    fontSize: 88,
    fontWeight: '700',
    marginTop: 6,
  },

  card: {
    marginHorizontal: 16,
    marginTop: -66,
    borderRadius: 28,
    backgroundColor: '#FFF',
    paddingHorizontal: 18,
    paddingTop: 76,
    paddingBottom: 24,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#52301E',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },

  avatarOuter: {
    position: 'absolute',
    top: -63,
    width: 130,
    height: 130,
    borderRadius: 65,
    padding: 5,
    backgroundColor: '#E5CDAF',
  },

  avatarInner: {
    flex: 1,
    borderRadius: 60,
    backgroundColor: '#FFF',
    padding: 3,
  },

  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },

  avatarFallback: {
    flex: 1,
    borderRadius: 60,
    backgroundColor: '#F4E8DB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.secondary,
    borderRadius: 30,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },

  memberBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },

  name: {
    marginTop: 13,
    color: COLORS.text,
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'center',
  },

  designation: {
    marginTop: 4,
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: '700',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9,
    gap: 4,
  },

  location: {
    color: COLORS.muted,
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 280,
  },

  wingBadge: {
    marginTop: 15,
    borderRadius: 13,
    backgroundColor: '#FAF1E7',
    paddingHorizontal: 18,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  wingLabel: {
    color: '#A47C5A',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
  },

  wingValue: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
  },
});
