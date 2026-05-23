import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { C } from './constants';

export default function PulsingRing({ size, delay = 0, color = C.gold }) {
  const scale   = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value   = withDelay(delay, withRepeat(withTiming(1.25, { duration: 1600 }), -1, true));
    opacity.value = withDelay(delay, withRepeat(withTiming(0.1,  { duration: 1600 }), -1, true));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity:   opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position:     'absolute',
          width:        size,
          height:       size,
          borderRadius: size / 2,
          borderWidth:  1.5,
          borderColor:  color,
        },
        animStyle,
      ]}
    />
  );
}