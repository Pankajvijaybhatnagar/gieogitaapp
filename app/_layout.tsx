
import { Provider } from "react-redux";
import store from '@/components/redux/store'
import { Stack } from "expo-router";

export default function RootLayout() {

  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" />
        {/* <Stack.Screen name="login" /> */}
      </Stack>
    </Provider>
  );
}
