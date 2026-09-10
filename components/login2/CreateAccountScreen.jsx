import { DESIGN } from '@/constants/design';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import SocialLogin from './SocialLogin';

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

import { COLORS } from '@/constants/brandColors';
import { hairline, radii } from '@/constants/theme';

const PRIMARY_BROWN = COLORS.richBrown;

const DARK_BROWN = COLORS.richBrown;

const TEXT_COLOR = COLORS.deepBrown;

const MUTED_COLOR = COLORS.warmBrown;

const INPUT_BG = COLORS.creamDark;

const BORDER_COLOR = hairline;

export default function CreateAccountScreen({
  onSignUp,
  onSignIn,
  onAppleLogin,
  onGoogleLogin,
  loading = false,
  message = '',
  messageType = 'error',
}) {
  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');

  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | ANIMATION
  |--------------------------------------------------------------------------
  */

  const opacity = useRef(new Animated.Value(0)).current;

  const translateY = useRef(new Animated.Value(35)).current;

  const titleOpacity = useRef(new Animated.Value(0)).current;

  const formOpacity = useRef(new Animated.Value(0)).current;

  const formTranslate = useRef(new Animated.Value(20)).current;

  const buttonScale = useRef(new Animated.Value(0.94)).current;

  const bottomOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.spring(translateY, {
        toValue: 0,
        speed: 14,
        bounciness: 4,
        useNativeDriver: true,
      }),

      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 350,
        delay: 100,
        useNativeDriver: true,
      }),

      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 400,
        delay: 180,
        useNativeDriver: true,
      }),

      Animated.spring(formTranslate, {
        toValue: 0,
        speed: 16,
        bounciness: 3,
        delay: 180,
        useNativeDriver: true,
      }),

      Animated.spring(buttonScale, {
        toValue: 1,
        speed: 17,
        bounciness: 4,
        delay: 320,
        useNativeDriver: true,
      }),

      Animated.timing(bottomOpacity, {
        toValue: 1,
        duration: 350,
        delay: 420,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSignUp = () => {
    onSignUp?.({
      name: name.trim(),
      email: email.trim(),
      password,
      confirmPassword,
      agreeTerms,
    });
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
                opacity,
                transform: [
                  {
                    translateY,
                  },
                ],
              },
            ]}>
            <Animated.View
              style={[
                styles.header,
                {
                  opacity: titleOpacity,
                },
              ]}>
              <View style={styles.logoCircle}>
                <Image height={70} width={70} source={Logos.gieo} />
              </View>

              <Text style={styles.title}>Create Account</Text>

              <Text style={styles.subtitle}>Fill your information below</Text>

              <Text style={styles.subtitle}>
                or register with your social account.
              </Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.form,
                {
                  opacity: formOpacity,
                  transform: [
                    {
                      translateY: formTranslate,
                    },
                  ],
                },
              ]}>
              {/* NAME */}

              <Text style={styles.label}>Name</Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={17}
                  color={COLORS.warmBrown}
                  style={styles.inputIcon}
                />

                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Ex. John Doe"
                  placeholderTextColor={COLORS.warmBrown}
                  editable={!loading}
                  style={styles.input}
                />
              </View>

              {/* EMAIL */}

              <Text style={[styles.label, styles.fieldSpacing]}>Email</Text>

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

              {/* PASSWORD */}

              <Text style={[styles.label, styles.fieldSpacing]}>Password</Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={17}
                  color={COLORS.warmBrown}
                  style={styles.inputIcon}
                />

                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="****************"
                  placeholderTextColor={COLORS.warmBrown}
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
                    color={COLORS.warmBrown}
                  />
                </TouchableOpacity>
              </View>

              {/* CONFIRM PASSWORD */}

              <Text style={[styles.label, styles.fieldSpacing]}>
                Confirm Password
              </Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={17}
                  color={COLORS.warmBrown}
                  style={styles.inputIcon}
                />

                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="****************"
                  placeholderTextColor={COLORS.warmBrown}
                  secureTextEntry={!showConfirmPassword}
                  editable={!loading}
                  style={styles.input}
                />

                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(prev => !prev)}
                  disabled={loading}>
                  <Ionicons
                    name={
                      showConfirmPassword ? 'eye-outline' : 'eye-off-outline'
                    }
                    size={21}
                    color={COLORS.warmBrown}
                  />
                </TouchableOpacity>
              </View>

              {/* TERMS */}

              <TouchableOpacity
                style={styles.termsRow}
                onPress={() => setAgreeTerms(prev => !prev)}
                disabled={loading}>
                <Animated.View
                  style={[
                    styles.checkbox,
                    agreeTerms && styles.checkboxSelected,
                  ]}>
                  {agreeTerms ? (
                    <Ionicons name="checkmark" size={14} color={COLORS.white} />
                  ) : null}
                </Animated.View>

                <Text style={styles.agreeText}>
                  Agree with{' '}
                  <Text style={styles.termsText}>Terms & Condition</Text>
                </Text>
              </TouchableOpacity>

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
                        color:
                          messageType === 'success' ? '#15803D' : COLORS.dangerRed,
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
                  style={[
                    styles.primaryButton,
                    loading && styles.disabledButton,
                  ]}
                  onPress={handleSignUp}
                  disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    <>
                      <Text style={styles.primaryButtonText}>Sign Up</Text>

                      <Ionicons
                        name="arrow-forward"
                        size={18}
                        color={COLORS.white}
                        style={styles.buttonIcon}
                      />
                    </>
                  )}
                </TouchableOpacity>
              </Animated.View>

              {/* DIVIDER */}

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />

                <Text style={styles.dividerText}>Or sign up with</Text>

                <View style={styles.dividerLine} />
              </View>

              {/* SOCIAL */}

              <Animated.View
                style={[
                  styles.socialContainer,
                  {
                    opacity: bottomOpacity,
                  },
                ]}>
                <SocialLogin
                  onAppleLogin={onAppleLogin}
                  onGoogleLogin={onGoogleLogin}
                  disabled={loading}
                />
              </Animated.View>

              {/* BOTTOM */}

              <Animated.View
                style={[
                  styles.bottomAccount,
                  {
                    opacity: bottomOpacity,
                  },
                ]}>
                <Text style={styles.bottomText}>Already have an account?</Text>

                <TouchableOpacity onPress={onSignIn} disabled={loading}>
                  <Text style={styles.linkText}> Sign In</Text>
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
    backgroundColor: COLORS.cream
  },
  scrollContent: {
    flexGrow: 1
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 44,
    paddingBottom: 27
  },
  header: {
    alignItems: 'center',
    marginBottom: 23
  },
  logoCircle: {
    width: 47,
    height: 47,
    borderRadius: 24,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 11
  },
  title: {
    fontSize: 22,
    fontWeight: "400",
    color: TEXT_COLOR,
    fontFamily: DESIGN.fonts.editorial,
    letterSpacing: -0.4
  },
  subtitle: {
    marginTop: 1,
    fontSize: 12,
    color: MUTED_COLOR,
    textAlign: 'center'
  },
  form: {
    width: '100%'
  },
  label: {
    fontSize: 12,
    color: COLORS.deepBrown,
    marginBottom: 1,
    fontWeight: '600'
  },
  fieldSpacing: {
    marginTop: 13
  },
  inputWrapper: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    backgroundColor: INPUT_BG,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER_COLOR
  },
  inputIcon: {
    marginLeft: 13
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    fontSize: 15,
    color: COLORS.deepBrown
  },
  eyeButton: {
    width: 44,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: hairline,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  checkboxSelected: {
    backgroundColor: PRIMARY_BROWN,
    borderColor: PRIMARY_BROWN
  },
  agreeText: {
    fontSize: 12,
    color: COLORS.warmBrown
  },
  termsText: {
    color: DARK_BROWN,
    fontWeight: '700',
    textDecorationLine: 'underline'
  },
  primaryButton: {
    borderRadius: 16,
    backgroundColor: PRIMARY_BROWN,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 19,
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
  messageBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12
  },
  message: {
    fontSize: 12,
    marginLeft: 5,
    flex: 1,
    textAlign: 'center'
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: hairline
  },
  dividerText: {
    marginHorizontal: 11,
    fontSize: 12,
    color: COLORS.warmBrown
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginTop: 10
  },
  bottomAccount: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 21,
    marginBottom: 51
  },
  bottomText: {
    fontSize: 12,
    color: COLORS.warmBrown
  },
  linkText: {
    fontSize: 12,
    fontWeight: '700',
    color: DARK_BROWN,
    textDecorationLine: 'underline'
  }
});
