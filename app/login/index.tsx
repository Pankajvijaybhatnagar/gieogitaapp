import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LoginScreen } from '@/components';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';

export default function Index() {
  const router = useRouter();
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const [isMounted, setIsMounted] = useState(false); // Track if the component is mounted

  // Simulate component mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && isLoggedIn) {
      router.replace('/home'); // Redirect to the home page if logged in
    }
  }, [isMounted, isLoggedIn]);

  // Render nothing until the component is mounted and the login state is checked
  if (!isMounted) {
    return null; // Don't render anything until the component is fully mounted
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Render the LoginScreen if the user is not logged in */}
      {!isLoggedIn ? <LoginScreen /> : <Text>Redirecting...</Text>}
    </View>
  );
}
