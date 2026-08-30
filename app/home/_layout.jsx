import { FontAwesome } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Link, usePathname } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import CustomDrawerContent from '@/components/navigation/CustomDrawerContent';
import SharedTabBar from '@/components/navigation/SharedTabBar';

// ─────────────────────────────────────────────────────────────
// COLORS
// ─────────────────────────────────────────────────────────────
const COLORS = {
  deepBrown: '#2C1A0A',
  gold: '#C9A227',
  goldLight: '#E8C55A',
  goldDark: '#8B6914',
  saffron: '#E8721C',
};

// ─────────────────────────────────────────────────────────────
// HEADER TITLE
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// HOME LAYOUT
// ─────────────────────────────────────────────────────────────
export default function HomeLayout() {
  const pathname = usePathname();

  const isProfile = pathname.includes('/profile');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        barStyle={isProfile ? 'dark-content' : 'light-content'}
        backgroundColor={isProfile ? '#FFFFFF' : COLORS.deepBrown}
      />

      <View
        style={{
          flex: 1,
          backgroundColor: 'transparent',
        }}>
        {/* =====================================================
            DRAWER AREA
        ===================================================== */}
        <View style={{ flex: 1 }}>
          <Drawer
            drawerContent={props => <CustomDrawerContent {...props} />}

            screenOptions={({ navigation }) => ({
              headerShown: !isProfile,

              // =================================================
              // HEADER
              // =================================================
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

              // IMPORTANT:
              // Pass the component directly instead of creating
              // another anonymous component.
              headerTitle: HeaderTitle,

              // =================================================
              // LEFT MENU BUTTON
              // =================================================
              headerLeft: () => (
                <TouchableOpacity
                  style={headerStyles.menuBtn}
                  activeOpacity={0.8}
                  onPress={() => navigation.toggleDrawer()}>
                  <FontAwesome name="bars" size={17} color={COLORS.goldLight} />
                </TouchableOpacity>
              ),

              // =================================================
              // RIGHT SIDE
              // =================================================
              headerRight: () => (
                <View style={headerStyles.rightRow}>
                  {__DEV__ && (
                    <Link href="/_sitemap" style={{ color: '#FFFFFF' }}>
                      S
                    </Link>
                  )}

                  <TouchableOpacity
                    style={headerStyles.iconBtn}
                    activeOpacity={0.8}>
                    <FontAwesome
                      name="bell"
                      size={15}
                      color={COLORS.goldLight}
                    />

                    <View style={headerStyles.notifDot} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={headerStyles.iconBtn}
                    activeOpacity={0.8}>
                    <FontAwesome
                      name="search"
                      size={15}
                      color={COLORS.goldLight}
                    />
                  </TouchableOpacity>
                </View>
              ),

              // =================================================
              // DRAWER PANEL
              // =================================================
              drawerStyle: {
                backgroundColor: '#FDF6E3',
                width: 300,
              },

              drawerActiveTintColor: COLORS.goldLight,
              drawerInactiveTintColor: '#4A2C0D',
              drawerActiveBackgroundColor: 'rgba(201,162,39,0.1)',
            })}>
            {/* =================================================
                REGISTERED DRAWER SCREENS
            ================================================= */}

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

        {/* =====================================================
            TAB BAR
            ===================================================== */}
        <SharedTabBar />
      </View>
    </GestureHandlerRootView>
  );
}

// ─────────────────────────────────────────────────────────────
// HEADER STYLES
// ─────────────────────────────────────────────────────────────
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
