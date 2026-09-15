import { useCallback, useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useRouter } from 'expo-router';

import { useAppAlert } from '@/context/AppAlertContext';
import { useAuth } from '@/context/AuthContext';
import { useHeaderScrollProps } from '@/context/HeaderScrollContext';
import { useNotifications } from '@/context/NotificationContext';

import userServices from '@/lib/services/userServices';

import ConsentCheckboxes from '@/components/common/ConsentCheckboxes';
import Card from '@/components/ui/Card';
import Spacer from '@/components/ui/Spacer';
import { COLORS as BRAND, RGB } from '@/constants/brandColors';
import { radii, shadow, spacing, type } from '@/constants/theme';

const COLORS = {
  primary: BRAND.saffron,
  primaryDark: BRAND.richBrown,
  primaryLight: BRAND.creamDark,

  background: BRAND.cream,
  white: BRAND.white,

  text: BRAND.deepBrown,
  secondary: BRAND.warmBrown,
  light: BRAND.warmBrown,

  border: BRAND.creamDark,
  input: BRAND.creamDark,

  success: '#188044',
  successLight: '#EAF7EF',

  danger: BRAND.dangerRed,
  dangerLight: BRAND.dangerLight,
};

export default function ProfileScreen() {
  const router = useRouter();
  const { alert, success, error, warning, loading, hide, confirm } =
    useAppAlert();
  const headerScrollProps = useHeaderScrollProps();

  const {
    user,
    access_token,
    loading: authLoading,
    isAuthenticated,
    logout,
  } = useAuth();

  const { notificationsEnabled, setNotificationsEnabled } = useNotifications();

  // Local, optimistic mirror of notificationsEnabled. The context version
  // only updates once the permission request / API call round-trips, which
  // is too slow to drive the Switch directly — without this, the thumb
  // visually moves on tap (native gesture) then snaps back on re-render
  // because the controlled `value` prop hasn't caught up yet, reading as
  // "frozen" or "moving back by itself".
  const [switchValue, setSwitchValue] = useState(true);

  const [notificationsToggling, setNotificationsToggling] = useState(false);

  useEffect(() => {
    if (notificationsEnabled !== null) {
      setSwitchValue(notificationsEnabled);
    }
  }, [notificationsEnabled]);

  /*
  |--------------------------------------------------------------------------
  | PROFILE
  |--------------------------------------------------------------------------
  */

  const [profile, setProfile] = useState(user || null);

  const [profileLoading, setProfileLoading] = useState(true);

  const [editing, setEditing] = useState(false);

  const [saving, setSaving] = useState(false);

  const [termsAccepted, setTermsAccepted] = useState(false);

  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | FORM
  |--------------------------------------------------------------------------
  */

  const [name, setName] = useState('');

  const [username, setUsername] = useState('');

  const [phone, setPhone] = useState('');

  const [dob, setDob] = useState('');

  const [address, setAddress] = useState('');

  const [city, setCity] = useState('');

  const [district, setDistrict] = useState('');

  const [state, setState] = useState('');

  const [country, setCountry] = useState('');

  const [showDobPicker, setShowDobPicker] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | ANIMATION
  |--------------------------------------------------------------------------
  */

  const screenOpacity = useRef(new Animated.Value(0)).current;

  const heroTranslate = useRef(new Animated.Value(-18)).current;

  const avatarScale = useRef(new Animated.Value(0.8)).current;

  const cardsOpacity = useRef(new Animated.Value(0)).current;

  const cardsTranslate = useRef(new Animated.Value(18)).current;

  /*
  |--------------------------------------------------------------------------
  | COPY PROFILE TO FORM
  |--------------------------------------------------------------------------
  */

  const copyToForm = useCallback(data => {
    if (!data) {
      return;
    }

    setName(data.name || '');

    setUsername(data.username || '');

    setPhone(data.phone || '');

    setDob(data.dob || '');

    setAddress(data.address || '');

    setCity(data.city || '');

    setDistrict(data.district || '');

    setState(data.state || '');

    setCountry(data.country || '');
  }, []);

  /*
  |--------------------------------------------------------------------------
  | NORMALIZE PROFILE RESPONSE
  |--------------------------------------------------------------------------
  */

  const extractProfile = result => {
    /*
     * Possible apiRequest structures:
     *
     * result.data
     *
     * or
     *
     * result.data.data
     */

    if (result?.data?.data && typeof result.data.data === 'object') {
      return result.data.data;
    }

    if (
      result?.data &&
      typeof result.data === 'object' &&
      !Array.isArray(result.data)
    ) {
      return result.data;
    }

    return null;
  };

  /*
  |--------------------------------------------------------------------------
  | LOAD PROFILE
  |--------------------------------------------------------------------------
  */

  const loadProfile = useCallback(
    async (showLoader = true) => {
      if (!access_token) {
        console.log('[Profile] No access token');

        setProfile(null);
        setProfileLoading(false);
        return;
      }

      try {
        if (showLoader) {
          setProfileLoading(true);
        }

        console.log('[Profile] Fetching current user...');

        const result = await userServices.getCurrentUser(access_token);

        console.log('[Profile] Current user response:', result);

        if (result?.success === false) {
          throw new Error(result?.error || 'Unable to load profile.');
        }

        if (result?.data?.status === false) {
          throw new Error(result?.data?.message || 'Unable to load profile.');
        }

        const currentUser = extractProfile(result);

        if (!currentUser) {
          throw new Error('Profile data was not returned by the server.');
        }

        console.log('[Profile] Current user:', currentUser);

        setProfile(currentUser);

        copyToForm(currentUser);
      } catch (error) {
        console.error('[Profile] Load profile error:', error);

        /*
         * AuthContext user can be used as a
         * temporary fallback, but backend remains
         * the primary source.
         */

        if (user) {
          setProfile(user);
          copyToForm(user);
        }
      } finally {
        setProfileLoading(false);

        setRefreshing(false);
      }
    },
    [access_token, copyToForm, user],
  );

  /*
  |--------------------------------------------------------------------------
  | AUTH + INITIAL PROFILE LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated || !access_token) {
      console.log('[Profile] User is not logged in');

      setProfile(null);
      setProfileLoading(false);

      return;
    }

    loadProfile();
  }, [authLoading, isAuthenticated, access_token, loadProfile]);

  /*
  |--------------------------------------------------------------------------
  | SYNC AUTH USER
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (user && !profile) {
      setProfile(user);
      copyToForm(user);
    }
  }, [user, profile, copyToForm]);

  /*
  |--------------------------------------------------------------------------
  | SCREEN ANIMATION
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (profileLoading) {
      return;
    }

    Animated.parallel([
      Animated.timing(screenOpacity, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.spring(heroTranslate, {
        toValue: 0,
        speed: 15,
        bounciness: 3,
        useNativeDriver: true,
      }),

      Animated.spring(avatarScale, {
        toValue: 1,
        speed: 15,
        bounciness: 6,
        useNativeDriver: true,
      }),

      Animated.parallel([
        Animated.timing(cardsOpacity, {
          toValue: 1,
          duration: 400,
          delay: 100,
          useNativeDriver: true,
        }),

        Animated.spring(cardsTranslate, {
          toValue: 0,
          speed: 15,
          bounciness: 3,
          delay: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [profileLoading]);

  /*
  |--------------------------------------------------------------------------
  | REFRESH
  |--------------------------------------------------------------------------
  */

  const handleRefresh = async () => {
    setRefreshing(true);

    await loadProfile(false);
  };

  /*
  |--------------------------------------------------------------------------
  | EDIT
  |--------------------------------------------------------------------------
  */

  const handleEdit = () => {
    copyToForm(profile);

    setTermsAccepted(false);
    setPrivacyAccepted(false);

    setEditing(true);
  };

  /*
  |--------------------------------------------------------------------------
  | CANCEL
  |--------------------------------------------------------------------------
  */

  const handleCancel = () => {
    copyToForm(profile);

    setEditing(false);
  };

  /*
  |--------------------------------------------------------------------------
  | SAVE PROFILE
  |--------------------------------------------------------------------------
  */

  const handleSave = async () => {
    if (!access_token) {
      confirm(
        'Session Expired',
        'Please login again.',
        () => router.replace('/login2'),
        {
          buttonText: 'OK',
          secondaryButtonText: null,
          icon: 'log-in-outline',
        },
      );

      return;
    }

    if (!name.trim()) {
      alert('Required', 'Please enter your name.');

      return;
    }

    if (!termsAccepted || !privacyAccepted) {
      alert(
        'Terms required',
        'Please accept the Terms & Conditions and Privacy Policy.',
      );

      return;
    }

    try {
      setSaving(true);

      /*
       * IMPORTANT:
       *
       * Email is intentionally NOT included.
       * Verified email cannot be changed.
       */

      const payload = {
        name: name.trim(),

        username: username.trim(),

        phone: phone.trim(),

        dob: dob.trim(),

        address: address.trim(),

        city: city.trim(),

        district: district.trim(),

        state: state.trim(),

        country: country.trim(),
      };

      console.log('[Profile] Update payload:', payload);

      const result = await userServices.updateCurrentUser(
        payload,
        access_token,
      );

      console.log('[Profile] Update response:', result);

      if (result?.success === false) {
        throw new Error(
          result?.error || result?.message || 'Profile update failed.',
        );
      }

      if (result?.data?.status === false) {
        throw new Error(result?.data?.message || 'Profile update failed.');
      }

      /*
       * Fetch fresh profile from backend.
       */

      await loadProfile(false);

      setEditing(false);

      success('Profile Updated', 'Your profile has been updated successfully.');
    } catch (error) {
      console.error('[Profile] Update profile error:', error);

      alert('Update Failed', error?.message || 'Unable to update profile.');
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | NOTIFICATIONS TOGGLE
  |--------------------------------------------------------------------------
  */

  const applyNotificationsToggle = async value => {
    setNotificationsToggling(true);

    try {
      const result = await setNotificationsEnabled(value);
      const applied = typeof result === 'boolean' ? result : result.applied;
      const permissionGranted =
        typeof result === 'boolean' ? result : result.permissionGranted;

      // Reconcile with whatever actually happened (e.g. permission denied
      // when turning on) instead of trusting the optimistic tap.
      setSwitchValue(applied);

      if (value && !applied) {
        if (permissionGranted) {
          alert(
            'Notifications Unavailable',
            'Notification permission is already enabled, but this device could not be registered for push notifications. Please try again shortly.',
          );
          return;
        }

        confirm(
          'Notifications Disabled',
          `Please allow notifications for this app in ${
            Platform.OS === 'ios' ? 'iPhone' : 'Android'
          } Settings to receive updates and donation receipts.`,
          async () => {
            try {
              await Linking.openSettings();
            } catch (settingsError) {
              console.error(
                '[Profile] Open notification settings error:',
                settingsError,
              );
              alert(
                'Unable to Open Settings',
                "Please open this app's notification settings manually.",
              );
            }
          },
          {
            buttonText: 'Open Settings',
            secondaryButtonText: 'Not Now',
            icon: 'notifications-outline',
          },
        );
      }
    } finally {
      setNotificationsToggling(false);
    }
  };

  const handleToggleNotifications = value => {
    // Move the thumb immediately so the tap always feels responsive —
    // the slower permission/API work happens in the background and only
    // snaps the switch back if it didn't actually take effect.
    setSwitchValue(value);

    // Turning ON needs no confirmation. Turning OFF does — a stray tap
    // shouldn't silently cut someone off from updates/donation receipts.
    if (value) {
      applyNotificationsToggle(true);
      return;
    }

    confirm(
      'Turn Off Notifications?',
      'You will stop receiving push notifications about updates, donations and more.',
      () => applyNotificationsToggle(false),
      {
        buttonText: 'Turn Off',
        secondaryButtonText: 'Cancel',
        destructive: true,
        icon: 'notifications-off-outline',
        onCancel: () => setSwitchValue(true),
      },
    );
  };

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const handleLogout = () => {
    confirm(
      'Logout',
      'Are you sure you want to logout?',
      async () => {
        try {
          loading(
            'Logging out...',
            'Please wait while we securely logout your account.',
          );

          const result = await logout();

          console.log('[Profile] Logout result:', result);

          if (!result?.success) {
            error('Logout Failed', result?.error || 'Unable to logout.');

            return;
          }

          setTimeout(() => {
            router.push('/login2');
            hide();
          }, 100);
        } catch (logoutError) {
          console.error('[Profile] Logout error:', logoutError);

          error('Logout Failed', 'Unable to logout. Please try again.');
        }
      },
      {
        buttonText: 'Logout',
        secondaryButtonText: 'Cancel',
        destructive: true,
        icon: 'log-out-outline',
      },
    );
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (authLoading || profileLoading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={COLORS.primaryDark} />

        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | NO USER
  |--------------------------------------------------------------------------
  */

  if (!isAuthenticated || !access_token || !profile) {
    return (
      <View style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.guestScrollContent}
          {...headerScrollProps}>
          <View style={styles.hero}>
            <View style={styles.heroBanner}>
              <View style={styles.heroPatternOne} />
              <View style={styles.heroPatternTwo} />
              <Text style={styles.heroOm}></Text>
            </View>

            <View style={styles.heroIconRing}>
              <View style={styles.heroIcon}>
                <Ionicons
                  name="person-outline"
                  size={34}
                  color={COLORS.primaryDark}
                />
              </View>
            </View>

            <Text style={styles.heroTitle}>My Profile</Text>
            <View style={styles.heroDivider} />
          </View>

          <Card radius={radii.xl} style={styles.guestCard}>
            <View style={styles.guestIconRing}>
              <Ionicons
                name="lock-closed-outline"
                size={26}
                color={COLORS.primaryDark}
              />
            </View>

            <Text style={styles.guestTitle}>You&apos;re Not Logged In</Text>

            <Text style={styles.guestText}>
              Please login to view and manage your GIEO Gita profile.
            </Text>

            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.85}
              onPress={() => router.push('/login2')}>
              <Ionicons name="log-in-outline" size={18} color={COLORS.white} />
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </Card>
          <Spacer height={120} />
        </ScrollView>
      </View>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | VALUES
  |--------------------------------------------------------------------------
  */

  const emailVerified = Number(profile.is_verified) === 1;

  const avatarLetter = (profile.name || profile.username || 'U')
    .trim()
    .charAt(0)
    .toUpperCase();

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Animated.View
          style={[
            styles.flex,
            {
              opacity: screenOpacity,
            },
          ]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={COLORS.primaryDark}
              />
            }
            contentContainerStyle={styles.scrollContent}
            {...headerScrollProps}>
            {/* HERO */}

            <Animated.View
              style={[
                styles.hero,
                {
                  transform: [
                    {
                      translateY: heroTranslate,
                    },
                  ],
                },
              ]}>
              <View style={styles.heroBanner}>
                <View style={styles.heroPatternOne} />
                <View style={styles.heroPatternTwo} />
                <Text style={styles.heroOm}></Text>

                <TouchableOpacity
                  style={styles.heroTopButton}
                  onPress={() => router.back()}>
                  <Ionicons
                    name="arrow-back"
                    size={20}
                    color={COLORS.primaryDark}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.heroTopButton, styles.heroTopButtonRight]}
                  onPress={editing ? handleCancel : handleEdit}>
                  <Ionicons
                    name={editing ? 'close-outline' : 'create-outline'}
                    size={20}
                    color={COLORS.primaryDark}
                  />
                </TouchableOpacity>
              </View>

              {/* AVATAR */}

              <Animated.View
                style={[
                  styles.avatarRing,
                  {
                    transform: [
                      {
                        scale: avatarScale,
                      },
                    ],
                  },
                ]}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{avatarLetter}</Text>
                </View>

                {emailVerified && (
                  <View style={styles.verifiedCircle}>
                    <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                  </View>
                )}
              </Animated.View>

              <Text style={styles.profileName}>{profile.name || 'User'}</Text>

              <Text style={styles.username}>
                @{profile.username || 'username'}
              </Text>

              <View style={styles.roleBadge}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={13}
                  color={COLORS.primaryDark}
                />

                <Text style={styles.roleText}>
                  {String(profile.role || 'user').toUpperCase()}
                </Text>
              </View>
            </Animated.View>

            {/* PERSONAL DETAILS */}

            <Animated.View
              style={[
                styles.section,
                {
                  opacity: cardsOpacity,
                  transform: [
                    {
                      translateY: cardsTranslate,
                    },
                  ],
                },
              ]}>
              <SectionHeader
                icon="person-outline"
                title="Personal Details"
                subtitle={
                  editing
                    ? 'Update your information'
                    : 'Your account information'
                }
              />

              <Card radius={radii.xl} style={styles.card}>
                <ProfileInput
                  label="Name"
                  value={name}
                  onChangeText={setName}
                  editable={editing}
                  icon="person-outline"
                />

                <ProfileInput
                  label="Username"
                  value={username}
                  onChangeText={setUsername}
                  editable={editing}
                  icon="at-outline"
                />

                {/* EMAIL */}

                <View style={styles.field}>
                  {editing && <Text style={styles.label}>Email</Text>}

                  {editing ? (
                    <View style={[styles.inputWrapper, styles.lockedInput]}>
                      <Ionicons
                        name="mail-outline"
                        size={17}
                        color={COLORS.secondary}
                        style={styles.inputIcon}
                      />

                      <TextInput
                        value={profile.email || ''}
                        editable={false}
                        style={styles.input}
                      />

                      <Ionicons
                        name="lock-closed-outline"
                        size={15}
                        color={COLORS.secondary}
                        style={styles.lockIcon}
                      />
                    </View>
                  ) : (
                    <View style={styles.displayRow}>
                      <View style={styles.displayIconBadge}>
                        <Ionicons
                          name="mail-outline"
                          size={15}
                          color={COLORS.primaryDark}
                        />
                      </View>

                      <Text style={styles.displayLabel}>Email</Text>

                      <Text style={styles.displayValue} numberOfLines={1}>
                        {profile.email || '-'}
                      </Text>

                      {emailVerified && (
                        <View style={styles.verifiedBadge}>
                          <Ionicons
                            name="checkmark-circle"
                            size={12}
                            color={COLORS.success}
                          />

                          <Text style={styles.verifiedText}>Verified</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>

                <ProfileInput
                  label="Phone"
                  value={phone}
                  onChangeText={setPhone}
                  editable={editing}
                  icon="call-outline"
                  keyboardType="phone-pad"
                />

                {editing ? (
                  <View style={styles.field}>
                    <Text style={styles.label}>Date of Birth</Text>

                    <TouchableOpacity
                      style={styles.inputWrapper}
                      activeOpacity={0.75}
                      onPress={() => setShowDobPicker(true)}>
                      <Ionicons
                        name="calendar-outline"
                        size={16}
                        color={COLORS.secondary}
                        style={styles.inputIcon}
                      />

                      <Text style={styles.input}>
                        {dob || 'Select date of birth'}
                      </Text>
                    </TouchableOpacity>

                    {showDobPicker && (
                      <DateTimePicker
                        value={dob ? new Date(dob) : new Date(2000, 0, 1)}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        maximumDate={new Date()}
                        onChange={(event, selectedDate) => {
                          setShowDobPicker(false);

                          if (selectedDate) {
                            const year = selectedDate.getFullYear();
                            const month = String(
                              selectedDate.getMonth() + 1,
                            ).padStart(2, '0');
                            const day = String(selectedDate.getDate()).padStart(
                              2,
                              '0',
                            );

                            setDob(`${year}-${month}-${day}`);
                          }
                        }}
                      />
                    )}
                  </View>
                ) : (
                  <ProfileInput
                    label="Date of Birth"
                    value={dob}
                    onChangeText={setDob}
                    editable={false}
                    icon="calendar-outline"
                    isLast
                  />
                )}
              </Card>
            </Animated.View>

            {/* LOCATION */}

            <Animated.View
              style={[
                styles.section,
                {
                  opacity: cardsOpacity,
                },
              ]}>
              <SectionHeader
                icon="location-outline"
                title="Location"
                subtitle="Your address details"
              />

              <Card radius={radii.xl} style={styles.card}>
                <ProfileInput
                  label="Address"
                  value={address}
                  onChangeText={setAddress}
                  editable={editing}
                  icon="home-outline"
                />

                <ProfileInput
                  label="City"
                  value={city}
                  onChangeText={setCity}
                  editable={editing}
                  icon="business-outline"
                />

                <ProfileInput
                  label="District"
                  value={district}
                  onChangeText={setDistrict}
                  editable={editing}
                  icon="map-outline"
                />

                <ProfileInput
                  label="State"
                  value={state}
                  onChangeText={setState}
                  editable={editing}
                  icon="navigate-outline"
                />

                <ProfileInput
                  label="Country"
                  value={country}
                  onChangeText={setCountry}
                  editable={editing}
                  icon="globe-outline"
                  isLast
                />
              </Card>
            </Animated.View>

            {/* SAVE */}

            {editing && (
              <Animated.View style={styles.actions}>
                <ConsentCheckboxes
                  termsAccepted={termsAccepted}
                  onToggleTerms={() => setTermsAccepted(prev => !prev)}
                  privacyAccepted={privacyAccepted}
                  onTogglePrivacy={() => setPrivacyAccepted(prev => !prev)}
                  disabled={saving}
                />

                <TouchableOpacity
                  style={[styles.saveButton, saving && styles.disabledButton]}
                  onPress={handleSave}
                  disabled={saving}>
                  {saving ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    <>
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={COLORS.white}
                      />

                      <Text style={styles.saveText}>Save Changes</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancel}
                  disabled={saving}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* ACCOUNT & SECURITY */}

            <Animated.View
              style={[
                styles.section,
                {
                  opacity: cardsOpacity,
                },
              ]}>
              <SectionHeader
                icon="settings-outline"
                title="Account & Security"
                subtitle="Manage your account"
              />

              <Card radius={radii.xl} style={styles.card}>
                <AccountAction
                  icon="shield-checkmark-outline"
                  title="Security & Sessions"
                  subtitle="View and manage active sessions"
                  onPress={() => router.push('/home/profile/security')}
                />

                <View style={styles.actionDivider} />

                <AccountAction
                  icon="lock-closed-outline"
                  title="Change Password"
                  subtitle="Update your account password"
                  onPress={() => router.push('/home/profile/password')}
                  isLast
                />
              </Card>
            </Animated.View>

            {/* NOTIFICATIONS */}

            <Animated.View
              style={[
                styles.section,
                {
                  opacity: cardsOpacity,
                },
              ]}>
              <SectionHeader
                icon="notifications-outline"
                title="Notifications"
                subtitle="Control push notifications"
              />

              <Card radius={radii.xl} style={styles.card}>
                <View style={styles.toggleRow}>
                  <View style={styles.accountActionIcon}>
                    <Ionicons
                      name="notifications-outline"
                      size={18}
                      color={COLORS.primaryDark}
                    />
                  </View>

                  <View style={styles.accountActionContent}>
                    <Text style={styles.accountActionTitle}>
                      Push Notifications
                    </Text>

                    <Text style={styles.accountActionSubtitle}>
                      Get notified about updates, donations and more
                    </Text>
                  </View>

                  <Switch
                    value={switchValue}
                    onValueChange={handleToggleNotifications}
                    disabled={notificationsToggling}
                    trackColor={{
                      false: COLORS.border,
                      true: COLORS.primaryDark,
                    }}
                    thumbColor={COLORS.white}
                  />
                </View>
              </Card>
            </Animated.View>

            {/* LEGAL */}

            <Animated.View
              style={[
                styles.section,
                {
                  opacity: cardsOpacity,
                },
              ]}>
              <SectionHeader
                icon="information-circle-outline"
                title="Legal"
                subtitle="Policies and conditions"
              />

              <Card radius={radii.xl} style={styles.card}>
                <AccountAction
                  icon="document-text-outline"
                  title="Privacy Policy"
                  subtitle="Read our privacy policy"
                  onPress={() => router.push('/privacy-policy')}
                />

                <View style={styles.actionDivider} />

                <AccountAction
                  icon="reader-outline"
                  title="Terms & Conditions"
                  subtitle="Read our terms and conditions"
                  onPress={() => router.push('/terms')}
                  isLast
                />
              </Card>
            </Animated.View>

            {/* LOGOUT */}

            <Animated.View
              style={[
                styles.section,
                {
                  opacity: cardsOpacity,
                },
              ]}>
              <Card radius={radii.xl} style={styles.logoutCard}>
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}
                  activeOpacity={0.8}>
                  <View style={styles.logoutIcon}>
                    <Ionicons
                      name="log-out-outline"
                      size={19}
                      color={COLORS.danger}
                    />
                  </View>

                  <View style={styles.logoutContent}>
                    <Text style={styles.logoutTitle}>Log Out</Text>

                    <Text style={styles.logoutSubtitle}>
                      Sign out from this device
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={COLORS.danger}
                  />
                </TouchableOpacity>
              </Card>
            </Animated.View>

            <View style={styles.bottomSpace} />
            <Spacer height={120} />
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

/*
|--------------------------------------------------------------------------
| SECTION HEADER
|--------------------------------------------------------------------------
*/

function SectionHeader({ icon, title }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIcon}>
        <Ionicons name={icon} size={16} color={COLORS.white} />
      </View>

      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

/*
|--------------------------------------------------------------------------
| PROFILE INPUT
|--------------------------------------------------------------------------
*/

function ProfileInput({
  label,
  value,
  onChangeText,
  editable,
  icon,
  keyboardType = 'default',
  isLast = false,
}) {
  return (
    <View style={[styles.field, isLast && styles.fieldLast]}>
      {editable && <Text style={styles.label}>{label}</Text>}

      {editable ? (
        <View style={styles.inputWrapper}>
          <Ionicons
            name={icon}
            size={16}
            color={COLORS.secondary}
            style={styles.inputIcon}
          />

          <TextInput
            value={value || ''}
            onChangeText={onChangeText}
            editable
            keyboardType={keyboardType}
            placeholder={label}
            placeholderTextColor={COLORS.secondary}
            style={styles.input}
          />
        </View>
      ) : (
        <View style={styles.displayRow}>
          <View style={styles.displayIconBadge}>
            <Ionicons name={icon} size={15} color={COLORS.primaryDark} />
          </View>

          <Text style={styles.displayLabel}>{label}</Text>

          <Text style={styles.displayValue} numberOfLines={1}>
            {value || '-'}
          </Text>
        </View>
      )}
    </View>
  );
}

/*
|--------------------------------------------------------------------------
| ACCOUNT ACTION
|--------------------------------------------------------------------------
*/

function AccountAction({ icon, title, subtitle, onPress, isLast = false }) {
  return (
    <TouchableOpacity
      style={[styles.accountAction, isLast && styles.accountActionLast]}
      onPress={onPress}
      activeOpacity={0.75}>
      <View style={styles.accountActionIcon}>
        <Ionicons name={icon} size={18} color={COLORS.primaryDark} />
      </View>

      <View style={styles.accountActionContent}>
        <Text style={styles.accountActionTitle}>{title}</Text>

        <Text style={styles.accountActionSubtitle}>{subtitle}</Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color={COLORS.secondary} />
    </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: spacing.sm,
    ...type.footnote,
    color: COLORS.secondary,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  guestScrollContent: {
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },

  /* HERO — warm cream banner with soft blob accents, same language as the
     Seva page's hero, instead of a flat solid-dark block. */
  hero: {
    alignItems: 'center',
    paddingBottom: spacing.lg,
    marginBottom: spacing.sm,
  },
  heroBanner: {
    width: '100%',
    height: 150,
    backgroundColor: COLORS.primaryLight,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPatternOne: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: `rgba(${RGB.gold}, 0.12)`,
    top: -70,
    left: -50,
  },
  heroPatternTwo: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: `rgba(${RGB.saffron}, 0.08)`,
    right: -85,
    top: -95,
  },
  heroOm: {
    color: `rgba(${RGB.gold}, 0.16)`,
    fontSize: 72,
    fontWeight: '700',
  },
  heroTopButton: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `rgba(${RGB.maroon}, 0.1)`,
    borderWidth: 1,
    borderColor: `rgba(${RGB.gold}, 0.3)`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTopButtonRight: {
    left: undefined,
    right: spacing.md,
  },
  avatarRing: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -54,
    ...shadow.raised,
    shadowColor: COLORS.primaryDark,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: `rgba(${RGB.maroon},0.1)`,
    borderWidth: 3,
    borderColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...type.largeTitle,
    fontFamily: undefined,
    fontSize: 34,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  verifiedCircle: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    marginTop: spacing.sm,
    ...type.title,
    fontSize: 22,
    color: COLORS.text,
    textAlign: 'center',
  },
  username: {
    marginTop: 2,
    ...type.subhead,
    color: COLORS.secondary,
  },
  roleBadge: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `rgba(${RGB.maroon},0.08)`,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  roleText: {
    ...type.caption,
    fontSize: 10,
    color: COLORS.primaryDark,
  },

  /* GUEST CARD */
  guestCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
    alignItems: 'center',
  },
  guestIconRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `rgba(${RGB.maroon},0.08)`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  guestTitle: {
    ...type.headline,
    fontSize: 17,
    color: COLORS.text,
    marginBottom: spacing.xs,
  },
  guestText: {
    ...type.body,
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  loginButton: {
    minWidth: 160,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    backgroundColor: COLORS.primaryDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 52,
    ...shadow.card,
    shadowColor: COLORS.primaryDark,
  },
  loginButtonText: {
    color: COLORS.white,
    ...type.subhead,
    fontWeight: '700',
  },

  /* SECTIONS */
  section: {
    marginTop: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
    shadowColor: COLORS.primaryDark,
  },
  sectionTitle: {
    ...type.headline,
    fontSize: 15.5,
    color: COLORS.text,
  },
  card: {
    marginHorizontal: spacing.lg,
    padding: spacing.md,
  },

  /* FIELDS */
  field: {
    marginBottom: spacing.md,
  },
  fieldLast: {
    marginBottom: 0,
  },
  label: {
    ...type.caption,
    fontSize: 11,
    color: COLORS.secondary,
    marginBottom: spacing.xs + 2,
    letterSpacing: 0.4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.input,
    paddingHorizontal: spacing.sm + 2,
  },
  lockedInput: {
    opacity: 0.7,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  lockIcon: {
    marginLeft: spacing.sm,
  },
  input: {
    flex: 1,
    ...type.body,
    fontSize: 14,
    color: COLORS.text,
    paddingVertical: spacing.sm,
  },
  displayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
  },
  displayIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: `rgba(${RGB.maroon},0.08)`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  displayLabel: {
    ...type.footnote,
    color: COLORS.secondary,
    marginRight: spacing.sm,
  },
  displayValue: {
    flex: 1,
    ...type.subhead,
    fontWeight: '600',
    color: COLORS.text,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.successLight,
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  verifiedText: {
    ...type.caption,
    fontSize: 9,
    color: COLORS.success,
  },

  /* SAVE / CANCEL */
  actions: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 52,
    borderRadius: radii.pill,
    backgroundColor: COLORS.primaryDark,
    ...shadow.card,
    shadowColor: COLORS.primaryDark,
  },
  disabledButton: {
    opacity: 0.65,
  },
  saveText: {
    color: COLORS.white,
    ...type.subhead,
    fontWeight: '700',
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelText: {
    color: COLORS.secondary,
    ...type.subhead,
    fontWeight: '600',
  },

  /* ACCOUNT ACTIONS */
  accountAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    paddingVertical: spacing.sm + 2,
  },
  accountActionLast: {
    paddingBottom: 0,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
  },
  accountActionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: `rgba(${RGB.maroon},0.08)`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountActionContent: {
    flex: 1,
  },
  accountActionTitle: {
    ...type.subhead,
    fontWeight: '700',
    color: COLORS.text,
  },
  accountActionSubtitle: {
    ...type.footnote,
    color: COLORS.secondary,
    marginTop: 2,
  },
  actionDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },

  /* LOGOUT */
  logoutCard: {
    marginHorizontal: spacing.lg,
    padding: 0,
    borderWidth: 1,
    borderColor: `rgba(${RGB.dangerRed},0.18)`,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    padding: spacing.md,
  },
  logoutIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: `rgba(${RGB.dangerRed},0.1)`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutContent: {
    flex: 1,
  },
  logoutTitle: {
    ...type.subhead,
    fontWeight: '700',
    color: COLORS.danger,
  },
  logoutSubtitle: {
    ...type.footnote,
    color: COLORS.secondary,
    marginTop: 2,
  },

  bottomSpace: {
    height: spacing.lg,
  },
});
