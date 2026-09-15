import { COLORS, RGB } from '@/constants/brandColors';
import { radii, spacing } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

export default function SharedTabBar() {
  const router = useRouter();
  const Pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isTabActive = route => {
    const segment = route.replace('/home', '').replace('/(tabs)', '') || '/';

    if (segment === '/') {
      return (
        Pathname === '/' ||
        Pathname === '/index' ||
        Pathname === '/home' ||
        Pathname.endsWith('/(tabs)') ||
        Pathname.endsWith('/index')
      );
    }

    return Pathname.endsWith(segment.replace('/', ''));
  };

  const sevaIndex = TABS.findIndex(tab => tab.label === 'Seva');
  const sevaTab = TABS[sevaIndex];
  const isSevaActive = sevaTab ? isTabActive(sevaTab.route) : false;

  /*
  |--------------------------------------------------------------------------
  | ACTIVE-TAB ANIMATION
  |--------------------------------------------------------------------------
  |
  | One Animated.Value per tab (0 = inactive, 1 = active). Whichever page
  | the person is on springs its pill highlight + icon in, and the Seva
  | button gets the same "pop" treatment as every other tab.
  |
  */

  const tabAnims = useRef(
    TABS.map(tab => new Animated.Value(isTabActive(tab.route) ? 1 : 0)),
  ).current;

  useEffect(() => {
    TABS.forEach((tab, index) => {
      Animated.spring(tabAnims[index], {
        toValue: isTabActive(tab.route) ? 1 : 0,
        useNativeDriver: true,
        friction: 7,
        tension: 70,
      }).start();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Pathname]);

  return (
    <View
      style={[
        styles.tabBarWrapper,
        {
          // Floats the bar above the home indicator instead of letting it
          // sit flush against the very bottom edge of the screen.
          paddingBottom: Math.max(insets.bottom, spacing.sm) + spacing.sm,
        },
      ]}>
      {/* FLOATING PILL — shadow lives here, unclipped, so it reads as lifted */}
      <View style={styles.tabBarFloating}>
        {/* CLIPPED BACKGROUND — rounded corners cut the blur/tint cleanly */}
        <View style={styles.tabBarClip}>
          <BlurView intensity={98} tint="light" style={StyleSheet.absoluteFill}>
            <View style={[StyleSheet.absoluteFill, styles.tabBarOverlay]} />

            <View style={styles.tabBar}>
              {TABS.map((tab, index) => {
                // The Seva tab renders as a floating overlay below (outside
                // the clip) so its notch can pop above the bar — reserve an
                // equal-width empty slot here to keep the other tabs centered.
                if (tab.label === 'Seva') {
                  return <View key={index} style={styles.centerSpacer} />;
                }

                const isActive = isTabActive(tab.route);
                const anim = tabAnims[index];

                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.75}
                    onPress={() => router.push(tab.route)}
                    style={styles.tabItem}>
                    <View style={styles.iconSlot}>
                      {/* Pill highlight — fades + grows in behind the icon
                        for whichever page the person is currently on. */}
                      <Animated.View
                        pointerEvents="none"
                        style={[
                          styles.iconPill,
                          {
                            opacity: anim,
                            transform: [
                              {
                                scale: anim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0.6, 1],
                                }),
                              },
                            ],
                          },
                        ]}
                      />

                      <Animated.View
                        style={{
                          transform: [
                            {
                              translateY: anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -2],
                              }),
                            },
                            {
                              scale: anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 1.12],
                              }),
                            },
                          ],
                        }}>
                        <MaterialCommunityIcons
                          name={isActive ? tab.iconFocused : tab.icon}
                          size={22}
                          color={isActive ? COLORS.richBrown : COLORS.warmBrown}
                        />
                      </Animated.View>
                    </View>

                    <Text
                      numberOfLines={1}
                      style={[
                        styles.tabLabel,
                        isActive && styles.tabLabelActive,
                      ]}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </BlurView>
        </View>

        {/* ───────────────────────────────────────
            CENTER SEVA BUTTON — unclipped overlay
        ─────────────────────────────────────── */}
        {sevaTab && (
          // `box-none`: this outer box itself never intercepts touches —
          // only its children can. Without this, the full 78x58 notch
          // envelope (including the transparent gaps) was swallowing taps
          // meant for the Chants/join tabs next to it.
          <View pointerEvents="box-none" style={styles.centerTabAbsolute}>
            {/* The only real tap target — sized to the visible circle, not
                the wider decorative notch, so it can't reach into the
                neighboring tabs' touch areas. */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push(sevaTab.route)}
              style={styles.centerButtonTouchable}>
              <Animated.View
                style={[
                  styles.centerButton,
                  isSevaActive && styles.centerButtonActive,
                  {
                    transform: [
                      {
                        scale: tabAnims[sevaIndex].interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.08],
                        }),
                      },
                    ],
                  },
                ]}>
                <MaterialCommunityIcons
                  name={isSevaActive ? sevaTab.iconFocused : sevaTab.icon}
                  size={23}
                  color={COLORS.white}
                />

                <Text style={styles.centerLabel}>{sevaTab.label}</Text>
              </Animated.View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // =====================================================
  // WRAPPER
  // =====================================================
  //
  // NOT ABSOLUTE
  //
  // This takes real space in the parent layout.
  // The wrapper itself is completely transparent.
  //
  tabBarWrapper: {
    width: '100%',

    position: 'absolute',

    overflow: 'visible',

    zIndex: 999,

    elevation: 15,

    // Side + bottom breathing room so the bar reads as a floating pill
    // instead of a bar glued to the screen edges.
    paddingHorizontal: spacing.md,

    paddingTop: spacing.xs,
    bottom: 0,
  },

  // Unclipped outer layer — holds the "lifted" shadow. Overflow stays
  // visible so the center Seva button can pop up above the bar.
  tabBarFloating: {
    position: 'relative',

    overflow: 'visible',

    borderRadius: radii.xl,

    shadowColor: COLORS.richBrown,

    shadowOffset: { width: 0, height: 10 },

    shadowOpacity: 0.14,

    shadowRadius: 20,

    elevation: 17,
    borderWidth: 0,
  },

  // Clipped inner layer — rounds the blur/tint to a clean pill shape.
  tabBarClip: {
    height: 58,

    borderRadius: radii.xl,

    overflow: 'hidden',
  },

  // A lighter, more transparent tint than the shared `glass.overlayStrong`
  // (98% opaque) — that value is tuned for GlassCard's solid frosted
  // surfaces, but painted over the tab bar's blur it hid almost all of it.
  // This keeps just enough tint for the icons/labels to stay readable
  // while still reading as genuinely glassy.
  tabBarOverlay: {
    backgroundColor: `rgba(${RGB.cream},0.38)`,
  },

  // =====================================================
  // ACTUAL TAB BAR
  // =====================================================

  tabBar: {
    height: 58,

    width: '100%',

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 8,
  },

  // =====================================================
  // NORMAL TAB
  // =====================================================

  tabItem: {
    flex: 1,

    height: '100%',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 3,

    position: 'relative',
  },

  centerSpacer: {
    flex: 1,

    height: '100%',
  },

  // Fixed-size slot so the animated pill always sits exactly behind the
  // icon, regardless of the tab item's own layout.
  iconSlot: {
    width: 40,

    height: 28,

    alignItems: 'center',

    justifyContent: 'center',

    position: 'relative',
  },

  iconPill: {
    position: 'absolute',

    width: 40,

    height: 28,

    borderRadius: radii.pill,

    backgroundColor: `rgba(${RGB.maroon},0.12)`,
  },

  tabLabel: {
    fontSize: 9,

    color: COLORS.warmBrown,

    fontWeight: '600',

    letterSpacing: 0.2,
  },

  tabLabelActive: {
    color: COLORS.richBrown,

    fontWeight: '700',
  },

  // =====================================================
  // CENTER SEVA TAB
  // =====================================================

  centerTabAbsolute: {
    position: 'absolute',

    top: 0,

    left: '50%',

    marginLeft: -39,

    width: 78,

    height: 58,

    alignItems: 'center',

    justifyContent: 'center',

    zIndex: 20,
  },

  // The real tap target — sized to just the visible circle (plus a small
  // comfortable margin), not the wider decorative notch envelope, so it
  // can't steal taps meant for the Chants/join tabs on either side.
  centerButtonTouchable: {
    position: 'absolute',

    top: -23,

    left: 6,

    width: 66,

    height: 66,

    alignItems: 'center',

    justifyContent: 'center',
  },

  // =====================================================
  // CENTER BUTTON
  // =====================================================

  centerButton: {
    width: 62,

    height: 62,

    borderRadius: 31,

    backgroundColor: COLORS.richBrown,

    borderWidth: 3,

    borderColor: COLORS.cream,

    alignItems: 'center',

    justifyContent: 'center',

    zIndex: 100,

    shadowColor: COLORS.richBrown,

    shadowOffset: {
      width: 0,
      height: 6,
    },

    shadowOpacity: 0.35,

    shadowRadius: 10,

    elevation: 15,
  },

  // Active state keeps the same brown fill (all buttons stay one color) and
  // signals "active" with a gold ring instead of swapping the fill color.
  centerButtonActive: {
    borderColor: COLORS.gold,
  },

  // =====================================================
  // CENTER LABEL
  // =====================================================

  centerLabel: {
    fontSize: 8,

    marginTop: 1,

    color: COLORS.white,

    fontWeight: '700',

    letterSpacing: 0.1,
  },
});
