import { DESIGN } from '@/constants/design';
import { Ionicons } from '@expo/vector-icons';

import React, { useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { COLORS } from '@/constants/brandColors';
import { hairline, radii } from '@/constants/theme';

const PRIMARY_BROWN = COLORS.richBrown;

const DARK_BROWN = COLORS.richBrown;

export default function ForgotPasswordScreen({
  onBack,
  onSubmit,
  loading = false,
  message = '',
  messageType = 'error',
}) {
  const [email, setEmail] = useState('');

  /*
  |--------------------------------------------------------------------------
  | ANIMATION
  |--------------------------------------------------------------------------
  */

  const opacity = useRef(new Animated.Value(0)).current;

  const translateY = useRef(new Animated.Value(35)).current;

  const iconScale = useRef(new Animated.Value(0.7)).current;

  const formOpacity = useRef(new Animated.Value(0)).current;

  const buttonScale = useRef(new Animated.Value(0.94)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.spring(translateY, {
        toValue: 0,
        speed: 14,
        bounciness: 4,
        useNativeDriver: true,
      }),

      Animated.spring(iconScale, {
        toValue: 1,
        speed: 16,
        bounciness: 8,
        useNativeDriver: true,
      }),

      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 400,
        delay: 180,
        useNativeDriver: true,
      }),

      Animated.spring(buttonScale, {
        toValue: 1,
        speed: 16,
        bounciness: 4,
        delay: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSubmit = () => {
    onSubmit?.(email.trim());
  };

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
            <Ionicons name="arrow-back" size={21} color={COLORS.deepBrown} />
          </TouchableOpacity>
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}>
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
              name="lock-open-outline"
              size={25}
              color={PRIMARY_BROWN}
            />
          </Animated.View>

          <Text style={styles.title}>Forgot Password?</Text>

          <Text style={styles.subtitle}>Enter your email address and</Text>

          <Text style={styles.subtitle}>
            we&apos;ll send you a verification code.
          </Text>

          <Animated.View
            style={{
              opacity: formOpacity,
            }}>
            {/* EMAIL */}

            <Text style={[styles.label, styles.emailLabel]}>Email</Text>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={17}
                color={COLORS.warmBrown}
                style={styles.inputIcon}
              />

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="example@gmail.com"
                placeholderTextColor={COLORS.warmBrown}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
                style={styles.input}
              />
            </View>

            {/* MESSAGE */}

            {message ? (
              <View style={styles.messageBox}>
                <Ionicons
                  name={
                    messageType === 'success'
                      ? 'checkmark-circle-outline'
                      : 'alert-circle-outline'
                  }
                  size={17}
                  color={messageType === 'success' ? '#15803D' : COLORS.dangerRed}
                />

                <Text
                  style={[
                    styles.message,
                    {
                      color: messageType === 'success' ? '#15803D' : COLORS.dangerRed,
                    },
                  ]}>
                  {message}
                </Text>
              </View>
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
                style={[styles.primaryButton, loading && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>Send Reset OTP</Text>

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

            {/* BACK */}

            <TouchableOpacity
              onPress={onBack}
              disabled={loading}
              style={styles.loginBackButton}>
              <Text style={styles.loginBackText}>Back to Login</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
        </ScrollView>

        <View style={styles.homeIndicator} />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.cream
  },
  keyboard: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40
  },
  backButton: {
    position: 'absolute',
    top: 56,
    left: 23,
    width: 39,
    height: 39,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: hairline,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 100
  },
  iconCircle: {
    alignSelf: 'center',
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 17
  },
  title: {
    fontSize: 25,
    fontWeight: "400",
    color: COLORS.deepBrown,
    textAlign: 'center',
    fontFamily: DESIGN.fonts.editorial,
    letterSpacing: -0.4
  },
  subtitle: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.warmBrown,
    lineHeight: 18
  },
  label: {
    fontSize: 12,
    color: COLORS.deepBrown,
    marginBottom: 8,
    fontWeight: '600'
  },
  emailLabel: {
    marginTop: 32
  },
  inputWrapper: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.creamDark,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: hairline
  },
  inputIcon: {
    marginLeft: 14
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    fontSize: 15,
    color: COLORS.deepBrown
  },
  messageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14
  },
  message: {
    fontSize: 12,
    marginLeft: 5,
    textAlign: 'center',
    flex: 1
  },
  primaryButton: {
    marginTop: 23,
    borderRadius: 16,
    backgroundColor: PRIMARY_BROWN,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    minHeight: 52
  },
  disabledButton: {
    opacity: 0.68
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700'
  },
  buttonIcon: {
    marginLeft: 9
  },
  loginBackButton: {
    alignSelf: 'center',
    marginTop: 24
  },
  loginBackText: {
    color: DARK_BROWN,
    fontSize: 12,
    fontWeight: '700',
    textDecorationLine: 'underline'
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    width: 135,
    height: 5,
    borderRadius: 5,
    backgroundColor: COLORS.deepBrown
  }
});
