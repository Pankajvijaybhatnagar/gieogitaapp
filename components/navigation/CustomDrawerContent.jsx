import { useAuth } from '@/context/AuthContext';
import { useAppAlert } from '@/context/AppAlertContext';
import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// ─── COLOR PALETTE ────────────────────────────────────────────────────────────
import { Fonts, hairline, spacing } from '@/constants/theme';
import { COLORS, RGB } from '@/constants/brandColors';

// ─── DRAWER NAV ITEMS ─────────────────────────────────────────────────────────
// Exported so the header's Search page can reuse the same real, working
// destinations instead of duplicating (and risking drifting from) this list.
export const DRAWER_ITEMS = [
  { label: 'Home', icon: 'home', route: '/home/(tabs)' },
  { label: 'Chants', icon: 'music', route: '/home/(tabs)/chants' },
  { label: 'My Donations', icon: 'music', route: '/home/(tabs)/donations' },
  { label: 'Patrika', icon: 'book', route: '/home/patrika' },
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
  const pathname = usePathname().replace('/(tabs)', '');
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { confirm } = useAppAlert();

  const handleLogout = () => {
    confirm(
      'Logout',
      'Are you sure you want to logout?',
      async () => {
        const res = await logout();
        if (res.status) router.replace('/login2');
      },
      {
        buttonText: 'Logout',
        secondaryButtonText: 'Cancel',
        destructive: true,
        icon: 'log-out-outline',
      },
    );
  };

  return (
    <View style={drawerStyles.root}>
      {/* ── DRAWER HEADER ── */}
      <View style={[drawerStyles.header, { paddingTop: Math.max(insets.top, 20) + 20 }]}>
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
            accessibilityRole="button"
            accessibilityState={{ selected: pathname === item.route.replace('/(tabs)', '') }}
            style={[drawerStyles.drawerItem, pathname === item.route.replace('/(tabs)', '') && { backgroundColor: `rgba(${RGB.saffron},0.12)` }]}
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
      <View style={[drawerStyles.logoutSection, { paddingBottom: Math.max(insets.bottom, 12) }]}>
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
    backgroundColor: COLORS.cream
  },
  header: {
    paddingTop: 56,
    paddingHorizontal: spacing.lg,
    paddingBottom: 28,
    borderBottomWidth: 0,
    borderBottomColor: hairline,
    backgroundColor: COLORS.richBrown
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2
  },
  logoCircle: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoEmoji: {
    fontSize: 20
  },
  logoMain: {
    fontSize: 25,
    fontWeight: "400",
    color: COLORS.white,
    letterSpacing: -0.4,
    fontFamily: Fonts.serif
  },
  logoSub: {
    fontSize: 13,
    color: `rgba(${RGB.cream},0.85)`,
    marginTop: 2
  },
  taglineBox: {
    backgroundColor: `rgba(${RGB.gold},0.08)`,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `rgba(${RGB.gold},0.2)`,
    padding: 12
  },
  taglineBig: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.cream,
    marginBottom: 3,
    letterSpacing: 0.3
  },
  taglineSmall: {
    fontSize: 10,
    color: COLORS.goldDark
  },
  itemsScroll: {
    flex: 1
  },
  menuLabel: {
    fontSize: 11,
    letterSpacing: 1.6,
    color: COLORS.warmBrown,
    fontWeight: "600",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
    opacity: 0.7
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 14,
    marginVertical: 3,
    borderRadius: 16,
    gap: 12,
    minHeight: 56
  },
  drawerItemIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.creamDark,
    borderWidth: 0,
    borderColor: `rgba(${RGB.gold},0.2)`,
    alignItems: 'center',
    justifyContent: 'center'
  },
  drawerItemLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.deepBrown,
    letterSpacing: 0.2
  },
  midDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 12
  },
  midDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.goldDark,
    opacity: 0.25
  },
  midDividerIcon: {
    fontSize: 13,
    marginHorizontal: 8
  },
  verseBox: {
    backgroundColor: `rgba(${RGB.maroon},0.06)`,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: hairline,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.richBrown
  },
  verseText: {
    fontSize: 13,
    color: COLORS.richBrown,
    lineHeight: 22,
    marginBottom: 6
  },
  verseRef: {
    fontSize: 12,
    color: COLORS.richBrown,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  logoutSection: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(214,40,57,0.15)'
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    backgroundColor: 'rgba(214,40,57,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(214,40,57,0.2)'
  },
  logoutIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(214,40,57,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(214,40,57,0.25)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoutText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.dangerLight,
    letterSpacing: 0.2
  },
  footer: {
    backgroundColor: COLORS.cream,
    paddingVertical: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: hairline
  },
  footerText: {
    fontSize: 11,
    color: COLORS.warmBrown,
    letterSpacing: 1.5
  }
});
