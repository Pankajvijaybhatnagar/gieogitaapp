import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

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
    marginVertical: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#7B1B1B", // Dark red color for the label
    marginBottom: 8,
  },
  chantsContainer: {
    backgroundColor: "#FFF", // White background
    borderColor: "#7B1B1B", // Dark red border
    borderWidth: 2,
    borderRadius: 50, // Rounded edges
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000", // Shadow
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5, // Shadow for Android
    minWidth: 200,
  },
  chantsText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000", // Black color for the text
  },
});

export default TotalChants;
