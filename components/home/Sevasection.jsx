import { DESIGN } from '@/constants/design';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Card from '@/components/ui/Card';
import { radii, spacing, type } from '@/constants/theme';
import { COLORS } from './constant';
import { SectionHeader } from './Sharedui';

export default function SevaSection() {
  const router = useRouter();

  const handlePress = () => {
    router.push('/home/(tabs)/seva');

    // If you want to pass a type:
    // router.push('/home/(tabs)/seva?type=gau-seva');

    // Better Expo Router way:
    // router.push({
    //   pathname: '/home/(tabs)/seva',
    //   params: {
    //     type: 'gau-seva',
    //   },
    // });
  };

  return (
    <>
      <SectionHeader title="🙏 Choose Your" accent="Seva" />

      <TouchableOpacity
        activeOpacity={0.88}
        onPress={handlePress}
        style={styles.wrapper}>
        <Card radius={radii.xl} style={styles.sevaBg}>
          <View style={styles.sevaContent}>
            <Text style={styles.sevaLabel}>SUPPORT OUR MISSION</Text>

            <Text style={styles.sevaTitle}>
              Be Part Of <Text style={styles.sevaTitleAccent}>Gita Seva</Text>
            </Text>
          </View>

          <View style={styles.imageWrapper}>
            <Image
              source={require('@/assets/images/seva/fourseva.png')}
              style={styles.sevaImage}
              contentFit="cover"
              transition={250}
            />
          </View>

          <View style={styles.bottomButton}>
            <View>
              <Text style={styles.buttonSmallText}>CONTRIBUTE WITH LOVE</Text>

              <Text style={styles.buttonText}>Donate Now</Text>
            </View>

            <View style={styles.arrowCircle}>
              <Text style={styles.arrow}>›</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 24,
  },
  sevaBg: {
    backgroundColor: DESIGN.colors.surface,
    borderColor: DESIGN.colors.border,
    borderWidth: 1,
    borderRadius: 24,
    shadowOpacity: 0.045,
    elevation: 2,
  },
  sevaContent: {
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  sevaLabel: {
    ...type.caption,
    color: COLORS.saffron,
    marginBottom: 8,
    fontSize: 10,
    letterSpacing: 1.5,
  },
  sevaTitle: {
    ...type.title,
    fontSize: 28,
    color: COLORS.deepBrown,
    fontFamily: DESIGN.fonts.editorial,
    fontWeight: '400',
    letterSpacing: -0.4,
    lineHeight: 36,
  },
  sevaTitleAccent: {
    color: DESIGN.colors.plum,
  },
  imageWrapper: {
    overflow: 'hidden',
    marginTop: 20,
    marginHorizontal: 12,
    borderRadius: 16,
  },
  sevaImage: {
    width: '100%',
    aspectRatio: 9 / 9,
  },
  bottomButton: {
    margin: 12,
    marginTop: spacing.md,
    minHeight: 70,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: DESIGN.colors.plum,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonSmallText: {
    ...type.caption,
    fontSize: 10,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 2,
    letterSpacing: 1.1,
  },
  buttonText: {
    ...type.headline,
    fontSize: 16,
    color: COLORS.white,
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    color: COLORS.white,
    fontSize: 26,
    lineHeight: 28,
    fontWeight: '300',
  },
});
