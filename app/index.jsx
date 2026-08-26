import { useEffect, useRef } from 'react';

import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const COLORS = {
  deepBrown: '#24130D',
  brown: '#3A2115',
  warmBrown: '#5A3320',
  gold: '#D9AD62',
  lightGold: '#F1D39A',
  cream: '#FFF4DF',
  white: '#FFFFFF',
};

export default function GetStartedScreen() {
  const router = useRouter();

  // ---------------------------------------------------------
  // Animations
  // ---------------------------------------------------------

  const fadeIn = useRef(new Animated.Value(0)).current;
  const contentY = useRef(new Animated.Value(35)).current;

  const logoScale = useRef(new Animated.Value(0.82)).current;

  const glowScale = useRef(new Animated.Value(0.9)).current;
  const glowOpacity = useRef(new Animated.Value(0.35)).current;

  const maharajY = useRef(new Animated.Value(45)).current;
  const maharajOpacity = useRef(new Animated.Value(0)).current;

  const buttonScale = useRef(new Animated.Value(1)).current;

  const particle1 = useRef(new Animated.Value(0)).current;
  const particle2 = useRef(new Animated.Value(0)).current;
  const particle3 = useRef(new Animated.Value(0)).current;

  // ---------------------------------------------------------
  // Entrance animation
  // ---------------------------------------------------------

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.spring(contentY, {
        toValue: 0,
        damping: 16,
        stiffness: 75,
        mass: 0.8,
        useNativeDriver: true,
      }),

      Animated.spring(logoScale, {
        toValue: 1,
        damping: 12,
        stiffness: 90,
        useNativeDriver: true,
      }),

      Animated.timing(maharajOpacity, {
        toValue: 1,
        duration: 1300,
        delay: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.spring(maharajY, {
        toValue: 0,
        damping: 18,
        stiffness: 70,
        delay: 350,
        useNativeDriver: true,
      }),
    ]).start();

    // -------------------------------------------------------
    // Breathing divine glow
    // -------------------------------------------------------

    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(glowScale, {
            toValue: 1.08,
            duration: 2800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),

          Animated.timing(glowOpacity, {
            toValue: 0.58,
            duration: 2800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),

        Animated.parallel([
          Animated.timing(glowScale, {
            toValue: 0.9,
            duration: 2800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),

          Animated.timing(glowOpacity, {
            toValue: 0.32,
            duration: 2800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();

    // -------------------------------------------------------
    // Floating particles
    // -------------------------------------------------------

    const animateParticle = (value, delay, duration) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),

          Animated.timing(value, {
            toValue: -1,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),

          Animated.timing(value, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    animateParticle(particle1, 200, 3600);
    animateParticle(particle2, 800, 4200);
    animateParticle(particle3, 1200, 5000);
  }, []);

  // ---------------------------------------------------------
  // Button press animation
  // ---------------------------------------------------------

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      damping: 12,
      stiffness: 250,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      damping: 10,
      stiffness: 180,
      useNativeDriver: true,
    }).start();
  };

  const handleGetStarted = () => {
    router.replace('/home');
  };

  // ---------------------------------------------------------
  // Render
  // ---------------------------------------------------------

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* ---------------------------------------------------
          KRISHNA BACKGROUND
      --------------------------------------------------- */}

      <ImageBackground
        source={require('../assets/images/krishna-bg.jpg')}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover">
        {/* Dark spiritual overlay */}

        <LinearGradient
          colors={[
            'rgba(23,11,7,0.70)',
            'rgba(45,24,14,0.00)',
            'rgba(27,13,8,0.74)',
            'rgba(15,7,5,0.96)',
          ]}
          locations={[0, 0.35, 0.68, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Warm center light */}

        <LinearGradient
          colors={[
            'rgba(217,173,98,0.10)',
            'rgba(217,173,98,0.02)',
            'transparent',
          ]}
          style={styles.centerLight}
        />

        {/* Bottom darkness for Maharaj Ji */}

        <LinearGradient
          colors={['transparent', 'rgba(18,8,5,0.40)', 'rgba(13,6,4,0.96)']}
          locations={[0, 0.42, 1]}
          style={styles.bottomGradient}
        />
      </ImageBackground>

      {/* ---------------------------------------------------
          FLOATING PARTICLES
      --------------------------------------------------- */}

      <Animated.View
        style={[
          styles.particle,
          styles.particleOne,
          {
            opacity: fadeIn,
            transform: [
              {
                translateY: particle1.interpolate({
                  inputRange: [-1, 0],
                  outputRange: [-35, 35],
                }),
              },
            ],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.particle,
          styles.particleTwo,
          {
            opacity: fadeIn,
            transform: [
              {
                translateY: particle2.interpolate({
                  inputRange: [-1, 0],
                  outputRange: [-45, 45],
                }),
              },
            ],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.particle,
          styles.particleThree,
          {
            opacity: fadeIn,
            transform: [
              {
                translateY: particle3.interpolate({
                  inputRange: [-1, 0],
                  outputRange: [-30, 30],
                }),
              },
            ],
          },
        ]}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* -------------------------------------------------
            TOP BRANDING
        ------------------------------------------------- */}

        <Animated.View
          style={[
            styles.topSection,
            {
              opacity: fadeIn,
              transform: [
                {
                  scale: logoScale,
                },
              ],
            },
          ]}>
          {/* <View style={styles.omCircle}>
            <Text style={styles.om}>ॐ</Text>
          </View> */}

          <Text style={styles.brandName}>GIEO GITA</Text>

          {/* <View style={styles.goldLine} />

          <Text style={styles.brandTagline}>AWAKEN • TRANSFORM • SERVE</Text> */}
        </Animated.View>

        {/* -------------------------------------------------
            CENTER CONTENT
        ------------------------------------------------- */}

        <Animated.View
          style={[
            styles.centerContent,
            {
              opacity: fadeIn,
              transform: [
                {
                  translateY: contentY,
                },
              ],
            },
          ]}>
          {/* <Text style={styles.sanskrit}>श्रीमद्भगवद्गीता</Text>

          <Text style={styles.mainTitle}>ज्ञान की ओर</Text>

          <Text style={styles.mainTitleSecond}>एक दिव्य यात्रा</Text>

          <Text style={styles.description}>
            Discover the timeless wisdom of the Bhagavad Gita and bring peace,
            purpose and clarity into your life.
          </Text> */}

          {/* Decorative divider */}

          {/* <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />

            <Text style={styles.dividerSymbol}>✦</Text>

            <View style={styles.dividerLine} />
          </View> */}
        </Animated.View>

        {/* -------------------------------------------------
            MAHARAJ JI SECTION
        ------------------------------------------------- */}

        <Animated.View
          style={[
            styles.maharajSection,
            {
              opacity: maharajOpacity,
              transform: [
                {
                  translateY: maharajY,
                },
              ],
            },
          ]}>
          {/* Divine glow */}

          <Animated.View
            style={[
              styles.divineGlow,
              {
                opacity: glowOpacity,
                transform: [
                  {
                    scale: glowScale,
                  },
                ],
              },
            ]}
          />

          {/* Portrait */}

          <Image
            source={require('../assets/images/maharaj-ji.png')}
            style={styles.maharajImage}
            resizeMode="contain"
          />

          {/* Glass name plate */}

          <View style={styles.namePlateWrapper}>
            <BlurView intensity={35} tint="dark" style={styles.namePlate}>
              <Text style={styles.maharajPrefix}>GITA MANISHI</Text>

              <Text style={styles.maharajName}>
                Swami Shri Gyananand Ji Maharaj
              </Text>

              {/* <Text style={styles.maharajSub}>परम पूज्य गुरुदेव</Text> */}
            </BlurView>
          </View>
        </Animated.View>

        {/* -------------------------------------------------
            BOTTOM CTA
        ------------------------------------------------- */}

        <Animated.View
          style={[
            styles.bottomSection,
            {
              opacity: fadeIn,
            },
          ]}>
          <Animated.View
            style={{
              transform: [
                {
                  scale: buttonScale,
                },
              ],
            }}>
            <Pressable
              onPress={handleGetStarted}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={styles.buttonOuter}>
              <LinearGradient
                colors={['#E7C27C', '#C99A4E', '#A87535']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.button}>
                <Text style={styles.buttonText}>GET STARTED</Text>

                <View style={styles.buttonArrow}>
                  <Text style={styles.arrow}>→</Text>
                </View>
              </LinearGradient>
            </Pressable>
          </Animated.View>

          <Text style={styles.bottomText}>
            {/* Begin your journey with the wisdom of the Gita */}
          </Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.deepBrown,
  },

  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 18 : 0,
  },

  // ----------------------------------------------------------
  // Background effects
  // ----------------------------------------------------------

  centerLight: {
    position: 'absolute',
    width: width * 1.4,
    height: height * 0.75,
    top: height * 0.08,
    left: -width * 0.2,
    borderRadius: width,
  },

  bottomGradient: {
    ...StyleSheet.absoluteFillObject,
  },

  // ----------------------------------------------------------
  // Particles
  // ----------------------------------------------------------

  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: COLORS.lightGold,
    shadowColor: COLORS.gold,
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },

  particleOne: {
    top: height * 0.25,
    left: width * 0.15,
  },

  particleTwo: {
    top: height * 0.38,
    right: width * 0.13,
    width: 3,
    height: 3,
  },

  particleThree: {
    top: height * 0.52,
    left: width * 0.78,
    width: 5,
    height: 5,
  },

  // ----------------------------------------------------------
  // Branding
  // ----------------------------------------------------------

  topSection: {
    alignItems: 'center',
    paddingTop: 15,
  },

  omCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: 'rgba(231,194,124,0.55)',
    backgroundColor: 'rgba(36,19,13,0.40)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  om: {
    fontSize: 29,
    color: COLORS.lightGold,
    fontWeight: '500',
  },

  brandName: {
    marginTop: 10,
    fontSize: 18,
    letterSpacing: 5,
    color: COLORS.cream,
    fontWeight: '700',
  },

  goldLine: {
    marginTop: 8,
    width: 45,
    height: 1,
    backgroundColor: COLORS.gold,
  },

  brandTagline: {
    marginTop: 6,
    fontSize: 7.5,
    letterSpacing: 2.2,
    color: 'rgba(255,244,223,0.65)',
  },

  // ----------------------------------------------------------
  // Center content
  // ----------------------------------------------------------

  centerContent: {
    position: 'absolute',
    top: height * 0.25,
    left: 25,
    right: 25,
    alignItems: 'center',
  },

  sanskrit: {
    fontSize: 18,
    color: COLORS.lightGold,
    letterSpacing: 1,
    marginBottom: 12,
    fontWeight: '500',
  },

  mainTitle: {
    color: COLORS.cream,
    fontSize: 38,
    lineHeight: 46,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  mainTitleSecond: {
    color: COLORS.lightGold,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 1,
  },

  description: {
    marginTop: 17,
    maxWidth: 320,
    color: 'rgba(255,244,223,0.78)',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '400',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },

  dividerLine: {
    width: 55,
    height: 1,
    backgroundColor: 'rgba(217,173,98,0.45)',
  },

  dividerSymbol: {
    marginHorizontal: 12,
    color: COLORS.gold,
    fontSize: 10,
  },

  // ----------------------------------------------------------
  // Maharaj Ji
  // ----------------------------------------------------------

  maharajSection: {
    position: 'absolute',
    bottom: height * 0.205,
    left: 0,
    right: 0,
    height: height * 0.32,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  divineGlow: {
    position: 'absolute',
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: width,
    backgroundColor: 'rgba(221,176,91,0.22)',
    shadowColor: COLORS.gold,
    shadowOpacity: 0.7,
    shadowRadius: 50,
  },

  maharajImage: {
    width: width * 0.92,
    height: height * 0.35,
    zIndex: 2,
  },

  namePlateWrapper: {
    position: 'absolute',
    bottom: -20,
    zIndex: 5,
    overflow: 'hidden',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(231,194,124,0.32)',
  },

  namePlate: {
    minWidth: width * 0.74,
    paddingHorizontal: 20,
    paddingVertical: 9,
    alignItems: 'center',
    backgroundColor: 'rgba(31,16,10,0.55)',
  },

  maharajPrefix: {
    fontSize: 15,
    letterSpacing: 2,
    color: COLORS.cream,
    fontWeight: '700',
  },

  maharajName: {
    marginTop: 3,
    color: COLORS.cream,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },

  maharajSub: {
    marginTop: 2,
    color: 'rgba(255,244,223,0.68)',
    fontSize: 18,
  },

  // ----------------------------------------------------------
  // Bottom CTA
  // ----------------------------------------------------------

  bottomSection: {
    position: 'absolute',
    left: 22,
    right: 22,
    bottom: Platform.OS === 'ios' ? 50 : 50,
    alignItems: 'center',
  },

  buttonOuter: {
    width: width * 0.58,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },

  button: {
    height: 50,
    borderRadius: 50,
    paddingLeft: 24,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,244,223,0.35)',
  },

  buttonText: {
    color: '#2A160B',
    fontSize: 18,
    letterSpacing: 0,
    fontWeight: '800',
    marginLeft: 10,
  },

  buttonArrow: {
    width: 42,
    height: 42,
    borderRadius: 25,
    backgroundColor: 'rgba(43,22,10,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  arrow: {
    color: '#2A160B',
    fontSize: 34,
    fontWeight: '800',
    marginTop: -10,
  },

  bottomText: {
    marginTop: 10,
    fontSize: 9,
    color: 'rgba(255,244,223,0.55)',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
});
