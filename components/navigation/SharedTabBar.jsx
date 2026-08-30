import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
};

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
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isTabActive = route => {
    const segment = route.replace('/home', '').replace('/(tabs)', '') || '/';

    if (segment === '/') {
      return (
        pathname === '/' ||
        pathname === '/index' ||
        pathname === '/home' ||
        pathname.endsWith('/(tabs)') ||
        pathname.endsWith('/index')
      );
    }

    return pathname.endsWith(segment.replace('/', ''));
  };

  return (
    <View
      style={[
        styles.tabBarWrapper,
        {
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}>
      <View style={styles.tabBar}>
        {TABS.map((tab, index) => {
          const isSeva = tab.label === 'Seva';
          const isActive = isTabActive(tab.route);

          // ─────────────────────────────────────────
          // CENTER SEVA BUTTON
          // ─────────────────────────────────────────
          if (isSeva) {
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.85}
                onPress={() => router.push(tab.route)}
                style={styles.centerTab}>
                <View style={styles.notchWrap}>
                  <View style={styles.leftShoulder} />
                  <View style={styles.rightShoulder} />

                  <View
                    style={[
                      styles.centerButton,
                      isActive && styles.centerButtonActive,
                    ]}>
                    <MaterialCommunityIcons
                      name={isActive ? tab.iconFocused : tab.icon}
                      size={23}
                      color={isActive ? COLORS.deepBrown : COLORS.warmBrown}
                    />

                    <Text
                      style={[
                        styles.centerLabel,
                        isActive && styles.centerLabelActive,
                      ]}>
                      {tab.label}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }

          // ─────────────────────────────────────────
          // NORMAL TAB
          // ─────────────────────────────────────────
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.75}
              onPress={() => router.push(tab.route)}
              style={styles.tabItem}>
              <MaterialCommunityIcons
                name={isActive ? tab.iconFocused : tab.icon}
                size={22}
                color={isActive ? COLORS.goldLight : COLORS.goldDark}
              />

              <Text
                numberOfLines={1}
                style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
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

    backgroundColor: 'transparent',

    zIndex: 999,

    elevation: 20,
  },

  // =====================================================
  // ACTUAL TAB BAR
  // =====================================================

  tabBar: {
    height: 58,

    width: '100%',

    backgroundColor: COLORS.deepBrown,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 8,

    borderTopWidth: 1,

    borderColor: 'rgba(201, 162, 39, 0.22)',

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: -4,
    },

    shadowOpacity: 0.22,

    shadowRadius: 10,

    elevation: 15,

    overflow: 'visible',
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

  // =====================================================
  // CENTER SEVA TAB
  // =====================================================

  centerTab: {
    flex: 1,

    height: 58,

    alignItems: 'center',

    justifyContent: 'center',

    position: 'relative',

    overflow: 'visible',

    zIndex: 20,
  },

  // =====================================================
  // CENTER NOTCH
  // =====================================================

  notchWrap: {
    position: 'absolute',

    top: -29,

    width: 78,

    height: 78,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: 'transparent',

    zIndex: 50,
  },

  // =====================================================
  // LEFT SHOULDER
  // =====================================================

  leftShoulder: {
    position: 'absolute',

    width: 28,

    height: 28,

    left: -17,

    bottom: 10,

    backgroundColor: COLORS.deepBrown,

    borderTopRightRadius: 28,

    zIndex: 1,
  },

  // =====================================================
  // RIGHT SHOULDER
  // =====================================================

  rightShoulder: {
    position: 'absolute',

    width: 28,

    height: 28,

    right: -17,

    bottom: 10,

    backgroundColor: COLORS.deepBrown,

    borderTopLeftRadius: 28,

    zIndex: 1,
  },

  // =====================================================
  // CENTER BUTTON
  // =====================================================

  centerButton: {
    width: 62,

    height: 62,

    borderRadius: 31,

    backgroundColor: 'rgba(201, 162, 39, 0.96)',

    borderWidth: 2,

    borderColor: 'rgba(232, 197, 90, 0.8)',

    alignItems: 'center',

    justifyContent: 'center',

    zIndex: 100,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.25,

    shadowRadius: 8,

    elevation: 15,
  },

  centerButtonActive: {
    backgroundColor: 'rgba(232, 197, 90, 0.98)',

    borderColor: COLORS.gold,
  },

  // =====================================================
  // CENTER LABEL
  // =====================================================

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
