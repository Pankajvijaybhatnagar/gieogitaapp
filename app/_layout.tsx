
import store from '@/components/redux/store';
import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import { Provider } from "react-redux";

export default function RootLayout() {

  return (
    <AuthProvider>
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" />
        {/* <Stack.Screen name="login" /> */}
      </Stack>
    </Provider>
    </AuthProvider>
  );
}
