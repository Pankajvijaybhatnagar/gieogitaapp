import { useFonts } from 'expo-font';
import { Text } from 'react-native';

export default function GitaText({ style }) {
  const [fontsLoaded] = useFonts({
    'GreatVibes-Regular': require('@/assets/fonts/GreatVibes-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Text style={[{ fontFamily: 'GreatVibes-Regular' }, style]}>Gita</Text>
  );
}
