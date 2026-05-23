import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { logout } from '@/components/redux/authSlice'; // ← your existing auth slice

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

// ─── DRAWER NAV ITEMS — exact routes from folder structure ───────────────────
const DRAWER_ITEMS = [
  { label: 'Home', icon: 'home', route: '/home/(tabs)' },
  { label: 'Chants', icon: 'music', route: '/home/(tabs)/chants' },
  { label: 'Reading', icon: 'book', route: '/home/(tabs)/reading' },
  { label: 'Events', icon: 'calendar', route: '/home/eventgroup' },
  { label: 'Seva', icon: 'heart', route: '/home/mypledge' },
  { label: 'Health', icon: 'medkit', route: '/home/health' },
  { label: 'Promotional', icon: 'bullhorn', route: '/home/promotional' },
  { label: 'Help', icon: 'question-circle', route: '/home/help' },
  { label: 'Profile', icon: 'user-circle', route: '/home/(tabs)/profile' },
];

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM DRAWER CONTENT
// ─────────────────────────────────────────────────────────────────────────────
function CustomDrawerContent(props) {
  const router = useRouter();
  const dispatch = useDispatch();

  // ── LOGOUT HANDLER ──────────────────────────────────────────────
  const handleLogout = () => {
    Alert.alert(
      '🕉️ Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());          // clear Redux auth state
            router.replace('/login');    // redirect to login screen
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={drawerStyles.root}>

      {/* ══════════════════════════════════
          DRAWER HEADER
      ══════════════════════════════════ */}
      <View style={drawerStyles.header}>
        {/* Decorative blobs */}
        <View style={drawerStyles.blob1} />
        <View style={drawerStyles.blob2} />

        {/* GIEO GITA Logo row */}
        <View style={drawerStyles.logoRow}>
          <View style={drawerStyles.logoCircle}>
            <Text style={drawerStyles.logoEmoji}>🪷</Text>
          </View>
          <View>
            <Text style={drawerStyles.logoMain}>GIEO GITA</Text>
            <Text style={drawerStyles.logoSub}>॥ कृष्ण कृपा ॥</Text>
          </View>
        </View>

        {/* App tagline box */}
        <View style={drawerStyles.taglineBox}>
          <Text style={drawerStyles.taglineBig}>Gieo Gita</Text>
          <Text style={drawerStyles.taglineSmall}>
            Eighteen verse Gita recitation campaign
          </Text>
        </View>
      </View>

      {/* ══════════════════════════════════
          NAV ITEMS — scrollable
      ══════════════════════════════════ */}
      <ScrollView
        style={drawerStyles.itemsScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        <Text style={drawerStyles.menuLabel}>NAVIGATION</Text>

        {DRAWER_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={drawerStyles.drawerItem}
            onPress={() => router.push(item.route)}
            activeOpacity={0.72}
          >
            {/* Icon box */}
            <View style={drawerStyles.drawerItemIconBox}>
              <FontAwesome name={item.icon} size={15} color={COLORS.goldDark} />
            </View>
            {/* Label */}
            <Text style={drawerStyles.drawerItemLabel}>{item.label}</Text>
            {/* Chevron */}
            <FontAwesome
              name="chevron-right"
              size={10}
              color={COLORS.goldDark}
              style={{ opacity: 0.4 }}
            />
          </TouchableOpacity>
        ))}

        {/* ── Gold divider ── */}
        <View style={drawerStyles.midDivider}>
          <View style={drawerStyles.midDividerLine} />
          <Text style={drawerStyles.midDividerIcon}>🔱</Text>
          <View style={drawerStyles.midDividerLine} />
        </View>

        {/* ── Bhagavad Gita verse ── */}
        <View style={drawerStyles.verseBox}>
          <Text style={drawerStyles.verseText}>
            {"\"यदा यदा हि धर्मस्य...\"\nWhenever dharma declines,\nI manifest myself."}
          </Text>
          <Text style={drawerStyles.verseRef}>— Bhagavad Gita 4.7</Text>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ══════════════════════════════════
          LOGOUT BUTTON + FOOTER
      ══════════════════════════════════ */}

      {/* Logout button — above footer */}
      <View style={drawerStyles.logoutSection}>
        <TouchableOpacity
          style={drawerStyles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <View style={drawerStyles.logoutIconBox}>
            <FontAwesome name="sign-out" size={16} color={COLORS.dangerLight} />
          </View>
          <Text style={drawerStyles.logoutText}>Logout</Text>
          <FontAwesome name="chevron-right" size={10} color={COLORS.dangerLight} style={{ opacity: 0.5 }} />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={drawerStyles.footer}>
        <Text style={drawerStyles.footerText}>🕉️  Jai Shri Krishna  🕉️</Text>
      </View>

    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM HEADER TITLE
// ─────────────────────────────────────────────────────────────────────────────
function HeaderTitle() {
  return (
    <View style={headerStyles.container}>
      <Text style={headerStyles.big}>Gieo Gita</Text>
      <Text style={headerStyles.small}>
        Eighteen verse Gita recitation campaign
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME LAYOUT — original Drawer.Screen route name unchanged
// ─────────────────────────────────────────────────────────────────────────────
export default function HomeLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={({ navigation }) => ({
          // ── Header ────────────────────────────────────────────────
          headerStyle: {
            backgroundColor: COLORS.deepBrown,
            borderBottomWidth: 1.5,
            borderBottomColor: COLORS.gold,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: COLORS.goldLight,
          headerTitleAlign: 'center',
          headerTitle: () => <HeaderTitle />,

          // ── Menu button (left) ────────────────────────────────────
          headerLeft: () => (
            <TouchableOpacity
              style={headerStyles.menuBtn}
              onPress={() => navigation.toggleDrawer()}
            >
              <FontAwesome name="bars" size={17} color={COLORS.goldLight} />
            </TouchableOpacity>
          ),

          // ── Right icons ───────────────────────────────────────────
          headerRight: () => (
            <View style={headerStyles.rightRow}>
              <TouchableOpacity style={headerStyles.iconBtn}>
                <FontAwesome name="bell" size={15} color={COLORS.goldLight} />
                <View style={headerStyles.notifDot} />
              </TouchableOpacity>
              <TouchableOpacity style={headerStyles.iconBtn}>
                <FontAwesome name="search" size={15} color={COLORS.goldLight} />
              </TouchableOpacity>
            </View>
          ),

          // ── Drawer panel ──────────────────────────────────────────
          drawerStyle: {
            backgroundColor: COLORS.cream,
            width: 300,
          },
          drawerActiveTintColor: COLORS.goldLight,
          drawerInactiveTintColor: COLORS.warmBrown,
          drawerActiveBackgroundColor: 'rgba(201,162,39,0.1)',
        })}
      >
        {/* ── original Drawer.Screen unchanged ── */}
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: 'Home',
            title: 'Overview',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

// ─── HEADER STYLES ────────────────────────────────────────────────────────────
const headerStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  big: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.goldLight,
    letterSpacing: 0.8,
  },
  small: {
    fontSize: 9,
    color: COLORS.goldDark,
    letterSpacing: 0.4,
    marginTop: 1,
    fontStyle: 'italic',
  },
  menuBtn: {
    marginLeft: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(201,162,39,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    gap: 8,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(201,162,39,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.saffron,
    borderWidth: 1,
    borderColor: COLORS.deepBrown,
  },
});

// ─── DRAWER STYLES ────────────────────────────────────────────────────────────
const drawerStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  // ── HEADER ──────────────────────────────────────────────────────
  header: {
    backgroundColor: COLORS.deepBrown,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  logoEmoji: { fontSize: 20 },
  logoMain: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.goldLight,
    letterSpacing: 1.5,
  },
  logoSub: {
    fontSize: 10,
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

  // ── NAV ITEMS ───────────────────────────────────────────────────
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

  // ── MID DIVIDER ─────────────────────────────────────────────────
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

  // ── VERSE BOX ───────────────────────────────────────────────────
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

  // ── LOGOUT ──────────────────────────────────────────────────────
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

  // ── FOOTER ──────────────────────────────────────────────────────
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