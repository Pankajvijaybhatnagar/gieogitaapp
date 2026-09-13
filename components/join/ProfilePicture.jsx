import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { COLORS } from '@/constants/brandColors';
import { radii } from '@/constants/theme';

export default function ProfilePicture({ profile }) {
  const pictureUri = profile?.pic;

  return (
    <View style={styles.avatarOuter}>
      <View style={styles.avatarInner}>
        {pictureUri ? (
          <Image
            source={{ uri: pictureUri }}
            style={styles.avatar}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <View style={styles.avatarFallback}>
            <Ionicons name="person" size={58} color={COLORS.warmBrown} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarOuter: {
    position: 'absolute',
    top: -63,
    width: 130,
    height: 130,
    borderRadius: radii.pill,
    padding: 5,
    backgroundColor: COLORS.creamDark,
  },
  avatarInner: {
    flex: 1,
    borderRadius: radii.pill,
    backgroundColor: COLORS.cream,
    padding: 3,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: radii.pill,
  },
  avatarFallback: {
    flex: 1,
    borderRadius: radii.pill,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
