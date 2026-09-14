import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function QuestionSevaSection() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
        ❓ Question Seva
      </Text>
      <Pressable onPress={() => router.push('/home/question-seva')}>
        <Image
          source={require('@/assets/images/qusetionbanner.jpg')}
          contentFit="cover"
          style={styles.banner}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
  },
  banner: {
    width: '100%',
    aspectRatio: 1 / 1,
    borderRadius: 20,
  },
});
