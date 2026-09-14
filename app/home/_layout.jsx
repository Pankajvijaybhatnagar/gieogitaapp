import CustomDrawerContent from '@/components/navigation/CustomDrawerContent';
import HomeHeader from '@/components/navigation/HomeHeader';
import SharedTabBar from '@/components/navigation/SharedTabBar';
import { COLORS, RGB } from '@/constants/brandColors';
import { HeaderScrollProvider } from '@/context/HeaderScrollContext';
import { Drawer } from 'expo-router/drawer';
import { StatusBar, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function HomeLayout() {
  return (
    <GestureHandlerRootView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />
      <HeaderScrollProvider>
        <View style={styles.screen}>
          <Drawer
            drawerContent={props => <CustomDrawerContent {...props} />}
            screenOptions={{
              headerShown: true,
              header: props => <HomeHeader {...props} />,
              sceneStyle: { backgroundColor: COLORS.cream },
              drawerStyle: { backgroundColor: COLORS.cream, width: 304 },
              drawerActiveTintColor: COLORS.saffron,
              drawerInactiveTintColor: COLORS.warmBrown,
              drawerActiveBackgroundColor: `rgba(${RGB.saffron},0.12)`,
            }}>
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
              name="gallery"
              options={{
                drawerLabel: 'Gallery',
                title: 'Gallery',
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
});
