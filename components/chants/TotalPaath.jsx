import { useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { tcStyles } from '../../app/home/(tabs)/chants';

// ─────────────────────────────────────────────────────────────────────────────
// 1. GLOBAL PAATH COUNT  — animated count-up
// ─────────────────────────────────────────────────────────────────────────────
export function TotalPaath() {
  const GLOBAL_TOTAL = 23562558;
  const [displayed, setDisplayed] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    let current = 0;
    const stepTime = 40;
    const totalSteps = Math.ceil(2200 / stepTime);
    const increment = Math.ceil(GLOBAL_TOTAL / totalSteps);

    const timer = setInterval(() => {
      current += increment;
      if (current >= GLOBAL_TOTAL) {
        current = GLOBAL_TOTAL;
        clearInterval(timer);
      }
      setDisplayed(current);
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <Animated.View
      style={[
        tcStyles.wrapper,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}>
      <View style={tcStyles.bgCircle1} />
      <View style={tcStyles.bgCircle2} />
      <Text style={tcStyles.eyebrow}>🕉️ EK MIN EK SAATH — GLOBAL COUNT</Text>
      <Text style={tcStyles.label}>Total Gita Paath</Text>
      {/* <Link href={'/home/chanting'}>chanting</Link> */}
      <View style={tcStyles.countBox}>
        <Text style={tcStyles.countText}>{displayed.toLocaleString()}</Text>
      </View>
      <Text style={tcStyles.subText}>Verses recited together worldwide 🙏</Text>
    </Animated.View>
  );
}
