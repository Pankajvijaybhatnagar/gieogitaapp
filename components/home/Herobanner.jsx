import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Image, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { DESIGN } from '@/constants/design';
import { RGB } from '@/constants/brandColors';
import { COLORS, heroImages } from './constant';

const AUTOPLAY_INTERVAL = 4200;

export default function HeroBanner() {
  const { width } = useWindowDimensions();
  const slideWidth = width - 8;
  const [activeSlide, setActiveSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  const scrollRef = useRef(null);
  const autoplayTimer = useRef(null);
  const activeSlideRef = useRef(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
    ]).start();
  }, []);

  const startAutoplay = useCallback(() => {
    if (autoplayTimer.current) clearInterval(autoplayTimer.current);

    if (heroImages.length <= 1) return;

    autoplayTimer.current = setInterval(() => {
      const next = (activeSlideRef.current + 1) % heroImages.length;

      scrollRef.current?.scrollTo({ x: next * (slideWidth + 12), animated: true });
      activeSlideRef.current = next;
      setActiveSlide(next);
    }, AUTOPLAY_INTERVAL);
  }, [slideWidth]);

  useEffect(() => {
    startAutoplay();

    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    };
  }, [startAutoplay]);

  const handleHeroScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (slideWidth + 12));

    activeSlideRef.current = index;
    setActiveSlide(index);

    // A manual swipe shouldn't get immediately overridden by autoplay.
    startAutoplay();
  };

  return (
    <Animated.View
      style={[
        styles.heroBanner,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        snapToInterval={slideWidth + 12}
        snapToAlignment="start"
        disableIntervalMomentum
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.heroSlider}
        decelerationRate="fast"
        onScrollBeginDrag={() => {
          if (autoplayTimer.current) clearInterval(autoplayTimer.current);
        }}
        onMomentumScrollEnd={handleHeroScroll}
      >
        {heroImages.map((item) => (
          <View key={item.id} style={[styles.heroSlideShadow, { width: slideWidth }]}>
            <View style={styles.heroSlide}>
              <Image source={item.source} style={styles.heroSlideImage} resizeMode="cover" />

              <LinearGradient
                pointerEvents="none"
                colors={['transparent', 'rgba(41,20,10,0.35)']}
                style={styles.heroSlideShade}
              />
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.sliderDots}>
        {heroImages.map((_, index) => (
          <View
            key={index}
            style={[styles.sliderDot, activeSlide === index && styles.sliderDotActive]}
          />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  heroBanner: {
    paddingTop: 18,
    paddingHorizontal: 4,
    paddingBottom: 6,
    backgroundColor: COLORS.cream
  },
  heroSlider: {
    paddingBottom: 10
  },
  // Shadow lives on this outer, unclipped layer — the inner `heroSlide`
  // needs `overflow: hidden` for its rounded corners, which would otherwise
  // suppress the shadow entirely.
  heroSlideShadow: {
    aspectRatio: 1.9,
    marginRight: 12,
    borderRadius: 24,
    shadowColor: COLORS.richBrown,
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 8
  },
  heroSlide: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: COLORS.creamDark,
    borderWidth: 1,
    borderColor: `rgba(${RGB.gold}, 0.35)`
  },
  heroSlideImage: {
    width: '100%',
    height: '100%'
  },
  heroSlideShade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '45%'
  },
  sliderDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12
  },
  sliderDot: {
    width: 5,
    height: 5,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: `rgba(${RGB.goldDark}, 0.3)`
  },
  sliderDotActive: {
    width: 20,
    backgroundColor: DESIGN.colors.plum
  }
});
