import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const ITEM_HEIGHT = 48;
const VISIBLE_RANGE = 20;
const SWIPE_THRESHOLD = ITEM_HEIGHT * 0.35;

const ChantCounter = ({
  initialCount = 500,
  minCount = 0,
  maxCount = 999999,
  onChange,
}) => {
  const [count, setCount] = useState(initialCount);

  const translateY = useSharedValue(0);

  const updateCount = useCallback(
    newCount => {
      const safeCount = Math.max(minCount, Math.min(maxCount, newCount));

      setCount(safeCount);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (onChange) {
        onChange(safeCount);
      }
    },
    [minCount, maxCount, onChange],
  );

  const gesture = Gesture.Pan()
    .minDistance(2)
    .onUpdate(event => {
      translateY.value = event.translationY;
    })
    .onEnd(event => {
      const translation = translateY.value;
      const velocityY = event.velocityY;

      let movement = translation;

      if (Math.abs(translation) < ITEM_HEIGHT) {
        movement += velocityY * 0.08;
      }

      let steps = Math.round(Math.abs(movement) / ITEM_HEIGHT);

      if (Math.abs(translation) > SWIPE_THRESHOLD && steps === 0) {
        steps = 1;
      }

      if (steps > 0) {
        if (movement < 0) {
          runOnJS(updateCount)(count + steps);
        } else {
          runOnJS(updateCount)(count - steps);
        }
      }

      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 240,
        mass: 0.65,
        velocity: velocityY,
      });
    });

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.container}>
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>▲</Text>
        </View>

        <View style={styles.wheel}>
          {Array.from(
            { length: VISIBLE_RANGE * 2 + 1 },
            (_, index) => index - VISIBLE_RANGE,
          ).map(offset => (
            <CounterItem
              key={offset}
              value={count + offset}
              offset={offset}
              translateY={translateY}
              isCenter={offset === 0}
              minCount={minCount}
              maxCount={maxCount}
            />
          ))}
        </View>

        <View pointerEvents="none" style={styles.topFade} />

        <View pointerEvents="none" style={styles.bottomFade} />

        <View pointerEvents="none" style={styles.centerHighlight}>
          <View style={styles.centerLine} />
          <View style={styles.centerLine} />
        </View>

        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>▼</Text>
        </View>
      </View>
    </GestureDetector>
  );
};

const CounterItem = ({
  value,
  offset,
  translateY,
  isCenter,
  minCount,
  maxCount,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const position = offset * ITEM_HEIGHT + translateY.value;

    const distance = Math.abs(position);

    const scale = interpolate(
      distance,
      [0, ITEM_HEIGHT, ITEM_HEIGHT * 2, ITEM_HEIGHT * 3, ITEM_HEIGHT * 4],
      [1, 0.88, 0.72, 0.58, 0.45],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      distance,
      [0, ITEM_HEIGHT, ITEM_HEIGHT * 2, ITEM_HEIGHT * 3, ITEM_HEIGHT * 4],
      [1, 0.58, 0.3, 0.14, 0],
      Extrapolation.CLAMP,
    );

    const rotate = interpolate(
      position,
      [-ITEM_HEIGHT * 2, 0, ITEM_HEIGHT * 2],
      [-2, 0, 2],
      Extrapolation.CLAMP,
    );

    return {
      transform: [
        {
          translateY: position,
        },
        {
          scale,
        },
        {
          rotate: `${rotate}deg`,
        },
      ],
      opacity,
    };
  });

  const isDisabled = value < minCount || value > maxCount;

  return (
    <Animated.View style={[styles.item, animatedStyle]}>
      <Text
        style={[
          styles.number,
          isCenter && styles.centerNumber,
          isDisabled && styles.disabledNumber,
        ]}>
        {isDisabled ? '' : value}
      </Text>
    </Animated.View>
  );
};

export default ChantCounter;

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  wheel: {
    width: 110,
    height: ITEM_HEIGHT,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },

  item: {
    position: 'absolute',
    width: 110,
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  number: {
    fontSize: 16,
    fontWeight: '500',
    color: '#A88B68',
    includeFontPadding: false,
  },

  centerNumber: {
    fontSize: 23,
    fontWeight: '700',
    color: '#6B3518',
  },

  disabledNumber: {
    opacity: 0,
  },

  arrowContainer: {
    height: 30,
    width: 110,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },

  arrow: {
    fontSize: 10,
    color: '#8A5A32',
    opacity: 0.8,
  },

  centerHighlight: {
    position: 'absolute',
    left: 10,
    right: 10,
    top: 71,
    height: ITEM_HEIGHT,
    justifyContent: 'space-between',
    zIndex: 20,
  },

  centerLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#B97832',
  },

  topFade: {
    position: 'absolute',
    top: 25,
    left: 0,
    right: 0,
    height: 35,
    backgroundColor: 'rgba(255,255,255,0.35)',
    zIndex: 10,
  },

  bottomFade: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    height: 35,
    backgroundColor: 'rgba(255,255,255,0.35)',
    zIndex: 10,
  },
});
