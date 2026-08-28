import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
        <View style={styles.sevaBg}>
          <Text style={styles.sevaOverlayText}>॥</Text>

          <Text style={styles.sevaLabel}>SUPPORT OUR MISSION</Text>

          <Text style={styles.sevaTitle}>
            Be Part Of <Text style={styles.sevaTitleAccent}>Gita Seva</Text>
          </Text>

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
        </View>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 0,
  },

  sevaBg: {
    backgroundColor: COLORS.creamDark,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.45)',
    position: 'relative',
    overflow: 'hidden',
    paddingTop: 18,
  },

  sevaOverlayText: {
    position: 'absolute',
    right: 14,
    top: 5,
    fontSize: 72,
    color: 'rgba(201,162,39,0.1)',
    lineHeight: 80,
  },

  sevaLabel: {
    paddingHorizontal: 18,
    fontSize: 9,
    letterSpacing: 2,
    color: COLORS.saffron,
    fontWeight: '800',
    marginBottom: 4,
  },

  sevaTitle: {
    paddingHorizontal: 18,
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.deepBrown,
    marginBottom: 1,
  },

  sevaTitleAccent: {
    color: COLORS.goldDark,
  },

  imageWrapper: {
    width: '96%',
    overflow: 'hidden',
    marginHorizontal: 'auto',
  },

  sevaImage: {
    width: '100%',
    aspectRatio: 4 / 4,
  },

  bottomButton: {
    margin: 12,
    marginTop: 10,
    minHeight: 64,
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 11,
    backgroundColor: COLORS.deepBrown,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 15,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },

  buttonSmallText: {
    fontSize: 8,
    letterSpacing: 1.5,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 2,
  },

  buttonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF8EA',
  },

  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },

  arrow: {
    color: '#FFF8EA',
    fontSize: 29,
    lineHeight: 30,
    fontWeight: '300',
    marginTop: -2,
  },
});
