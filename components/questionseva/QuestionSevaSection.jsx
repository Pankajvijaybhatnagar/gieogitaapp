import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { SectionHeader } from '@/components/home/Sharedui';

export default function QuestionSevaSection() {
  const router = useRouter();

  return (
    <>
      <SectionHeader
        title="Seek Divine"
        accent="Wisdom"
        icon="help-circle-outline"
      />

      <View style={styles.container}>
        <Pressable onPress={() => router.push('/home/question-seva')}>
          <Image
            source={require('@/assets/images/qusetionbanner.jpg')}
            contentFit="cover"
            style={styles.banner}
          />
        </Pressable>
      </View>
    </>
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
