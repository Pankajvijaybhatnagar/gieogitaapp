import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { COLORS, RGB } from '@/constants/brandColors';
import { radii, spacing, type } from '@/constants/theme';

const IMAGES = [
  require('../../assets/ashtadash/3.jpg'),
  require('../../assets/ashtadash/4.jpg'),
  require('../../assets/ashtadash/5.jpg'),
  require('../../assets/ashtadash/6.jpg'),
  require('../../assets/ashtadash/7.jpg'),
  require('../../assets/ashtadash/8.jpg'),
  require('../../assets/ashtadash/9.jpg'),
  require('../../assets/ashtadash/10.jpg'),
];

export default function AshtaDashShalokiGita() {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);

  const itemWidth = width - 32;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length && viewableItems[0]?.index != null) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.wrapper}>
      <View style={styles.headingRow}>
        <View style={styles.icon}>
          <Ionicons name="book-outline" size={20} color={COLORS.goldDark} />
        </View>

        <View>
          <Text style={styles.eyebrow}>SACRED WISDOM</Text>

          <Text style={styles.title}>18 Shaloki Gita</Text>
        </View>
      </View>

      <FlatList
        horizontal
        pagingEnabled
        data={IMAGES}
        keyExtractor={(_, index) => String(index)}
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth}
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => (
          <View
            style={[
              styles.slide,
              {
                width: itemWidth,
              },
            ]}>
            <Image source={item} style={styles.image} contentFit="contain" />
          </View>
        )}
      />

      <View style={styles.pagination}>
        {IMAGES.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, activeIndex === index && styles.dotActive]}
          />
        ))}
      </View>

      <Text style={styles.pageText}>
        {activeIndex + 1} / {IMAGES.length}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: spacing.lg
  },
  headingRow: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm + 4,
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radii.md - 1,
    backgroundColor: `rgba(${RGB.gold}, 0.14)`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 2
  },
  eyebrow: {
    color: COLORS.goldDark,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.4
  },
  title: {
    ...type.title,
    fontSize: 20,
    color: COLORS.deepBrown,
    marginTop: 2
  },
  slide: {
    paddingHorizontal: spacing.md
  },
  image: {
    width: '100%',
    height: 460,
    backgroundColor: COLORS.cream,
    borderRadius: radii.xl - 2
  },
  pagination: {
    marginTop: spacing.sm + 5,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: `rgba(${RGB.gold}, 0.25)`
  },
  dotActive: {
    width: 21,
    backgroundColor: COLORS.gold
  },
  pageText: {
    textAlign: 'center',
    marginTop: spacing.sm - 1,
    color: COLORS.warmBrown,
    fontSize: 10,
    fontWeight: '700'
  }
});
