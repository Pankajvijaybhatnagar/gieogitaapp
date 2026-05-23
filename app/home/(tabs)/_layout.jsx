import { Tabs, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSelector } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// ─── GIEO GITA COLOR PALETTE ─────────────────────────────────────────────────
const COLORS = {
  deepBrown: '#2C1A0A',
  warmBrown: '#4A2C0D',
  richBrown: '#3D2010',
  gold: '#C9A227',
  goldLight: '#E8C55A',
  goldDark: '#8B6914',
  cream: '#FDF6E3',
  saffron: '#E8721C',
  saffronLight: '#F4A44A',
};

// ─── TAB CONFIG ───────────────────────────────────────────────────────────────
const TAB_CONFIG = {
  index:   { label: 'Home',    icon: 'home',     iconFocused: 'home'     },
  chants:  { label: 'Chants',  icon: 'music',    iconFocused: 'music'    },
  reading: { label: 'Reading', icon: 'book',     iconFocused: 'book'     },
  profile: { label: 'Profile', icon: 'user',     iconFocused: 'user'     },
};

// ─── CUSTOM TAB BAR ───────────────────────────────────────────────────────────
function GieoTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBar}>
      {/* Top gold border line */}
      <View style={styles.tabBarTopBorder} />

      <View style={styles.tabBarInner}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const config = TAB_CONFIG[route.name] || {
            label: route.name,
            icon: 'circle',
            iconFocused: 'circle',
          };

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.75}
              style={styles.tabItem}
            >
              {/* Active indicator pill behind icon */}
              {isFocused && <View style={styles.activePill} />}

              {/* Icon */}
              <View style={styles.iconWrap}>
                <FontAwesome
                  name={isFocused ? config.iconFocused : config.icon}
                  size={20}
                  color={isFocused ? COLORS.goldLight : COLORS.goldDark}
                />
                {/* Active dot under icon */}
                {isFocused && <View style={styles.activeDot} />}
              </View>

              {/* Label */}
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── CUSTOM HEADER ────────────────────────────────────────────────────────────
function GieoHeader({ title }) {
  return (
   <></>
  );
}

// ─── TAB LAYOUT ───────────────────────────────────────────────────────────────
export default function TabLayout() {
  const router = useRouter();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [isMounted, setIsMounted] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoggedIn) {
      router.replace('/login');
    }
  }, [isMounted, isLoggedIn]);

  if (!isMounted || !isLoggedIn) {
    return null;
  }

  return (
    <Tabs
      tabBar={(props) => <GieoTabBar {...props} />}
      screenOptions={{
        headerShown: true,
        header: ({ options, route }) => (
          <GieoHeader title={options.title || route.name} />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home' }}
      />
      <Tabs.Screen
        name="chants"
        options={{ title: 'Chants' }}
      />
      <Tabs.Screen
        name="reading"
        options={{ title: 'Reading' }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          presentation: 'transparentModal',
          animation: 'fade',
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  // ── CUSTOM HEADER ───────────────────────────────────────────────
  header: {
    backgroundColor: COLORS.deepBrown,
    paddingTop: Platform.OS === 'ios' ? 52 : 36,
    paddingHorizontal: 16,
    paddingBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  headerPattern: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(201,162,39,0.04)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  logoCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.warmBrown,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircleIcon: { fontSize: 16 },
  logoMain: {
    color: COLORS.goldLight,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  logoSub: {
    color: COLORS.goldDark,
    fontSize: 9,
    letterSpacing: 0.8,
    marginTop: 1,
  },
  headerTitle: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    flex: 1,
    textAlign: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(201,162,39,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBottomLine: {
    height: 1,
    backgroundColor: COLORS.gold,
    opacity: 0.25,
    marginTop: 10,
  },

  // ── CUSTOM TAB BAR ──────────────────────────────────────────────
  tabBar: {
    backgroundColor: COLORS.deepBrown,
    paddingBottom: Platform.OS === 'ios' ? 24 : 6,
    position: 'relative',
  },
  tabBarTopBorder: {
    height: 1,
    backgroundColor: COLORS.gold,
    opacity: 0.3,
  },
  tabBarInner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 4,
    position: 'relative',
    minHeight: 52,
  },
  activePill: {
    position: 'absolute',
    top: 0,
    left: '15%',
    right: '15%',
    height: '100%',
    backgroundColor: 'rgba(201,162,39,0.12)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.2)',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    position: 'relative',
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
});