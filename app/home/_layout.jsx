import { FontAwesome } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';
import { Link, useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Animated, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomDrawerContent from '@/components/navigation/CustomDrawerContent';
import SharedTabBar from '@/components/navigation/SharedTabBar';
import { COLORS, RGB } from '@/constants/brandColors';
import { radii, spacing } from '@/constants/theme';
import { HeaderScrollProvider, useHeaderScrollY } from '@/context/HeaderScrollContext';

function HomeHeader({ navigation }) {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    'GreatVibes-Regular': require('@/assets/fonts/GreatVibes-Regular.ttf'),
  });

  // Fully transparent at the top of the page, fading in its frosted-glass
  // blur/tint over the first ~40px of scroll — whichever screen is active
  // reports its own scroll position via useHeaderScrollProps().
  const scrollY = useHeaderScrollY();
  const blurOpacity = scrollY
    ? scrollY.interpolate({ inputRange: [0, 40], outputRange: [0, 1], extrapolate: 'clamp' })
    : 1;

  return (
    // Shadow lives on this outer, unclipped layer — `overflow: hidden`
    // (needed below to clip the blur to the rounded bottom corners) would
    // otherwise suppress it.
    <View style={styles.headerShadowWrap}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: blurOpacity }]}>
          <BlurView intensity={65} tint="light" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, styles.headerTint]} />
        </Animated.View>

        <View style={styles.topRow}>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open menu" onPress={() => navigation.toggleDrawer()} style={styles.menuButton}>
            <View style={styles.menuBar} />
            <View style={[styles.menuBar, styles.menuBarShort]} />
            <View style={styles.menuBar} />
          </TouchableOpacity>
          <View style={styles.brand}>
            {fontsLoaded ? (
              <Text
                style={styles.brandText}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.4}>
                Shri Krishna Kripa
              </Text>
            ) : null}
          </View>
          {__DEV__ && <Link href="/_sitemap" style={styles.sitemap}>S</Link>}
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            style={styles.iconButton}
            onPress={() => router.push('/home/notifications')}>
            <FontAwesome name="bell-o" size={18} color={COLORS.richBrown} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Search"
            style={styles.iconButton}
            onPress={() => router.push('/home/search')}>
            <FontAwesome name="search" size={17} color={COLORS.richBrown} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default function HomeLayout() {
  return (
    <GestureHandlerRootView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />
      <HeaderScrollProvider>
      <View style={styles.screen}>
        <Drawer drawerContent={props => <CustomDrawerContent {...props} />}
          screenOptions={{ headerShown: true, header: props => <HomeHeader {...props} />,
            sceneStyle: { backgroundColor: COLORS.cream },
            drawerStyle: { backgroundColor: COLORS.cream, width: 304 },
            drawerActiveTintColor: COLORS.saffron, drawerInactiveTintColor: COLORS.warmBrown,
            drawerActiveBackgroundColor: `rgba(${RGB.saffron},0.12)` }}>
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
        <SharedTabBar />
      </View>
      </HeaderScrollProvider>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.cream },
  headerShadowWrap: {
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
  },
  header: {
    overflow: 'hidden',
    paddingHorizontal: spacing.sm + 4,
    paddingBottom: spacing.xs,
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
  },
  // Frosted glass tint over the blur — same treatment as the bottom tab
  // bar, so the header reads as genuinely glassy rather than flat white.
  headerTint: {
    backgroundColor: `rgba(${RGB.cream},0.38)`,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', minHeight: 46, gap: 2 },
  iconButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Custom asymmetric bar mark instead of a stock hamburger glyph.
  menuButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  menuBar: {
    width: 18,
    height: 2,
    borderRadius: 1,
    backgroundColor: COLORS.richBrown,
  },
  menuBarShort: {
    width: 11,
    alignSelf: 'flex-start',
    marginLeft: 12,
  },
  brand: { flex: 1, justifyContent: 'center' },
  brandText: {
    width: '100%',
    fontFamily: 'GreatVibes-Regular',
    fontWeight: '400',
    fontSize: 22,
    lineHeight: 28,
    color: COLORS.richBrown,
    textAlign: 'center',
    letterSpacing: 0.3,
    textShadowColor: `rgba(${RGB.gold}, 0.45)`,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  sitemap: { color: COLORS.warmBrown, fontSize: 10, padding: 4 },
  notificationDot: { width: 8, height: 8, borderRadius: 4, borderWidth: 1.5, borderColor: COLORS.cream, backgroundColor: COLORS.saffron, position: 'absolute', top: 6, right: 8 },
});
