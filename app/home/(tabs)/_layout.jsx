import { Tabs, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

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

// ─── TAB LAYOUT ───────────────────────────────────────────────────────────────
export default function TabLayout() {
  const router = useRouter();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const [isMounted, setIsMounted] = useState(false);

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
      tabBar={() => null} // ← SharedTabBar in home/_layout handles this
      screenOptions={{
        headerShown: false, // ← home/_layout drawer header handles this
        header: () => <></>,
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen
        name="chants"
        options={{ title: 'Chants', headerShown: false }}
      />
      <Tabs.Screen name="seva" options={{ title: 'Seva' }} />
      <Tabs.Screen name="reading" options={{ title: 'Reading2' }} />
      <Tabs.Screen
        name="profile"
        options={{
          // title: 'Profile',
          // presentation: 'transparentModal',
          animation: 'fade',
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
