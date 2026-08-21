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

const DARK_BROWN = '#6D3B0D';

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
            <Ionicons name="arrow-back" size={21} color="#333" />
          </TouchableOpacity>
        </Animated.View>

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
            we'll send you a verification code.
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
                color="#999"
                style={styles.inputIcon}
              />

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="example@gmail.com"
                placeholderTextColor="#A6A6A6"
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
    paddingHorizontal: 24,
    paddingTop: 100,
  },

  iconCircle: {
    alignSelf: 'center',
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FBF1E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 17,
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
    lineHeight: 17,
  },

  label: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 8,
    fontWeight: '600',
  },

  emailLabel: {
    marginTop: 32,
  },

  inputWrapper: {
    width: '100%',
    height: 49,
    borderRadius: 13,
    backgroundColor: '#F6F6F6',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },

  inputIcon: {
    marginLeft: 14,
  },

  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    fontSize: 12,
    color: '#333333',
  },

  messageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },

  message: {
    fontSize: 10.8,
    marginLeft: 5,
    textAlign: 'center',
    flex: 1,
  },

  primaryButton: {
    marginTop: 23,
    height: 50,
    borderRadius: 25,
    backgroundColor: PRIMARY_BROWN,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 5,
  },

  disabledButton: {
    opacity: 0.68,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  buttonIcon: {
    marginLeft: 9,
  },

  loginBackButton: {
    alignSelf: 'center',
    marginTop: 24,
  },

  loginBackText: {
    color: DARK_BROWN,
    fontSize: 11,
    fontWeight: '700',
    textDecorationLine: 'underline',
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
