import { useAuth } from '@/context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// ─── COLOR PALETTE ────────────────────────────────────────────────────────────
const COLORS = {
  deepBrown: '#2C1A0A',
  warmBrown: '#4A2C0D',
  richBrown: '#3D2010',
  gold: '#C9A227',
  goldLight: '#E8C55A',
  goldDark: '#8B6914',
  cream: '#FDF6E3',
  creamDark: '#F5E6C8',
  saffron: '#E8721C',
  saffronLight: '#F4A44A',
  white: '#FFFFFF',
  dangerRed: '#C0392B',
  dangerLight: '#E74C3C',
};

// ─── DRAWER NAV ITEMS ─────────────────────────────────────────────────────────
const DRAWER_ITEMS = [
  { label: 'Home', icon: 'home', route: '/home/(tabs)' },
  { label: 'Chants', icon: 'music', route: '/home/(tabs)/chants' },
  { label: 'My Donations', icon: 'music', route: '/home/(tabs)/donations' },
  { label: 'Patrika', icon: 'book', route: '/home/(tabs)/patrika' },
  { label: 'Reading', icon: 'book', route: '/home/(tabs)/reading' },
  { label: 'Events', icon: 'calendar', route: '/home/eventgroup' },
  { label: 'Bhajans', icon: 'music', route: '/home/bhajans' },
  { label: 'Live Darshan', icon: 'video-camera', route: '/home/livedarshan' },
  { label: 'Bal Sanskar', icon: 'child', route: '/home/balSanskar' },
  { label: 'Gaushala', icon: 'leaf', route: '/home/GieoGaushala' },
  { label: 'Join Gieo Gita', icon: 'users', route: '/home/join-gieo-gita' },
  { label: 'Health', icon: 'medkit', route: '/home/health' },
  { label: 'Promotional', icon: 'bullhorn', route: '/home/promotional' },
  { label: 'Profile', icon: 'user-circle', route: '/home/(tabs)/profile' },
  { label: 'Help', icon: 'question-circle', route: '/home/help' },
];

export default function CustomDrawerContent({ navigation }) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            const res = await logout();
            if (res.status) router.replace('/login2');
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={drawerStyles.root}>
      {/* ── DRAWER HEADER ── */}
      <View style={drawerStyles.header}>
        <View style={drawerStyles.blob1} />
        <View style={drawerStyles.blob2} />

        <View style={drawerStyles.logoRow}>
          <View style={drawerStyles.logoCircle}>
            <Image
              width={50}
              height={50}
              source={require('@/assets/images/logos/logo.png')}
            />
          </View>

          <View>
            <Text style={drawerStyles.logoMain}>GIEO GITA </Text>
            <Text style={drawerStyles.logoSub}>॥ श्री कृष्ण कृपा ॥</Text>
            {/* <Link href="/login2">login 2</Link> */}
          </View>
        </View>
      </View>

      {/* ── NAV ITEMS ── */}
      <ScrollView
        style={drawerStyles.itemsScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}>
        {DRAWER_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={drawerStyles.drawerItem}
            onPress={() => {
              router.push(item.route);
              navigation.closeDrawer();
            }}
            activeOpacity={0.72}>
            <View style={drawerStyles.drawerItemIconBox}>
              <FontAwesome name={item.icon} size={15} color={COLORS.goldDark} />
            </View>

            <Text style={drawerStyles.drawerItemLabel}>{item.label}</Text>

            <FontAwesome
              name="chevron-right"
              size={10}
              color={COLORS.goldDark}
              style={{ opacity: 0.4 }}
            />
          </TouchableOpacity>
        ))}

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ── LOGOUT ── */}
      <View style={drawerStyles.logoutSection}>
        <TouchableOpacity
          style={drawerStyles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}>
          <View style={drawerStyles.logoutIconBox}>
            <FontAwesome name="sign-out" size={16} color={COLORS.dangerLight} />
          </View>

          <Text style={drawerStyles.logoutText}>Logout</Text>

          <FontAwesome
            name="chevron-right"
            size={10}
            color={COLORS.dangerLight}
            style={{ opacity: 0.5 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const drawerStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  header: {
    backgroundColor: COLORS.deepBrown,
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 0,
    position: 'relative',
    overflow: 'hidden',
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.gold,
  },

  blob1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(201,162,39,0.07)',
    top: -60,
    right: -50,
  },

  blob2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(74,44,13,0.2)',
    bottom: -30,
    left: -20,
  },

  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },

  logoCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.warmBrown,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoEmoji: {
    fontSize: 20,
  },

  logoMain: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.goldLight,
    letterSpacing: 1.5,
  },

  logoSub: {
    fontSize: 15,
    color: COLORS.goldDark,
    letterSpacing: 1,
    marginTop: 1,
  },

  taglineBox: {
    backgroundColor: 'rgba(201,162,39,0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.2)',
    padding: 12,
  },

  taglineBig: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.cream,
    marginBottom: 3,
    letterSpacing: 0.3,
  },

  taglineSmall: {
    fontSize: 10,
    color: COLORS.goldDark,
    fontStyle: 'italic',
  },

  itemsScroll: {
    flex: 1,
  },

  menuLabel: {
    fontSize: 9,
    letterSpacing: 2.5,
    color: COLORS.goldDark,
    fontWeight: '800',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 6,
    opacity: 0.7,
  },

  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 11,
    marginHorizontal: 10,
    marginVertical: 1,
    borderRadius: 12,
    gap: 12,
  },

  drawerItemIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(201,162,39,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  drawerItemLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.warmBrown,
    letterSpacing: 0.2,
  },

  midDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 12,
  },

  midDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.goldDark,
    opacity: 0.25,
  },

  midDividerIcon: {
    fontSize: 13,
    marginHorizontal: 8,
  },

  verseBox: {
    backgroundColor: COLORS.warmBrown,
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.3)',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gold,
  },

  verseText: {
    fontSize: 11,
    color: COLORS.creamDark,
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: 6,
  },

  verseRef: {
    fontSize: 10,
    color: COLORS.goldDark,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  logoutSection: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(192,57,43,0.15)',
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    backgroundColor: 'rgba(192,57,43,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(192,57,43,0.2)',
  },

  logoutIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(192,57,43,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(192,57,43,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoutText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.dangerLight,
    letterSpacing: 0.2,
  },

  footer: {
    backgroundColor: COLORS.deepBrown,
    paddingVertical: 13,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(201,162,39,0.3)',
  },

  footerText: {
    fontSize: 11,
    color: COLORS.goldDark,
    letterSpacing: 1.5,
    fontStyle: 'italic',
  },
});
