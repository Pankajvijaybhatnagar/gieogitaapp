import { useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
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

import { Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';

import { useAuth } from '@/context/AuthContext';

import userServices from '@/lib/services/userServices';

const COLORS = {
  primary: '#A55A12',
  primaryDark: '#713907',
  primaryLight: '#FBF1E5',

  background: '#F8F7F5',
  white: '#FFFFFF',

  text: '#181818',
  secondary: '#737373',

  border: '#EAE7E3',
  success: '#188044',
  successLight: '#EAF7EF',

  danger: '#C93434',
};

export default function PasswordScreen() {
  const router = useRouter();

  const {
    user,
    access_token,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  /*
  |--------------------------------------------------------------------------
  | FORM
  |--------------------------------------------------------------------------
  */

  const [currentPassword, setCurrentPassword] = useState('');

  const [newPassword, setNewPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');

  /*
  |--------------------------------------------------------------------------
  | VISIBILITY
  |--------------------------------------------------------------------------
  */

  const [showCurrent, setShowCurrent] = useState(false);

  const [showNew, setShowNew] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  const [saving, setSaving] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | ANIMATION
  |--------------------------------------------------------------------------
  */

  const opacity = useRef(new Animated.Value(0)).current;

  const translateY = useRef(new Animated.Value(25)).current;

  const iconScale = useRef(new Animated.Value(0.75)).current;

  const formOpacity = useRef(new Animated.Value(0)).current;

  /*
  |--------------------------------------------------------------------------
  | AUTH CHECK
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated || !access_token) {
      router.replace('/login2');
    }
  }, [authLoading, isAuthenticated, access_token, router]);

  /*
  |--------------------------------------------------------------------------
  | ANIMATION
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated || !access_token) {
      return;
    }

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.spring(translateY, {
        toValue: 0,
        speed: 15,
        bounciness: 3,
        useNativeDriver: true,
      }),

      Animated.spring(iconScale, {
        toValue: 1,
        speed: 15,
        bounciness: 6,
        useNativeDriver: true,
      }),

      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 400,
        delay: 140,
        useNativeDriver: true,
      }),
    ]).start();
  }, [authLoading, isAuthenticated, access_token]);

  /*
  |--------------------------------------------------------------------------
  | PASSWORD STRENGTH
  |--------------------------------------------------------------------------
  */

  const getStrength = password => {
    let score = 0;

    if (password.length >= 8) {
      score++;
    }

    if (/[A-Z]/.test(password)) {
      score++;
    }

    if (/[a-z]/.test(password)) {
      score++;
    }

    if (/[0-9]/.test(password)) {
      score++;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score++;
    }

    if (score <= 2) {
      return {
        label: 'Weak',
        width: '30%',
        color: '#D85A5A',
      };
    }

    if (score <= 3) {
      return {
        label: 'Medium',
        width: '60%',
        color: '#C78319',
      };
    }

    return {
      label: 'Strong',
      width: '100%',
      color: COLORS.success,
    };
  };

  const strength = getStrength(newPassword);

  /*
  |--------------------------------------------------------------------------
  | UPDATE PASSWORD
  |--------------------------------------------------------------------------
  */

  const handleUpdate = async () => {
    if (!access_token) {
      Alert.alert('Session Expired', 'Please login again.', [
        {
          text: 'OK',
          onPress: () => router.replace('/login2'),
        },
      ]);

      return;
    }

    if (!currentPassword) {
      Alert.alert('Required', 'Enter your current password.');

      return;
    }

    if (newPassword.length < 8) {
      Alert.alert(
        'Weak Password',
        'New password must contain at least 8 characters.',
      );

      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        'Password Mismatch',
        'New password and confirmation do not match.',
      );

      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert(
        'Choose a New Password',
        'Your new password must be different from the current password.',
      );

      return;
    }

    try {
      setSaving(true);

      /*
       * Payload expected by your
       * userServices.updatePassword():
       *
       * {
       *   email,
       *   current_password,
       *   new_password
       * }
       */

      const payload = {
        email: user?.email || '',

        current_password: currentPassword,

        new_password: newPassword,
      };

      console.log('[Password] Update payload:', {
        ...payload,
        current_password: '********',
        new_password: '********',
      });

      const result = await userServices.updatePassword(payload, access_token);

      console.log('[Password] Update response:', result);

      if (!result?.success) {
        throw new Error(
          result?.error || result?.message || 'Password update failed.',
        );
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      Alert.alert(
        'Password Updated',
        'Your password has been changed successfully.',
        [
          {
            text: 'Done',
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error) {
      console.error('[Password] Update error:', error);

      Alert.alert(
        'Password Update Failed',
        error?.message || 'Unable to update password.',
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (authLoading || (!isAuthenticated && !access_token)) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={COLORS.primary} />

        <Text style={styles.loadingText}>Checking your session...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Animated.View
          style={[
            styles.flex,
            {
              opacity,
              transform: [
                {
                  translateY,
                },
              ],
            },
          ]}>
          {/* HEADER */}

          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={20} color={COLORS.text} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Change Password</Text>

            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.content}>
            <Animated.View
              style={[
                styles.securityIcon,
                {
                  transform: [
                    {
                      scale: iconScale,
                    },
                  ],
                },
              ]}>
              <Ionicons
                name="lock-closed-outline"
                size={29}
                color={COLORS.primary}
              />
            </Animated.View>

            <Text style={styles.title}>Create a New Password</Text>

            <Text style={styles.subtitle}>
              Choose a strong password to keep
            </Text>

            <Text style={styles.subtitle}>your account secure.</Text>

            <Animated.View
              style={{
                opacity: formOpacity,
              }}>
              <PasswordField
                label="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                visible={showCurrent}
                onToggle={() => setShowCurrent(previous => !previous)}
                icon="lock-closed-outline"
              />

              <PasswordField
                label="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                visible={showNew}
                onToggle={() => setShowNew(previous => !previous)}
                icon="key-outline"
              />

              {newPassword.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthHeader}>
                    <Text style={styles.strengthLabel}>Password strength</Text>

                    <Text
                      style={[
                        styles.strengthValue,
                        {
                          color: strength.color,
                        },
                      ]}>
                      {strength.label}
                    </Text>
                  </View>

                  <View style={styles.strengthTrack}>
                    <View
                      style={[
                        styles.strengthProgress,
                        {
                          width: strength.width,
                          backgroundColor: strength.color,
                        },
                      ]}
                    />
                  </View>
                </View>
              )}

              <PasswordField
                label="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                visible={showConfirm}
                onToggle={() => setShowConfirm(previous => !previous)}
                icon="shield-checkmark-outline"
              />

              <View style={styles.requirements}>
                <Text style={styles.requirementsTitle}>
                  Password requirements
                </Text>

                <Requirement
                  text="At least 8 characters"
                  valid={newPassword.length >= 8}
                />

                <Requirement
                  text="One uppercase letter"
                  valid={/[A-Z]/.test(newPassword)}
                />

                <Requirement
                  text="One number"
                  valid={/[0-9]/.test(newPassword)}
                />

                <Requirement
                  text="One special character"
                  valid={/[^A-Za-z0-9]/.test(newPassword)}
                />
              </View>

              <TouchableOpacity
                style={[styles.updateButton, saving && styles.disabledButton]}
                onPress={handleUpdate}
                disabled={saving}>
                {saving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={18} color="#FFFFFF" />

                    <Text style={styles.updateText}>Update Password</Text>
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.securityNote}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={17}
                  color={COLORS.success}
                />

                <Text style={styles.securityNoteText}>
                  Never share your password with anyone. We will never ask for
                  your password.
                </Text>
              </View>
            </Animated.View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

function PasswordField({
  label,
  value,
  onChangeText,
  visible,
  onToggle,
  icon,
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputWrapper}>
        <Ionicons
          name={icon}
          size={17}
          color="#888888"
          style={styles.inputIcon}
        />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
          placeholder="••••••••"
          placeholderTextColor="#A2A2A2"
          style={styles.input}
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.eyeButton} onPress={onToggle}>
          <Ionicons
            name={visible ? 'eye-outline' : 'eye-off-outline'}
            size={20}
            color="#555555"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Requirement({ text, valid }) {
  return (
    <View style={styles.requirement}>
      <View
        style={[styles.requirementIcon, valid && styles.requirementIconValid]}>
        <Ionicons
          name={valid ? 'checkmark' : 'ellipse-outline'}
          size={10}
          color={valid ? '#FFFFFF' : '#999999'}
        />
      </View>

      <Text
        style={[styles.requirementText, valid && styles.requirementTextValid]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  loadingScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 11,
    color: COLORS.secondary,
  },

  header: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  backButton: {
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: '#F8F7F5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },

  headerSpacer: {
    width: 39,
  },

  content: {
    padding: 20,
    paddingBottom: 35,
  },

  securityIcon: {
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 10.5,
    lineHeight: 15,
    color: COLORS.secondary,
  },

  field: {
    marginTop: 18,
  },

  label: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#4A4A4A',
    marginBottom: 5,
  },

  inputWrapper: {
    height: 47,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
  },

  inputIcon: {
    marginLeft: 13,
    marginRight: 3,
  },

  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 9,
    fontSize: 11.5,
    color: COLORS.text,
  },

  eyeButton: {
    width: 43,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  strengthContainer: {
    marginTop: 9,
  },

  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },

  strengthLabel: {
    fontSize: 9,
    color: COLORS.secondary,
  },

  strengthValue: {
    fontSize: 9,
    fontWeight: '700',
  },

  strengthTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#EAE8E5',
    overflow: 'hidden',
  },

  strengthProgress: {
    height: '100%',
    borderRadius: 2,
  },

  requirements: {
    marginTop: 17,
    padding: 13,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  requirementsTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },

  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  requirementIcon: {
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#F0EFED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
  },

  requirementIconValid: {
    backgroundColor: COLORS.success,
  },

  requirementText: {
    fontSize: 9.5,
    color: COLORS.secondary,
  },

  requirementTextValid: {
    color: COLORS.success,
  },

  updateButton: {
    height: 49,
    borderRadius: 25,
    marginTop: 20,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  disabledButton: {
    opacity: 0.65,
  },

  updateText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },

  securityNote: {
    marginTop: 14,
    padding: 12,
    borderRadius: 13,
    backgroundColor: COLORS.successLight,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  securityNoteText: {
    flex: 1,
    marginLeft: 7,
    fontSize: 9,
    lineHeight: 14,
    color: '#4C735B',
  },
});
