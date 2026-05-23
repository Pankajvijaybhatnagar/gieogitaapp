import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const YourChants = () => {
  // Getting data from Redux store
  const totalChants = useSelector(state => state.chants.totalChants);
  const monthProgress = useSelector(state => state.chants.monthProgress);
  const weekProgress = useSelector(state => state.chants.weekProgress);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Chants</Text>

      <View style={styles.chantsSection}>
        <View style={styles.totalChantsBox}>
          <Text style={styles.label}>Total Chants</Text>
          <Text style={styles.chantsNumber}>{totalChants}</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBox}>
            <Text style={styles.progressLabel}>Month Progress :</Text>
            <Text style={styles.progressNumber}>{monthProgress}</Text>
          </View>

          <View style={styles.progressBox}>
            <Text style={styles.progressLabel}>Week Progress :</Text>
            <Text style={styles.progressNumber}>{weekProgress}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chantsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    flex: 1,
    width: "100%",
    padding: 20,
  },
  totalChantsBox: {
    backgroundColor: "#fff",
    borderColor: "#7B1B1B", // Dark red border
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    // marginRight: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5, // Shadow for Android
  },
  chantsNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000", // Black color for the text
  },
  label: {
    fontSize: 13,
    color: "#000", // Label color
    marginBottom: 10,
  },
  progressContainer: {
    justifyContent: "space-between",
    // height: '100%',
  },
  progressBox: {
    backgroundColor: "#fff",
    borderColor: "#7B1B1B",
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5, // Shadow for Android
    flex: 1,
    flexDirection: "row",
  },
  progressLabel: {
    fontSize: 13,
    color: "#000", // Progress label color
  },
  progressNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});

export default YourChants;
