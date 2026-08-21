import { useAuth } from '@/context/AuthContext';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, usePathname, useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

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
    label: 'Reading',
    icon: 'book-open-outline',
    iconFocused: 'book-open',
    route: '/home/(tabs)/reading',
  },
  {
    label: 'Profile',
    icon: 'account-outline',
    iconFocused: 'account',
    route: '/home/(tabs)/profile',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SHARED BOTTOM TAB BAR
// ─────────────────────────────────────────────────────────────────────────────
function SharedTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isTabActive = route => {
    // strip /home and /(tabs) to get the clean segment e.g. '/chants'
    const segment = route.replace('/home', '').replace('/(tabs)', '') || '/';

    if (segment === '/') {
      // Home tab is active when on the root tabs screen
      return (
        pathname === '/' ||
        pathname === '/index' ||
        pathname === '/home' ||
        pathname.endsWith('/(tabs)') ||
        pathname.endsWith('/index')
      );
    }
    // e.g. segment = '/chants', pathname = '/chants' or '/home/chants'
    return pathname.endsWith(segment.replace('/', ''));
  };

  return (
    <View style={[tabStyles.tabBar, { paddingBottom: insets.bottom + 8 }]}>
      {/* Gold top line */}
      <View style={tabStyles.topGoldLine} />

      <View style={tabStyles.tabBarInner}>
        {TABS.map((tab, index) => {
          const isSeva = tab.label === 'Seva';
          const isActive = isTabActive(tab.route);

          return (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(tab.route)}
              activeOpacity={0.75}
              style={[tabStyles.tabItem, isSeva && tabStyles.tabItemSeva]}>
              {/* Active pill highlight — regular tabs only */}
              {isActive && !isSeva && <View style={tabStyles.activePill} />}

              {isSeva ? (
                /* ── Elevated Seva centre button ── */
                <View
                  style={[
                    tabStyles.sevaButton,
                    isActive && tabStyles.sevaButtonActive,
                  ]}>
                  <MaterialCommunityIcons
                    name={isActive ? tab.iconFocused : tab.icon}
                    size={26}
                    color={isActive ? COLORS.deepBrown : COLORS.goldLight}
                  />
                </View>
              ) : (
                /* ── Regular tab icon ── */
                <View style={tabStyles.iconWrap}>
                  <MaterialCommunityIcons
                    name={isActive ? tab.iconFocused : tab.icon}
                    size={22}
                    color={isActive ? COLORS.goldLight : COLORS.goldDark}
                  />
                  {isActive && <View style={tabStyles.activeDot} />}
                </View>
              )}

              <Text
                style={[
                  tabStyles.tabLabel,
                  isActive && tabStyles.tabLabelActive,
                  isSeva && tabStyles.tabLabelSeva,
                  isSeva && isActive && tabStyles.tabLabelSevaActive,
                ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

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
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/*
        Outer View is a column:
          Row 1 — Drawer (flex:1, takes all remaining space)
          Row 2 — SharedTabBar (fixed height, always visible)
      */}
      <View style={{ flex: 1 }}>
        {/* ── Drawer fills everything above the tab bar ── */}
        <View style={{ flex: 1 }}>
          <Drawer
            drawerContent={props => <CustomDrawerContent {...props} />}
            screenOptions={({ navigation }) => ({
              // ── Header ──────────────────────────────────────────
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

              // ── Menu button (left) ───────────────────────────────
              headerLeft: () => (
                <TouchableOpacity
                  style={headerStyles.menuBtn}
                  onPress={() => navigation.toggleDrawer()}>
                  <FontAwesome name="bars" size={17} color={COLORS.goldLight} />
                </TouchableOpacity>
              ),

              // ── Right icons ──────────────────────────────────────
              headerRight: () => (
                <View style={headerStyles.rightRow}>
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

              // ── Drawer panel ─────────────────────────────────────
              drawerStyle: {
                backgroundColor: COLORS.cream,
                width: 300,
              },
              drawerActiveTintColor: COLORS.goldLight,
              drawerInactiveTintColor: COLORS.warmBrown,
              drawerActiveBackgroundColor: 'rgba(201,162,39,0.1)',
            })}>
            {/* ── All screens registered ── */}
            <Drawer.Screen
              name="(tabs)"
              options={{ drawerLabel: 'Home', title: 'Home' }}
            />
            <Drawer.Screen
              name="eventgroup"
              options={{ drawerLabel: 'Events', title: 'Events' }}
            />
            <Drawer.Screen
              name="livedarshan"
              options={{ drawerLabel: 'Live Darshan', title: 'Live Darshan' }}
            />
            <Drawer.Screen
              name="balSanskar"
              options={{ drawerLabel: 'Bal Sanskar', title: 'Bal Sanskar' }}
            />
            <Drawer.Screen
              name="GieoGaushala"
              options={{ drawerLabel: 'Gaushala', title: 'Gaushala' }}
            />
            <Drawer.Screen
              name="JoinGieoGita"
              options={{ drawerLabel: 'Join Gieo', title: 'Join Gieo' }}
            />
            <Drawer.Screen
              name="health"
              options={{ drawerLabel: 'Health', title: 'Health' }}
            />
            <Drawer.Screen
              name="promotional"
              options={{ drawerLabel: 'Promotional', title: 'Promotional' }}
            />
            <Drawer.Screen
              name="help"
              options={{ drawerLabel: 'Help', title: 'Help' }}
            />
          </Drawer>
        </View>

        {/* ── Tab bar always visible at the bottom on ALL screens ── */}
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
  tabBar: {
    backgroundColor: COLORS.deepBrown,
  },
  topGoldLine: {
    height: 1,
    backgroundColor: COLORS.gold,
    opacity: 0.35,
  },
  tabBarInner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingTop: 6,
    paddingHorizontal: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 4,
    position: 'relative',
    minHeight: 54,
  },
  activePill: {
    position: 'absolute',
    top: 0,
    left: '12%',
    right: '12%',
    height: '100%',
    backgroundColor: 'rgba(201,162,39,0.1)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.22)',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.gold,
    marginTop: 3,
  },
  tabLabel: {
    fontSize: 9,
    color: COLORS.goldDark,
    letterSpacing: 0.5,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  tabLabelActive: {
    color: COLORS.goldLight,
  },
  tabItemSeva: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 4,
    minHeight: 54,
    marginTop: -20,
  },
  sevaButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.warmBrown,
    borderWidth: 2,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  sevaButtonActive: {
    backgroundColor: COLORS.goldLight,
    borderColor: COLORS.goldDark,
  },
  tabLabelSeva: {
    fontSize: 9,
    color: COLORS.goldDark,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  tabLabelSevaActive: {
    color: COLORS.goldLight,
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
