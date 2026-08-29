import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const DonationListFooter = ({ loading, hasMore, hasDonations }) => {
  if (!hasDonations) {
    return null;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#7A4527" />

        <Text style={styles.loadingText}>Loading more donations...</Text>
      </View>
    );
  }

  if (!hasMore) {
    return (
      <View style={styles.endContainer}>
        <View style={styles.line} />

        <Text style={styles.endText}>No more donations</Text>

        <View style={styles.line} />
      </View>
    );
  }

  return <View style={styles.spacing} />;
};

export default DonationListFooter;

const styles = StyleSheet.create({
  loadingContainer: {
    paddingVertical: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 8,
    color: '#896C58',
    fontSize: 11,
  },

  endContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 28,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8D8CA',
  },

  endText: {
    color: '#9D7F69',
    fontSize: 11,
    paddingHorizontal: 12,
    fontWeight: '500',
  },

  spacing: {
    height: 20,
  },
});
