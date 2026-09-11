import { DESIGN } from '@/constants/design';
import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { COLORS, RGB } from '@/constants/brandColors';
import {
  hairline,
  radii,
  shadow,
  spacing,
  type as typeScale,
} from '@/constants/theme';

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
              <ActivityIndicator size="large" color={COLORS.saffron} />

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
                    color={destructive ? COLORS.dangerRed : COLORS.saffron}
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
    paddingHorizontal: 24
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
    borderRadius: radii.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl - spacing.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: hairline,
    ...shadow.raised
  },
  /*
  |--------------------------------------------------------------------------
  | Icon
  |--------------------------------------------------------------------------
  */

  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: radii.pill,
    backgroundColor: `rgba(${RGB.saffron}, 0.12)`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md
  },
  destructiveIconContainer: {
    // A light tint behind the solid dangerRed icon, same "soft tint +
    // solid glyph" pairing as the default saffron icon container — the
    // previous solid dangerLight fill was itself reddish, so the dangerRed
    // icon on top barely showed up against it.
    backgroundColor: `rgba(${RGB.dangerRed}, 0.12)`
  },
  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  loadingContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  /*
  |--------------------------------------------------------------------------
  | Text
  |--------------------------------------------------------------------------
  */

  title: {
    marginTop: spacing.xs,
    ...typeScale.headline,
    fontSize: 19,
    color: COLORS.deepBrown,
    textAlign: 'center',
    fontFamily: DESIGN.fonts.editorial,
    fontWeight: "400",
    letterSpacing: -0.4
  },
  message: {
    marginTop: spacing.sm,
    ...typeScale.subhead,
    fontWeight: '400',
    lineHeight: 20,
    color: COLORS.warmBrown,
    textAlign: 'center'
  },
  /*
  |--------------------------------------------------------------------------
  | Buttons
  |--------------------------------------------------------------------------
  */

  buttonContainer: {
    width: '100%',
    alignItems: 'center'
  },
  confirmButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  /*
  |--------------------------------------------------------------------------
  | Primary button
  |--------------------------------------------------------------------------
  */

  button: {
    marginTop: spacing.lg,
    minWidth: 120,
    height: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    backgroundColor: COLORS.richBrown,
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirmPrimaryButton: {
    flex: 1,
    minWidth: 0,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md
  },
  buttonText: {
    color: COLORS.white,
    ...typeScale.subhead
  },
  /*
  |--------------------------------------------------------------------------
  | Secondary button
  |--------------------------------------------------------------------------
  */

  secondaryButton: {
    flex: 1,
    height: 44,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: COLORS.creamDark,
    borderWidth: 1,
    borderColor: hairline,
    alignItems: 'center',
    justifyContent: 'center'
  },
  secondaryButtonText: {
    color: COLORS.warmBrown,
    ...typeScale.subhead
  },
  /*
  |--------------------------------------------------------------------------
  | Destructive
  |--------------------------------------------------------------------------
  */

  dangerButton: {
    backgroundColor: COLORS.dangerRed
  },
  dangerButtonText: {
    color: COLORS.white
  },
  secondaryDangerButton: {
    // Same fix as the icon container — a light dangerRed tint instead of
    // the solid dangerLight fill, so the dangerRed label actually reads
    // against it instead of red-on-red.
    backgroundColor: `rgba(${RGB.dangerRed}, 0.1)`,
    borderColor: `rgba(${RGB.dangerRed}, 0.25)`
  },
  secondaryDangerText: {
    color: COLORS.dangerRed
  }
});
