import { FontAwesome } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { StyleSheet, Text, View } from 'react-native';
import { C } from './constants';
import PulsingRing from './PulsingRing';

const STATS = [
  { icon: '📿', value: '8,556', label: 'Chants'    },
  { icon: '📖', value: '142',   label: 'Paath'     },
  { icon: '🔥', value: '21',    label: 'Day Streak' },
];

function StatCard({ icon, value, label }) {
  return (
    <Animated.View entering={FadeInDown.delay(300)} style={styles.statCard}>
      <Text style={styles.statCardIcon}>{icon}</Text>
      <Text style={styles.statCardValue}>{value}</Text>
      <Text style={styles.statCardLabel}>{label}</Text>
    </Animated.View>
  );
}

export default function AvatarSection({ user }) {
  const getInitials = () => {
    if (!user?.name) return '🙏';
    const parts = user.name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <>
      {/* Avatar */}
      <View style={styles.avatarWrap}>
        <PulsingRing size={110} delay={0}   color={C.gold}      />
        <PulsingRing size={110} delay={800} color={C.goldLight} />
        <View style={styles.avatarOuterRing}>
          <View style={styles.avatarInnerRing}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{getInitials()}</Text>
            </View>
          </View>
        </View>
        <View style={styles.onlineDot} />
      </View>

      {/* Name */}
      <Animated.Text entering={FadeInDown.delay(100)} style={styles.heroName}>
        {user?.name || 'Gita Devotee'}
      </Animated.Text>

      {/* Email */}
      {user?.email && (
        <Animated.View entering={FadeInDown.delay(150)} style={styles.emailRow}>
          <FontAwesome name="envelope-o" size={12} color={C.goldDark} />
          <Text style={styles.heroEmail}>{user.email}</Text>
        </Animated.View>
      )}

      {/* Devotee badge */}
      <Animated.View entering={FadeInDown.delay(200)} style={styles.devoteeBadge}>
        <Text style={styles.devoteeBadgeText}>🕉️  Gita Devotee  •  GIEO GITA</Text>
      </Animated.View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        {STATS.map((stat, i) => (
          <View key={stat.label} style={{ flexDirection: 'row', alignItems: 'center', flex: i < STATS.length - 1 ? undefined : 1 }}>
            <StatCard {...stat} />
            {i < STATS.length - 1 && <View style={styles.statsVertDivider} />}
          </View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  avatarWrap: {
    width: 110, height: 110,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16, position: 'relative',
  },
  avatarOuterRing: {
    width: 96, height: 96, borderRadius: 48,
    borderWidth: 2, borderColor: C.gold, padding: 3,
    backgroundColor: 'rgba(201,162,39,0.08)',
  },
  avatarInnerRing: {
    flex: 1, borderRadius: 43,
    borderWidth: 1, borderColor: 'rgba(201,162,39,0.25)', padding: 2,
  },
  avatarCircle: {
    flex: 1, borderRadius: 40,
    backgroundColor: C.warmBrown,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText:  { fontSize: 30, fontWeight: '800', color: C.goldLight, letterSpacing: 2 },
  onlineDot: {
    position: 'absolute', bottom: 6, right: 6,
    width: 15, height: 15, borderRadius: 8,
    backgroundColor: C.green, borderWidth: 2.5, borderColor: C.deepBrown,
  },

  heroName:   { fontSize: 24, fontWeight: '800', color: C.cream, letterSpacing: 0.5, marginBottom: 5 },
  emailRow:   { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  heroEmail:  { fontSize: 12, color: C.goldDark, fontStyle: 'italic' },

  devoteeBadge: {
    backgroundColor: 'rgba(201,162,39,0.12)', borderWidth: 1, borderColor: C.goldBorder,
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, marginBottom: 20,
  },
  devoteeBadgeText: { fontSize: 11, fontWeight: '700', color: C.goldLight, letterSpacing: 0.5 },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(201,162,39,0.08)',
    borderRadius: 18, borderWidth: 1, borderColor: 'rgba(201,162,39,0.2)',
    paddingVertical: 14, paddingHorizontal: 10,
    width: '88%', alignItems: 'center',
  },
  statCard:          { flex: 1, alignItems: 'center', gap: 3 },
  statCardIcon:      { fontSize: 18, marginBottom: 2 },
  statCardValue:     { fontSize: 16, fontWeight: '800', color: C.goldLight, letterSpacing: 0.5 },
  statCardLabel:     { fontSize: 9, color: C.goldDark, letterSpacing: 0.5, fontWeight: '600' },
  statsVertDivider:  { width: 1, height: 38, backgroundColor: 'rgba(201,162,39,0.22)' },
});