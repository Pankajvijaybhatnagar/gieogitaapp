import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, ScrollView, StyleSheet, View } from 'react-native';
import { COLORS, heroImages } from './constant';

const { width } = Dimensions.get('window');

export default function HeroBanner() {
  const [activeSlide, setActiveSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleHeroScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (width - 9));
    setActiveSlide(index);
  };

  return (
    <Animated.View
      style={[
        styles.heroBanner,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.heroSlider}
        decelerationRate="fast"
        onMomentumScrollEnd={handleHeroScroll}
      >
        {heroImages.map((item) => (
          <View key={item.id} style={styles.heroSlide}>
            <Image source={item.source} style={styles.heroSlideImage} resizeMode="cover" />
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
    paddingTop: 5,
    paddingBottom: 5,
  },
  heroSlider: {
    paddingBottom: 10,
  },
  heroSlide: {
    width: width - 9,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
  },
  heroSlideImage: {
    width: '100%',
    height: '100%',
  },
  sliderDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  sliderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: 'rgba(233, 151, 0, 0.45)',
  },
  sliderDotActive: {
    backgroundColor: COLORS.gold,
  },
});