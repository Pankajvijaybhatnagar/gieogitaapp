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

  danger: '#B42318',
  dangerLight: '#FDECEC',

  muted: '#7A6A58',
  border: 'rgba(201, 162, 39, 0.30)',
};

export default function AppOverlay({
  visible = false,

  // loading | alert | success | error | warning | confirm
  type = 'loading',

  title,
  message,

  // Primary button
  buttonText = 'OK',
  onClose,

  // Secondary button
  secondaryButtonText,
  onSecondaryPress,

  // Optional: hide buttons
  showButton = true,

  // Optional custom icon
  icon,

  // Optional destructive primary button
  destructive = false,
}) {
  if (!visible) {
    return null;
  }

  const isLoading = type === 'loading';

  const isConfirm = type === 'confirm' || Boolean(secondaryButtonText);

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

      case 'confirm':
        return 'help-circle';

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
          {/* ============================================================
              LOADING
          ============================================================ */}

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.gold} />

              {title ? <Text style={styles.title}>{title}</Text> : null}

              {message ? <Text style={styles.message}>{message}</Text> : null}
            </View>
          ) : (
            <>
              {/* ========================================================
                  ICON
              ======================================================== */}

              {iconName ? (
                <View
                  style={[
                    styles.iconContainer,
                    destructive && styles.destructiveIconContainer,
                  ]}>
                  <Ionicons
                    name={iconName}
                    size={34}
                    color={destructive ? COLORS.danger : COLORS.gold}
                  />
                </View>
              ) : null}

              {/* ========================================================
                  TITLE
              ======================================================== */}

              {title ? <Text style={styles.title}>{title}</Text> : null}

              {/* ========================================================
                  MESSAGE
              ======================================================== */}

              {message ? <Text style={styles.message}>{message}</Text> : null}

              {/* ========================================================
                  BUTTONS
              ======================================================== */}

              {showButton ? (
                <View
                  style={[
                    styles.buttonContainer,
                    isConfirm && styles.confirmButtonContainer,
                  ]}>
                  {/* ======================================================
                      SECONDARY BUTTON
                  ====================================================== */}

                  {isConfirm && secondaryButtonText ? (
                    <TouchableOpacity
                      style={[
                        styles.secondaryButton,
                        destructive && styles.secondaryDangerButton,
                      ]}
                      activeOpacity={0.8}
                      onPress={onSecondaryPress || onClose}>
                      <Text
                        style={[
                          styles.secondaryButtonText,
                          destructive && styles.secondaryDangerText,
                        ]}>
                        {secondaryButtonText}
                      </Text>
                    </TouchableOpacity>
                  ) : null}

                  {/* ======================================================
                      PRIMARY BUTTON
                  ====================================================== */}

                  <TouchableOpacity
                    style={[
                      styles.button,
                      isConfirm && styles.confirmPrimaryButton,
                      destructive && styles.dangerButton,
                    ]}
                    activeOpacity={0.85}
                    onPress={onClose}>
                    <Text
                      style={[
                        styles.buttonText,
                        destructive && styles.dangerButtonText,
                      ]}>
                      {buttonText}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  /*
  |--------------------------------------------------------------------------
  | Overlay
  |--------------------------------------------------------------------------
  */

  overlay: {
    flex: 1,

    backgroundColor: 'rgba(0, 0, 0, 0.48)',

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 24,
  },

  /*
  |--------------------------------------------------------------------------
  | Main box
  |--------------------------------------------------------------------------
  */

  alertBox: {
    width: '100%',
    maxWidth: 360,

    backgroundColor: COLORS.cream,

    borderRadius: 24,

    paddingHorizontal: 24,
    paddingVertical: 26,

    alignItems: 'center',

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.28,
    shadowRadius: 16,

    elevation: 12,
  },

  /*
  |--------------------------------------------------------------------------
  | Icon
  |--------------------------------------------------------------------------
  */

  iconContainer: {
    width: 64,
    height: 64,

    borderRadius: 32,

    backgroundColor: 'rgba(201, 162, 39, 0.14)',

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 14,
  },

  destructiveIconContainer: {
    backgroundColor: COLORS.dangerLight,
  },

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  loadingContainer: {
    width: '100%',

    alignItems: 'center',
    justifyContent: 'center',
  },

  /*
  |--------------------------------------------------------------------------
  | Text
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | Buttons
  |--------------------------------------------------------------------------
  */

  buttonContainer: {
    width: '100%',

    alignItems: 'center',
  },

  confirmButtonContainer: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 10,
  },

  /*
  |--------------------------------------------------------------------------
  | Primary button
  |--------------------------------------------------------------------------
  */

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

  confirmPrimaryButton: {
    flex: 1,

    minWidth: 0,

    marginTop: 20,

    paddingHorizontal: 14,
  },

  buttonText: {
    color: COLORS.deepBrown,

    fontSize: 13,

    fontWeight: '700',
  },

  /*
  |--------------------------------------------------------------------------
  | Secondary button
  |--------------------------------------------------------------------------
  */

  secondaryButton: {
    flex: 1,

    height: 44,

    marginTop: 20,

    paddingHorizontal: 14,

    borderRadius: 22,

    backgroundColor: '#F2EBDD',

    borderWidth: 1,

    borderColor: 'rgba(74, 44, 13, 0.12)',

    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: COLORS.warmBrown,

    fontSize: 13,

    fontWeight: '700',
  },

  /*
  |--------------------------------------------------------------------------
  | Destructive
  |--------------------------------------------------------------------------
  */

  dangerButton: {
    backgroundColor: COLORS.danger,
  },

  dangerButtonText: {
    color: COLORS.white,
  },

  secondaryDangerButton: {
    backgroundColor: '#F7E7E5',

    borderColor: 'rgba(180, 35, 24, 0.15)',
  },

  secondaryDangerText: {
    color: COLORS.danger,
  },
});
