import { Ionicons } from '@expo/vector-icons';
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const COLORS = {
  deepBrown: '#2C1A0A',
  warmBrown: '#4A2C0D',
  gold: '#C9A227',
  goldLight: '#E8C55A',
  cream: '#FDF6E3',
  white: '#FFFFFF',
};

export default function AppOverlay({
  visible = false,

  // loading | alert | success | error | warning
  type = 'loading',

  title,
  message,

  buttonText = 'OK',
  onClose,

  // Optional: hide button for loading
  showButton = true,

  // Optional custom icon
  icon,
}) {
  if (!visible) {
    return null;
  }

  const isLoading = type === 'loading';

  const getIcon = () => {
    if (icon) {
      return icon;
    }

    switch (type) {
      case 'success':
        return 'checkmark-circle';

      case 'error':
        return 'close-circle';

      case 'warning':
        return 'warning';

      case 'alert':
        return 'information-circle';

      default:
        return null;
    }
  };

  const iconName = getIcon();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          {/* ================================
              LOADING
          ================================= */}

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.gold} />

              {title ? <Text style={styles.title}>{title}</Text> : null}

              {message ? <Text style={styles.message}>{message}</Text> : null}
            </View>
          ) : (
            <>
              {/* ================================
                  ICON
              ================================= */}

              {iconName ? (
                <View style={styles.iconContainer}>
                  <Ionicons name={iconName} size={34} color={COLORS.gold} />
                </View>
              ) : null}

              {/* ================================
                  TITLE
              ================================= */}

              {title ? <Text style={styles.title}>{title}</Text> : null}

              {/* ================================
                  MESSAGE
              ================================= */}

              {message ? <Text style={styles.message}>{message}</Text> : null}

              {/* ================================
                  BUTTON
              ================================= */}

              {showButton ? (
                <TouchableOpacity
                  style={styles.button}
                  activeOpacity={0.85}
                  onPress={onClose}>
                  <Text style={styles.buttonText}>{buttonText}</Text>
                </TouchableOpacity>
              ) : null}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,

    backgroundColor: 'rgba(0, 0, 0, 0.48)',

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 24,
  },

  alertBox: {
    width: '100%',
    maxWidth: 360,

    backgroundColor: COLORS.cream,

    borderRadius: 24,

    paddingHorizontal: 24,
    paddingVertical: 26,

    alignItems: 'center',

    borderWidth: 1,
    borderColor: 'rgba(201, 162, 39, 0.35)',

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.28,
    shadowRadius: 16,

    elevation: 12,
  },

  iconContainer: {
    width: 64,
    height: 64,

    borderRadius: 32,

    backgroundColor: 'rgba(201, 162, 39, 0.14)',

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 14,
  },

  loadingContainer: {
    width: '100%',

    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    marginTop: 4,

    fontSize: 19,

    fontWeight: '700',

    color: COLORS.deepBrown,

    textAlign: 'center',
  },

  message: {
    marginTop: 9,

    fontSize: 13,

    lineHeight: 20,

    color: COLORS.warmBrown,

    textAlign: 'center',
  },

  button: {
    marginTop: 20,

    minWidth: 120,

    height: 44,

    paddingHorizontal: 24,

    borderRadius: 22,

    backgroundColor: COLORS.gold,

    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: COLORS.deepBrown,

    fontSize: 13,

    fontWeight: '700',
  },
});
