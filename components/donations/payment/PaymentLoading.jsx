import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function PaymentLoading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color="#704025" />

      <Text style={styles.text}>Connecting to secure payment gateway...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,

    zIndex: 10,

    backgroundColor: '#FFF9F3',

    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    marginTop: 11,
    fontSize: 11,
    color: '#856D5B',
  },
});
