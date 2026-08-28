import { Animated, Image, Text, TouchableOpacity, View } from 'react-native';

import { router } from 'expo-router';
import { styles } from './TransformInNineStepsStyles';

export default function TransformInNineStepsCard({
  item,
  index,
  scrollX,
  snapInterval,
  cardWidth,
}) {
  const inputRange = [
    (index - 1) * snapInterval,
    index * snapInterval,
    (index + 1) * snapInterval,
  ];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.86, 1, 0.86],
    extrapolate: 'clamp',
  });

  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [34, 0, 34],
    extrapolate: 'clamp',
  });

  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: [-10, 0, 10],
    extrapolate: 'clamp',
  });

  const rotate = scrollX.interpolate({
    inputRange,
    outputRange: ['-4deg', '0deg', '4deg'],
    extrapolate: 'clamp',
  });

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.55, 1, 0.55],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          width: cardWidth,
          opacity,
          transform: [
            {
              translateX,
            },
            {
              translateY,
            },
            {
              scale,
            },
            {
              rotate,
            },
          ],
        },
      ]}>
      <TouchableOpacity
        activeOpacity={0.92}
        style={styles.courseCard}
        onPress={() => {
          if (item.slug) {
            router.push(`/home/transform-your-life-in-9-steps/${item.slug}`);
          }
        }}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: item.image,
            }}
            style={styles.courseImage}
            resizeMode="cover"
          />

          <View style={styles.imageOverlay} />

          <View style={styles.stepBadge}>
            <Text style={styles.stepText}>{item.step}</Text>
          </View>

          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.goldLine} />

          <Text style={styles.courseTitle} numberOfLines={2}>
            {item.title}
          </Text>

          <Text style={styles.courseDescription} numberOfLines={4}>
            {item.description}
          </Text>

          <View style={styles.cardFooter}>
            <View style={styles.guideSection}>
              <Text style={styles.guideLabel}>GUIDED BY</Text>

              <Text style={styles.guideName}>Gita Manishi</Text>
            </View>

            <View style={styles.arrowCircle}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
