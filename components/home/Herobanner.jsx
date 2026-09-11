import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { DESIGN } from '@/constants/design';
import { RGB } from '@/constants/brandColors';
import { COLORS, heroImages } from './constant';

const AUTOPLAY_INTERVAL = 4200;
const GAP = 14;
const PEEK = 0.025; // how much of each neighbouring slide peeks in on either side

export default function HeroBanner() {
  const { width } = useWindowDimensions();
  const slideWidth = width * (1 - PEEK * 2);
  const sidePadding = (width - slideWidth) / 2;
  const itemSize = slideWidth + GAP;

  const [activeSlide, setActiveSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scrollX = useRef(new Animated.Value(0)).current;

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

      scrollRef.current?.scrollTo({ x: next * itemSize, animated: true });
      activeSlideRef.current = next;
      setActiveSlide(next);
    }, AUTOPLAY_INTERVAL);
  }, [itemSize]);

  useEffect(() => {
    startAutoplay();

    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    };
  }, [startAutoplay]);

  const handleHeroScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / itemSize);

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
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        snapToInterval={itemSize}
        snapToAlignment="start"
        disableIntervalMomentum
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: sidePadding, paddingBottom: 16 }}
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => {
          if (autoplayTimer.current) clearInterval(autoplayTimer.current);
        }}
        onMomentumScrollEnd={handleHeroScroll}
      >
        {heroImages.map((item, index) => {
          const inputRange = [(index - 1) * itemSize, index * itemSize, (index + 1) * itemSize];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.55, 1, 0.55],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={item.id}
              style={[
                styles.heroSlideShadow,
                {
                  width: slideWidth,
                  marginRight: index === heroImages.length - 1 ? 0 : GAP,
                  transform: [{ scale }],
                  opacity,
                },
              ]}
            >
              <View style={styles.heroSlide}>
                <Image source={item.source} style={styles.heroSlideImage} resizeMode="cover" />

                <LinearGradient
                  pointerEvents="none"
                  colors={['transparent', 'rgba(20,10,8,0.15)', 'rgba(20,10,8,0.78)']}
                  locations={[0, 0.45, 1]}
                  style={styles.heroSlideShade}
                />

                <View style={styles.heroSlideContent} pointerEvents="none">
                  {item.tag ? (
                    <View style={styles.heroTagPill}>
                      <Text style={styles.heroTagText}>{item.tag}</Text>
                    </View>
                  ) : null}

                  {item.title ? (
                    <Text style={styles.heroSlideTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                  ) : null}
                </View>
              </View>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>

      <View style={styles.sliderDots}>
        {heroImages.map((_, index) => {
          const inputRange = [(index - 1) * itemSize, index * itemSize, (index + 1) * itemSize];

          // Native driver can't animate `width` directly, so the pill grows
          // via a horizontal scale transform instead (8px base → ~22px).
          const dotScaleX = scrollX.interpolate({
            inputRange,
            outputRange: [1, 2.75, 1],
            extrapolate: 'clamp',
          });

          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.35, 1, 0.35],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.sliderDot,
                {
                  opacity: dotOpacity,
                  transform: [{ scaleX: dotScaleX }],
                  backgroundColor: activeSlide === index ? DESIGN.colors.plum : `rgba(${RGB.goldDark}, 0.6)`,
                },
              ]}
            />
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  heroBanner: {
    paddingTop: 32,
    paddingBottom: 6,
    backgroundColor: COLORS.cream
  },
  // Shadow lives on this outer, unclipped layer — the inner `heroSlide`
  // needs `overflow: hidden` for its rounded corners, which would otherwise
  // suppress the shadow entirely.
  heroSlideShadow: {
    aspectRatio: 1.72,
    borderRadius: 28,
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
    borderRadius: 28,
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
    height: '68%'
  },
  heroSlideContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 18,
  },
  heroTagPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 8,
  },
  heroTagText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: '#FFFFFF',
  },
  heroSlideTitle: {
    fontFamily: DESIGN.fonts.editorial,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '400',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  sliderDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
    gap: 6
  },
  sliderDot: {
    width: 8,
    height: 5,
    borderRadius: 4,
  }
});
