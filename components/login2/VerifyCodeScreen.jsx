import { Ionicons } from '@expo/vector-icons';

import React, { useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const PRIMARY_BROWN = '#A55A12';

const OTP_LENGTH = 6;

export default function VerifyCodeScreen({
  email,
  mode = 'login',
  onBack,
  onVerify,
  onResendCode,
  loading = false,
  message = '',
  messageType = 'error',
}) {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));

  const [newPassword, setNewPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const inputRefs = useRef([]);

  const isForgot = mode === 'forgot';

  /*
  |--------------------------------------------------------------------------
  | ANIMATIONS
  |--------------------------------------------------------------------------
  */

  const opacity = useRef(new Animated.Value(0)).current;

  const translateY = useRef(new Animated.Value(25)).current;

  const iconScale = useRef(new Animated.Value(0.75)).current;

  const contentOpacity = useRef(new Animated.Value(0)).current;

  const contentTranslate = useRef(new Animated.Value(15)).current;

  const buttonScale = useRef(new Animated.Value(0.96)).current;

  const messageOpacity = useRef(new Animated.Value(0)).current;

  /*
  |--------------------------------------------------------------------------
  | ANIMATION START
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  |
  | Animated values start at 0.
  | There is no initial visible frame.
  |
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.spring(translateY, {
        toValue: 0,
        speed: 14,
        bounciness: 3,
        useNativeDriver: true,
      }),

      Animated.spring(iconScale, {
        toValue: 1,
        speed: 16,
        bounciness: 6,
        useNativeDriver: true,
      }),

      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 300,
        delay: 100,
        useNativeDriver: true,
      }),

      Animated.spring(contentTranslate, {
        toValue: 0,
        speed: 16,
        bounciness: 3,
        delay: 100,
        useNativeDriver: true,
      }),

      Animated.spring(buttonScale, {
        toValue: 1,
        speed: 16,
        bounciness: 3,
        delay: 180,
        useNativeDriver: true,
      }),
    ]).start();

    const focusTimer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 450);

    return () => clearTimeout(focusTimer);
  }, []);

  /*
  |--------------------------------------------------------------------------
  | MESSAGE ANIMATION
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!message) {
      messageOpacity.setValue(0);

      return;
    }

    messageOpacity.setValue(0);

    Animated.spring(messageOpacity, {
      toValue: 1,
      speed: 17,
      bounciness: 3,
      useNativeDriver: true,
    }).start();
  }, [message, messageOpacity]);

  /*
  |--------------------------------------------------------------------------
  | OTP INPUT
  |--------------------------------------------------------------------------
  */

  const handleChange = (value, index) => {
    /*
     * Keep numbers only.
     */

    const digits = String(value).replace(/[^0-9]/g, '');

    /*
     * ----------------------------------------------------------
     * PASTE SUPPORT
     * ----------------------------------------------------------
     *
     * If user pastes:
     *
     * 290470
     *
     * fill all six fields.
     */

    if (digits.length > 1) {
      const pastedDigits = digits.slice(0, OTP_LENGTH).split('');

      const nextOtp = Array(OTP_LENGTH).fill('');

      pastedDigits.forEach((digit, pastedIndex) => {
        nextOtp[pastedIndex] = digit;
      });

      setOtp(nextOtp);

      const focusIndex = Math.min(pastedDigits.length, OTP_LENGTH - 1);

      inputRefs.current[focusIndex]?.focus();

      return;
    }

    /*
     * Normal one-digit entry.
     */

    const nextOtp = [...otp];

    nextOtp[index] = digits.slice(-1);

    setOtp(nextOtp);

    /*
     * Move forward.
     */

    if (digits && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /*
  |--------------------------------------------------------------------------
  | BACKSPACE
  |--------------------------------------------------------------------------
  */

  const handleKeyPress = (event, index) => {
    const { nativeEvent } = event;

    if (nativeEvent.key === 'Backspace') {
      if (otp[index]) {
        const nextOtp = [...otp];

        nextOtp[index] = '';

        setOtp(nextOtp);

        return;
      }

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();

        const nextOtp = [...otp];

        nextOtp[index - 1] = '';

        setOtp(nextOtp);
      }
    }
  };

  /*
  |--------------------------------------------------------------------------
  | OTP CODE
  |--------------------------------------------------------------------------
  */

  const code = otp.join('');

  const otpComplete = code.length === OTP_LENGTH && /^\d{6}$/.test(code);

  /*
  |--------------------------------------------------------------------------
  | VERIFY
  |--------------------------------------------------------------------------
  */

  const handleVerify = () => {
    console.log('VERIFY SCREEN OTP:', code);

    console.log('VERIFY SCREEN OTP LENGTH:', code.length);

    if (!otpComplete) {
      return;
    }

    onVerify?.({
      email,
      code,
      newPassword: isForgot ? newPassword : '',
    });
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* BACK */}

        <Animated.View
          style={{
            opacity,
          }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            disabled={loading}>
            <Ionicons name="arrow-back" size={21} color="#333" />
          </TouchableOpacity>
        </Animated.View>

        {/* MAIN */}

        <Animated.View
          style={[
            styles.content,
            {
              opacity,
              transform: [
                {
                  translateY,
                },
              ],
            },
          ]}>
          {/* ICON */}

          <Animated.View
            style={[
              styles.iconCircle,
              {
                transform: [
                  {
                    scale: iconScale,
                  },
                ],
              },
            ]}>
            <Ionicons
              name={isForgot ? 'lock-open-outline' : 'shield-checkmark-outline'}
              size={27}
              color={PRIMARY_BROWN}
            />
          </Animated.View>

          {/* TITLE */}

          <Text style={styles.title}>
            {isForgot ? 'Reset Password' : 'Verify Code'}
          </Text>

          {/* DESCRIPTION */}

          <Text style={styles.subtitle}>Please enter the 6-digit code</Text>

          <Text style={styles.subtitle}>we just sent to</Text>

          <Text style={styles.emailText}>{email || 'example@email.com'}</Text>

          {/* FORM CONTENT */}

          <Animated.View
            style={[
              styles.formContent,
              {
                opacity: contentOpacity,
                transform: [
                  {
                    translateY: contentTranslate,
                  },
                ],
              },
            ]}>
            {/* SIX OTP BOXES */}

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <View key={index} style={styles.otpBoxOuter}>
                  <TextInput
                    ref={ref => {
                      inputRefs.current[index] = ref;
                    }}
                    value={digit}
                    onChangeText={value => handleChange(value, index)}
                    onKeyPress={event => handleKeyPress(event, index)}
                    keyboardType="number-pad"
                    maxLength={OTP_LENGTH}
                    textAlign="center"
                    editable={!loading}
                    selectionColor={PRIMARY_BROWN}
                    style={[styles.otpInput, digit && styles.otpInputActive]}
                  />
                </View>
              ))}
            </View>

            {/* FORGOT PASSWORD */}

            {isForgot && (
              <View>
                <Text style={[styles.label, styles.passwordLabel]}>
                  New Password
                </Text>

                <View style={styles.passwordWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={17}
                    color="#999"
                    style={styles.passwordIcon}
                  />

                  <TextInput
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="****************"
                    placeholderTextColor="#A6A6A6"
                    secureTextEntry={!showPassword}
                    editable={!loading}
                    style={styles.passwordInput}
                  />

                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(prev => !prev)}
                    disabled={loading}>
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={21}
                      color="#444"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* RESEND */}

            <View style={styles.resendContainer}>
              <Text style={styles.resendQuestion}>Didn't receive OTP?</Text>

              <TouchableOpacity onPress={onResendCode} disabled={loading}>
                <Text style={styles.resendText}>Resend code</Text>
              </TouchableOpacity>
            </View>

            {/* MESSAGE */}

            {message ? (
              <Animated.View
                style={[
                  styles.messageBox,
                  {
                    opacity: messageOpacity,
                  },
                ]}>
                <Ionicons
                  name={
                    messageType === 'success'
                      ? 'checkmark-circle-outline'
                      : 'alert-circle-outline'
                  }
                  size={17}
                  color={messageType === 'success' ? '#15803D' : '#DC2626'}
                />

                <Text
                  style={[
                    styles.message,
                    {
                      color: messageType === 'success' ? '#15803D' : '#DC2626',
                    },
                  ]}>
                  {message}
                </Text>
              </Animated.View>
            ) : null}

            {/* BUTTON */}

            <Animated.View
              style={{
                transform: [
                  {
                    scale: buttonScale,
                  },
                ],
              }}>
              <TouchableOpacity
                style={[
                  styles.verifyButton,
                  !otpComplete && styles.verifyButtonInactive,
                  loading && styles.disabledButton,
                ]}
                onPress={handleVerify}
                disabled={loading || !otpComplete}
                activeOpacity={0.88}>
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.verifyButtonText}>
                      {isForgot ? 'Update Password' : 'Verify'}
                    </Text>

                    <Ionicons
                      name="arrow-forward"
                      size={18}
                      color="#FFFFFF"
                      style={styles.buttonIcon}
                    />
                  </>
                )}
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </Animated.View>

        {/* HOME INDICATOR */}

        <View style={styles.homeIndicator} />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  keyboard: {
    flex: 1,
  },

  backButton: {
    position: 'absolute',
    top: 56,
    left: 23,
    width: 39,
    height: 39,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E9E9E9',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 94,
  },

  iconCircle: {
    alignSelf: 'center',
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FBF1E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  title: {
    fontSize: 25,
    fontWeight: '700',
    color: '#171717',
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: 10.8,
    color: '#929292',
    lineHeight: 16,
  },

  emailText: {
    marginTop: 4,
    textAlign: 'center',
    color: '#795D3D',
    fontSize: 11,
    fontWeight: '700',
  },

  formContent: {
    width: '100%',
  },

  /*
   * SIX BOXES
   */

  otpContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 29,
  },

  otpBoxOuter: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  otpInput: {
    width: 46,
    height: 49,
    borderRadius: 12,
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#ECECEC',
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },

  otpInputActive: {
    borderColor: PRIMARY_BROWN,
    backgroundColor: '#FCF6F0',
    shadowColor: PRIMARY_BROWN,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },

  label: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 8,
    fontWeight: '600',
  },

  passwordLabel: {
    marginTop: 24,
  },

  passwordWrapper: {
    width: '100%',
    height: 49,
    borderRadius: 13,
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    flexDirection: 'row',
    alignItems: 'center',
  },

  passwordIcon: {
    marginLeft: 14,
  },

  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    fontSize: 12,
    color: '#333333',
  },

  eyeButton: {
    width: 44,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  resendContainer: {
    alignItems: 'center',
    marginTop: 25,
  },

  resendQuestion: {
    fontSize: 10.5,
    color: '#929292',
  },

  resendText: {
    marginTop: 4,
    color: '#333333',
    fontSize: 11,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },

  messageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 13,
  },

  message: {
    fontSize: 10.5,
    marginLeft: 5,
    textAlign: 'center',
    flex: 1,
  },

  verifyButton: {
    marginTop: 22,
    height: 50,
    borderRadius: 25,
    backgroundColor: PRIMARY_BROWN,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 5,
  },

  verifyButtonInactive: {
    opacity: 0.45,
  },

  disabledButton: {
    opacity: 0.68,
  },

  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  buttonIcon: {
    marginLeft: 9,
  },

  homeIndicator: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    width: 135,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#111111',
  },
});
