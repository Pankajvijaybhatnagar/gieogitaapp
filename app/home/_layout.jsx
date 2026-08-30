import { useAuth } from '@/context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Link, usePathname, useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';

import SharedTabBar from '@/components/navigation/SharedTabBar';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

const TAB_BAR_HEIGHT = 58;
const TAB_BAR_GAP = 10;

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
  { label: 'Reading', icon: 'book', route: '/home/(tabs)/reading' },
  { label: 'Profile', icon: 'user-circle', route: '/home/(tabs)/profile' },
  { label: 'Events', icon: 'calendar', route: '/home/eventgroup' },
  { label: 'Live Darshan', icon: 'video-camera', route: '/home/livedarshan' },
  { label: 'Bal Sanskar', icon: 'child', route: '/home/balSanskar' },
  { label: 'Gaushala', icon: 'leaf', route: '/home/GieoGaushala' },
  { label: 'Join Gieo', icon: 'users', route: '/home/JoinGieoGita' },
  { label: 'Health', icon: 'medkit', route: '/home/health' },
  { label: 'Promotional', icon: 'bullhorn', route: '/home/promotional' },
  { label: 'Help', icon: 'question-circle', route: '/home/help' },
];

// ─── BOTTOM TAB CONFIG ────────────────────────────────────────────────────────
const TABS = [
  {
    label: 'Home',
    icon: 'home-outline',
    iconFocused: 'home',
    route: '/home/(tabs)',
  },
  {
    label: 'Chants',
    icon: 'music-note-outline',
    iconFocused: 'music-note',
    route: '/home/(tabs)/chants',
  },
  {
    label: 'Seva',
    icon: 'hand-heart-outline',
    iconFocused: 'hand-heart',
    route: '/home/(tabs)/seva',
  },
  {
    label: 'join',
    icon: 'book-open-outline',
    iconFocused: 'book-open',
    route: '/home/(tabs)/join-gieo-gita',
  },
  {
    label: 'Profile',
    icon: 'account-outline',
    iconFocused: 'account',
    route: '/home/(tabs)/profile',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM DRAWER CONTENT
// ─────────────────────────────────────────────────────────────────────────────
function CustomDrawerContent({ navigation }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, logout, access_token } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      ' Logout',
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
      {/* ══════════════════════════════════
          DRAWER HEADER
      ══════════════════════════════════ */}
      <View style={drawerStyles.header}>
        <View style={drawerStyles.blob1} />
        <View style={drawerStyles.blob2} />

        <View style={drawerStyles.logoRow}>
          <View style={drawerStyles.logoCircle}>
            <Text style={drawerStyles.logoEmoji}>🪷</Text>
          </View>
          <View>
            <Text style={drawerStyles.logoMain}>GIEO GITA </Text>
            <Text style={drawerStyles.logoSub}>॥ कृष्ण कृपा ॥</Text>
            <Link href={'/login2'}>login 2</Link>
          </View>
        </View>

        <View style={drawerStyles.taglineBox}>
          <Text style={drawerStyles.taglineBig}>Gieo Gita</Text>
          <Text style={drawerStyles.taglineSmall}>
            Eighteen verse Gita recitation campaign
          </Text>
          <TouchableOpacity
            onPress={() => {
              console.log(user);
            }}>
            <Text>Consoling User</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ══════════════════════════════════
          NAV ITEMS — scrollable
      ══════════════════════════════════ */}
      <ScrollView
        style={drawerStyles.itemsScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}>
        <Text style={drawerStyles.menuLabel}>NAVIGATION</Text>

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

        {/* ── Gold divider ── */}
        <View style={drawerStyles.midDivider}>
          <View style={drawerStyles.midDividerLine} />
          <Text style={drawerStyles.midDividerIcon}>🔱</Text>
          <View style={drawerStyles.midDividerLine} />
        </View>

        {/* ── Bhagavad Gita verse ── */}
        <View style={drawerStyles.verseBox}>
          <Text style={drawerStyles.verseText}>
            {
              '"यदा यदा हि धर्मस्य..."\nWhenever dharma declines,\nI manifest myself.'
            }
          </Text>
          <Text style={drawerStyles.verseRef}>— Bhagavad Gita 4.7</Text>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ══════════════════════════════════
          LOGOUT BUTTON + FOOTER
      ══════════════════════════════════ */}
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

      <View style={drawerStyles.footer}>
        <Text style={drawerStyles.footerText}>🕉️ Jai Shri Krishna 🕉️</Text>
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
// HOME LAYOUT
// ─────────────────────────────────────────────────────────────────────────────
export default function HomeLayout() {
  const pathname = usePathname();
  const isProfile = pathname.includes('/profile');
  const insets = useSafeAreaInsets();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        barStyle={isProfile ? 'dark-content' : 'light-content'}
        backgroundColor={isProfile ? '#FFFFFF' : COLORS.deepBrown}
      />

      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,

            // Space reserved for floating tab bar
            paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_GAP + insets.bottom,
          }}>
          <Drawer
            drawerContent={props => <CustomDrawerContent {...props} />}
            screenOptions={({ navigation }) => ({
              headerShown: !isProfile,

              headerStyle: {
                backgroundColor: 'transparent',
                borderBottomWidth: 1.5,
                borderBottomColor: COLORS.gold,
                elevation: 0,
                shadowOpacity: 0,
              },

              headerBackground: () => (
                <BlurView
                  intensity={35}
                  tint="dark"
                  style={{
                    flex: 1,
                    backgroundColor: `${COLORS.deepBrown}E6`,
                  }}
                />
              ),

              headerTintColor: COLORS.goldLight,
              headerTitleAlign: 'center',
              headerTitle: () => <HeaderTitle />,

              headerLeft: () => (
                <TouchableOpacity
                  style={headerStyles.menuBtn}
                  onPress={() => navigation.toggleDrawer()}>
                  <FontAwesome name="bars" size={17} color={COLORS.goldLight} />
                </TouchableOpacity>
              ),

              headerRight: () => (
                <View style={headerStyles.rightRow}>
                  {__DEV__ && (
                    <Link color="white" href="/_sitemap">
                      S
                    </Link>
                  )}

                  <TouchableOpacity style={headerStyles.iconBtn}>
                    <FontAwesome
                      name="bell"
                      size={15}
                      color={COLORS.goldLight}
                    />

                    <View style={headerStyles.notifDot} />
                  </TouchableOpacity>

                  <TouchableOpacity style={headerStyles.iconBtn}>
                    <FontAwesome
                      name="search"
                      size={15}
                      color={COLORS.goldLight}
                    />
                  </TouchableOpacity>
                </View>
              ),

              drawerStyle: {
                backgroundColor: COLORS.cream,
                width: 300,
              },

              drawerActiveTintColor: COLORS.goldLight,
              drawerInactiveTintColor: COLORS.warmBrown,

              drawerActiveBackgroundColor: 'rgba(201,162,39,0.1)',
            })}>
            <Drawer.Screen
              name="(tabs)"
              options={{
                drawerLabel: 'Home',
                title: 'Home',
              }}
            />

            <Drawer.Screen
              name="eventgroup"
              options={{
                drawerLabel: 'Events',
                title: 'Events',
              }}
            />

            <Drawer.Screen
              name="livedarshan"
              options={{
                drawerLabel: 'Live Darshan',
                title: 'Live Darshan',
              }}
            />

            <Drawer.Screen
              name="balSanskar"
              options={{
                drawerLabel: 'Bal Sanskar',
                title: 'Bal Sanskar',
              }}
            />

            <Drawer.Screen
              name="GieoGaushala"
              options={{
                drawerLabel: 'Gaushala',
                title: 'Gaushala',
              }}
            />

            <Drawer.Screen
              name="JoinGieoGita"
              options={{
                drawerLabel: 'Join Gieo',
                title: 'Join Gieo',
              }}
            />

            <Drawer.Screen
              name="health"
              options={{
                drawerLabel: 'Health',
                title: 'Health',
              }}
            />

            <Drawer.Screen
              name="promotional"
              options={{
                drawerLabel: 'Promotional',
                title: 'Promotional',
              }}
            />

            <Drawer.Screen
              name="help"
              options={{
                drawerLabel: 'Help',
                title: 'Help',
              }}
            />
          </Drawer>
        </View>

        <SharedTabBar />
      </View>
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

// ─── BOTTOM TAB STYLES ────────────────────────────────────────────────────────
const tabStyles = StyleSheet.create({
  /* ==========================================
     OUTER TAB BAR WRAPPER
  ========================================== */

  tabBarWrapper: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingTop: 8,
  },

  /* ==========================================
     MAIN FLOATING TAB BAR
  ========================================== */

  tabBar: {
    height: 58,

    // COLORS.deepBrown (#2C1A0A) with transparency
    backgroundColor: 'rgba(44, 26, 10, 0.90)',

    flexDirection: 'row',
    alignItems: 'center',

    borderRadius: 29,

    marginHorizontal: 5,

    paddingHorizontal: 8,

    // Very subtle border gives glass/floating appearance
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 39, 0.20)',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,

    elevation: 10,

    overflow: 'visible',
  },

  /* ==========================================
     NORMAL TAB
  ========================================== */

  tabItem: {
    flex: 1,

    height: '100%',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 3,

    position: 'relative',
  },

  tabLabel: {
    fontSize: 9,

    color: COLORS.goldDark,

    fontWeight: '600',

    letterSpacing: 0.2,
  },

  tabLabelActive: {
    color: COLORS.goldLight,

    fontWeight: '700',
  },

  /* ==========================================
     CENTER SEVA TAB
  ========================================== */

  centerTab: {
    flex: 1,

    height: 58,

    alignItems: 'center',
    justifyContent: 'center',

    position: 'relative',

    overflow: 'visible',

    zIndex: 20,
  },

  /* ==========================================
     TRANSPARENT CENTER NOTCH AREA
  ========================================== */

  notchWrap: {
    position: 'absolute',

    top: -28,

    width: 78,
    height: 78,

    alignItems: 'center',
    justifyContent: 'center',

    // IMPORTANT:
    // Nothing behind the Seva circle
    backgroundColor: 'transparent',

    zIndex: 50,
  },

  /* ==========================================
     LEFT CURVED SHOULDER
  ========================================== */

  leftShoulder: {
    position: 'absolute',

    width: 26,
    height: 26,

    left: -15,
    bottom: 9,

    backgroundColor: 'rgba(44, 26, 10, 0.90)',

    borderTopRightRadius: 26,

    zIndex: 1,
  },

  /* ==========================================
     RIGHT CURVED SHOULDER
  ========================================== */

  rightShoulder: {
    position: 'absolute',

    width: 26,
    height: 26,

    right: -15,
    bottom: 9,

    backgroundColor: 'rgba(44, 26, 10, 0.90)',

    borderTopLeftRadius: 26,

    zIndex: 1,
  },

  /* ==========================================
     SEVA CIRCULAR BUTTON
  ========================================== */

  centerButton: {
    width: 60,
    height: 60,

    borderRadius: 30,

    // Slightly transparent gold
    backgroundColor: 'rgba(201, 162, 39, 0.94)',

    borderWidth: 2,

    borderColor: 'rgba(232, 197, 90, 0.75)',

    alignItems: 'center',
    justifyContent: 'center',

    zIndex: 100,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.22,

    shadowRadius: 7,

    elevation: 12,
  },

  centerButtonActive: {
    // COLORS.goldLight with slight transparency
    backgroundColor: 'rgba(232, 197, 90, 0.96)',

    borderColor: COLORS.gold,
  },

  /* ==========================================
     SEVA LABEL
  ========================================== */

  centerLabel: {
    fontSize: 8,

    marginTop: 1,

    color: COLORS.deepBrown,

    fontWeight: '700',

    letterSpacing: 0.1,
  },

  centerLabelActive: {
    color: COLORS.deepBrown,

    fontWeight: '800',
  },
});

// ─── DRAWER STYLES ────────────────────────────────────────────────────────────
const drawerStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
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
