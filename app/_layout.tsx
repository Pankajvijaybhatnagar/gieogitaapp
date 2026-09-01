// app/_layout.tsx

import store from '@/components/redux/store';
import { AppAlertProvider } from '@/context/AppAlertContext';
import { AuthProvider } from '@/context/AuthContext';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppAlertProvider>
        <Provider store={store}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen
              name="home"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="login2"
              options={{
                headerShown: false,
                presentation: 'transparentModal',
                animation: 'simple_push',
                contentStyle: {
                  backgroundColor: 'transparent',
                },
              }}
            />
          </Stack>
        </Provider>
      </AppAlertProvider>
    </AuthProvider>
  );
}
