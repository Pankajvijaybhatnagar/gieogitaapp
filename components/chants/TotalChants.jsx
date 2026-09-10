import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { COLORS } from "@/constants/brandColors";
import { radii, shadow } from "@/constants/theme";

const TotalChants = () => {
  // Fetching number from Redux store
  const totalChantsFromStore = 23562558;
  const [totalChants, setTotalChants] = useState(0);

  // Animation value
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Trigger the fade-in animation when the component mounts
    Animated.timing(fadeAnim, {
      toValue: 1, // Final opacity
      duration: 1000, // Animation duration in ms
      useNativeDriver: true,
    }).start();

    // Increase the number gradually
    let start = 0;
    const end = totalChantsFromStore;
    const duration = 2000; // Total duration for counting up in ms
    const incrementTime = 50; // Time for each increment in ms
    const totalSteps = Math.ceil(duration / incrementTime); // Total steps for animation

    const increment = Math.ceil(end / totalSteps); // Increment value for each step
    const interval = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end; // Ensure it doesn't exceed
        clearInterval(interval);
      }
      setTotalChants(start);
    }, incrementTime);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [totalChantsFromStore]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.label}>Total Chants</Text>
      <View style={styles.chantsContainer}>
        <Text style={styles.chantsText}>
          {totalChants.toLocaleString()} {/* Ensuring number is within <Text> */}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 10
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.richBrown,
    marginBottom: 8
  },
  chantsContainer: {
    backgroundColor: COLORS.cream,
    borderColor: COLORS.richBrown,
    borderWidth: 2,
    borderRadius: radii.pill,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    ...shadow.card,
    minWidth: 200
  },
  chantsText: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.deepBrown
  }
});

export default TotalChants;
