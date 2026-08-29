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

const COLORS = {
  primary: '#6E3F1F',
  secondary: '#A8692D',
};

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
          <Ionicons name="book-outline" size={20} color={COLORS.secondary} />
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
    marginTop: 24,
  },

  headingRow: {
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#F1DFCE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  eyebrow: {
    color: COLORS.secondary,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.4,
  },

  title: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },

  slide: {
    paddingHorizontal: 16,
  },

  image: {
    width: '100%',
    height: 460,
    backgroundColor: '#FFF',
    borderRadius: 22,
  },

  pagination: {
    marginTop: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D9C7B7',
  },

  dotActive: {
    width: 21,
    backgroundColor: COLORS.secondary,
  },

  pageText: {
    textAlign: 'center',
    marginTop: 7,
    color: '#907765',
    fontSize: 10,
    fontWeight: '700',
  },
});
