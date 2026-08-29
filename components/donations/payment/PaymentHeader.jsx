import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function PaymentHeader({ onClose }) {
  return (
    <TouchableOpacity
      style={styles.glassButton}
      onPress={onClose}
      activeOpacity={0.75}>
      {/* Glass highlight */}
      <View style={styles.glassHighlight} />

      <Ionicons name="close" size={19} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  glassButton: {
    position: 'absolute',
    top: 14,
    right: 14,

    width: 40,
    height: 40,
    borderRadius: 20,

    alignItems: 'center',
    justifyContent: 'center',

    // Glass surface
    backgroundColor: 'rgba(35, 25, 20, 0.58)',

    // Glass edge
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.38)',

    // Android
    elevation: 8,

    // iOS
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    overflow: 'hidden',

    zIndex: 9999,
  },

  glassHighlight: {
    position: 'absolute',

    top: 2,
    left: 5,
    right: 5,

    height: 12,

    borderRadius: 20,

    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
});
