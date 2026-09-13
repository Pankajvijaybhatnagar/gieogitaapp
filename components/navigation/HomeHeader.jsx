import { COLORS, RGB } from '@/constants/brandColors';
import { radii, spacing } from '@/constants/theme';
import { useHeaderScrollY } from '@/context/HeaderScrollContext';
import { useNotifications } from '@/context/NotificationContext';
import { FontAwesome } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';
import { Link, useRouter } from 'expo-router';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeHeader({ navigation }) {
  const router = useRouter();
  const { unreadCount } = useNotifications();
  const [fontsLoaded] = useFonts({
    'GreatVibes-Regular': require('@/assets/fonts/GreatVibes-Regular.ttf'),
  });

  const scrollY = useHeaderScrollY();
  const blurOpacity = scrollY
    ? scrollY.interpolate({
        inputRange: [0, 40],
        outputRange: [0.55, 1],
        extrapolate: 'clamp',
      })
    : 1;

  return (
    <View style={styles.headerShadowWrap}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <Animated.View
          style={[StyleSheet.absoluteFill, { opacity: blurOpacity }]}>
          <BlurView
            intensity={65}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
          <View style={[StyleSheet.absoluteFill, styles.headerTint]} />
        </Animated.View>

        <View style={styles.topRow}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            onPress={() => navigation.toggleDrawer()}
            style={styles.menuButton}>
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
          {__DEV__ && (
            <Link href="/_sitemap" style={styles.sitemap}>
              S
            </Link>
          )}
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            style={styles.iconButton}
            onPress={() => router.push('/home/notifications')}>
            <FontAwesome name="bell-o" size={18} color={COLORS.richBrown} />
            {unreadCount > 0 && <View style={styles.notificationDot} />}
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

const styles = StyleSheet.create({
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
  headerTint: {
    backgroundColor: `rgba(${RGB.cream},0.28)`,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', minHeight: 46, gap: 2 },
  iconButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.cream,
    backgroundColor: COLORS.saffron,
    position: 'absolute',
    top: 6,
    right: 8,
  },
});
