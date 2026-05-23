import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  PanResponder,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateChants,submitChants } from "../redux/chantsSlice"; // Import your Redux action

const ChantCounter = () => {
  const dispatch = useDispatch();
  const todayChants = useSelector((state) => state.chants.today); // Access today's chants from Redux store
  const [count, setCount] = useState(0); // Local state for counter

  // PanResponder to detect dragging for incrementing or decrementing count
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 10) {
          decrementCount();
        } else if (gestureState.dy < -10) {
          incrementCount();
        }
      },
    })
  ).current;

  const incrementCount = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const decrementCount = () => {
    if (count > 0) {
      setCount((prevCount) => prevCount - 1);
    }
  };

  const handleSubmit = () => {
    // Dispatch action to update Redux store with new chant count
    dispatch(submitChants(count));
  };

  return (
    <View style={styles.container}>
      {/* Counter Section */}
      <View style={styles.counterContainer}>
        <Text style={styles.label}>Today: {todayChants}</Text>
        <View style={styles.counterBox}>
          <View style={styles.counter} {...panResponder.panHandlers}>
            <Text style={styles.counterText}>{count}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={incrementCount} style={styles.button}>
              <Text style={styles.buttonText}>^</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={decrementCount} style={styles.button}>
              <Text style={styles.buttonText}>v</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.instructionsSection}>
        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>How to Submit Chants</Text>
          <Text style={styles.instructionsText}>
            1. Select the numbers you chant today.
          </Text>
          <Text style={styles.instructionsText}>
            2. Drag or press the up/down buttons to adjust the number.
          </Text>
          <Text style={styles.instructionsText}>
            3. Just press the Submit button.
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f7f7f7",
    flexDirection: "row",
  },
  counterContainer: {
    alignItems: "center",
    marginRight: 30,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: "#000",
  },
  counterBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  counter: {
    width: 80,
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#7B1B1B",
    borderRadius: 10,
    borderWidth: 3,
    elevation: 3,
  },
  counterText: {
    fontSize: 50,
    color: "#333",
    fontWeight: "bold",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 7,
  },
  button: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    marginVertical: 5,
    borderColor: "#b32d2d",
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 20,
    color: "#333",
  },
  instructionsSection: {
    flex: 1,
    justifyContent: "center",
  },
  instructionsContainer: {
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#b32d2d",
    marginBottom: 5,
  },
  instructionsText: {
    fontSize: 12,
    color: "#333",
    marginBottom: 5,
  },
  submitButton: {
    backgroundColor: "#b32d2d",

    borderRadius: 25,
    textAlign: "center",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 50,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default ChantCounter;
