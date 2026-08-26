import { Ionicons } from '@expo/vector-icons';
import SocialLogin from './SocialLogin';

import React, { useEffect, useRef, useState } from 'react';

import { Logos } from '@/assets/images';
import { Image } from 'expo-image';
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

const PRIMARY_BROWN = '#A55A12';

const DARK_BROWN = '#6D3B0D';

const TEXT_COLOR = '#171717';

const MUTED_COLOR = '#868686';

const INPUT_BG = '#F6F6F6';

const BORDER_COLOR = '#E6E6E6';

export default function LoginScreen({
  onSignIn,
  onForgotPassword,
  onCreateAccount,
  onAppleLogin,
  onGoogleLogin,
  loading = false,
  message = '',
  messageType = 'error',
}) {
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | ANIMATION
  |--------------------------------------------------------------------------
  */

  const cardOpacity = useRef(new Animated.Value(0)).current;

  const cardTranslate = useRef(new Animated.Value(30)).current;

  const titleOpacity = useRef(new Animated.Value(0)).current;

  const titleTranslate = useRef(new Animated.Value(18)).current;

  const fieldsOpacity = useRef(new Animated.Value(0)).current;

  const fieldsTranslate = useRef(new Animated.Value(20)).current;

  const buttonScale = useRef(new Animated.Value(0.94)).current;

  const socialOpacity = useRef(new Animated.Value(0)).current;

  const socialTranslate = useRef(new Animated.Value(15)).current;

  const messageOpacity = useRef(new Animated.Value(0)).current;

  /*
  |--------------------------------------------------------------------------
  | START ANIMATION
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.spring(cardTranslate, {
          toValue: 0,
          speed: 14,
          bounciness: 5,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),

        Animated.timing(titleTranslate, {
          toValue: 0,
          duration: 280,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(fieldsOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),

        Animated.spring(fieldsTranslate, {
          toValue: 0,
          speed: 17,
          bounciness: 3,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.spring(buttonScale, {
          toValue: 1,
          speed: 16,
          bounciness: 4,
          useNativeDriver: true,
        }),

        Animated.timing(socialOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),

        Animated.timing(socialTranslate, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | MESSAGE ANIMATION
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (message) {
      messageOpacity.setValue(0);

      Animated.spring(messageOpacity, {
        toValue: 1,
        speed: 16,
        bounciness: 4,
        useNativeDriver: true,
      }).start();
    }
  }, [message, messageOpacity]);

  /*
  |--------------------------------------------------------------------------
  | SUBMIT
  |--------------------------------------------------------------------------
  */

  const handleSignIn = () => {
    onSignIn?.({
      email: email.trim(),
      password,
    });
  };

  const handleForgot = () => {
    onForgotPassword?.(email.trim());
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}>
          <Animated.View
            style={[
              styles.container,
              {
                opacity: cardOpacity,
                transform: [
                  {
                    translateY: cardTranslate,
                  },
                ],
              },
            ]}>
            {/* TOP DECORATION */}

            <Animated.View
              style={[
                styles.topGlow,
                {
                  opacity: cardOpacity,
                },
              ]}
            />

            {/* HEADER */}

            <Animated.View
              style={[
                styles.header,
                {
                  opacity: titleOpacity,
                  transform: [
                    {
                      translateY: titleTranslate,
                    },
                  ],
                },
              ]}>
              <Image height={70} width={70} source={Logos.gieo} />

              <Text style={styles.title}>Sign In</Text>

              <Text style={styles.subtitle}>
                Hi! Welcome back, you've been missed
              </Text>
            </Animated.View>

            {/* FORM */}

            <Animated.View
              style={[
                styles.form,
                {
                  opacity: fieldsOpacity,
                  transform: [
                    {
                      translateY: fieldsTranslate,
                    },
                  ],
                },
              ]}>
              {/* EMAIL */}

              <Text style={styles.label}>Email</Text>

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

              {/* PASSWORD */}

              <Text style={[styles.label, styles.passwordLabel]}>Password</Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={17}
                  color="#999"
                  style={styles.inputIcon}
                />

                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="****************"
                  placeholderTextColor="#A6A6A6"
                  secureTextEntry={!showPassword}
                  editable={!loading}
                  style={styles.input}
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

              {/* FORGOT */}

              <TouchableOpacity
                onPress={handleForgot}
                disabled={loading}
                activeOpacity={0.7}
                style={styles.forgotWrapper}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* SIGN IN */}

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
                    styles.primaryButton,
                    loading && styles.disabledButton,
                  ]}
                  onPress={handleSignIn}
                  disabled={loading}
                  activeOpacity={0.88}>
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.primaryButtonText}>Sign In</Text>

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
                        color:
                          messageType === 'success' ? '#15803D' : '#DC2626',
                      },
                    ]}>
                    {message}
                  </Text>
                </Animated.View>
              ) : null}

              {/* DIVIDER */}

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />

                <Text style={styles.dividerText}>Or sign in with</Text>

                <View style={styles.dividerLine} />
              </View>

              {/* SOCIAL */}

              <Animated.View
                style={[
                  styles.socialContainer,
                  {
                    opacity: socialOpacity,
                    transform: [
                      {
                        translateY: socialTranslate,
                      },
                    ],
                  },
                ]}>
                <SocialLogin
                  onAppleLogin={onAppleLogin}
                  onGoogleLogin={onGoogleLogin}
                  disabled={loading}
                />
              </Animated.View>

              {/* REGISTER */}

              <Animated.View
                style={[
                  styles.bottomAccount,
                  {
                    opacity: socialOpacity,
                  },
                ]}>
                <Text style={styles.bottomText}>Don't have an account?</Text>

                <TouchableOpacity onPress={onCreateAccount} disabled={loading}>
                  <Text style={styles.linkText}> Sign Up</Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 55,
    paddingBottom: 30,
  },

  topGlow: {
    position: 'absolute',
    top: 10,
    left: -60,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#F7E2C4',
    opacity: 0.28,
  },

  header: {
    alignItems: 'center',
    marginBottom: 33,
  },

  logoCircle: {
    width: 47,
    height: 47,
    borderRadius: 24,
    backgroundColor: '#FBF1E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  logoText: {
    fontSize: 23,
    color: PRIMARY_BROWN,
  },

  title: {
    fontSize: 27,
    fontWeight: '700',
    color: TEXT_COLOR,
    letterSpacing: -0.6,
  },

  subtitle: {
    marginTop: 9,
    fontSize: 12,
    color: MUTED_COLOR,
    textAlign: 'center',
  },

  form: {
    width: '100%',
  },

  label: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 8,
    fontWeight: '600',
  },

  passwordLabel: {
    marginTop: 20,
  },

  inputWrapper: {
    height: 50,
    width: '100%',
    borderRadius: 14,
    backgroundColor: INPUT_BG,
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

  eyeButton: {
    width: 46,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  forgotWrapper: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },

  forgotText: {
    color: DARK_BROWN,
    fontSize: 11,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },

  primaryButton: {
    height: 50,
    borderRadius: 25,
    backgroundColor: PRIMARY_BROWN,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 22,
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

  messageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    paddingHorizontal: 8,
  },

  message: {
    fontSize: 11,
    lineHeight: 17,
    marginLeft: 5,
    textAlign: 'center',
    flex: 1,
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 31,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E9E9E9',
  },

  dividerText: {
    marginHorizontal: 12,
    fontSize: 10.5,
    color: '#999999',
  },

  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
    marginTop: 21,
  },

  bottomAccount: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },

  bottomText: {
    fontSize: 11,
    color: '#444444',
  },

  linkText: {
    fontSize: 11,
    color: DARK_BROWN,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
