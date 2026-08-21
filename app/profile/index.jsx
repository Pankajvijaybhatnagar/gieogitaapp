import { useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
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

const COLORS = {
  primary: '#A55A12',
  primaryDark: '#713907',
  primaryLight: '#FBF1E5',

  background: '#F8F7F5',
  white: '#FFFFFF',

  text: '#181818',
  secondary: '#737373',
  light: '#9A9A9A',

  border: '#EAE7E3',
  input: '#F5F4F2',

  success: '#188044',
  successLight: '#EAF7EF',

  danger: '#C93434',
  dangerLight: '#FFF0F0',
};

const INITIAL_PROFILE = {
  id: 11,
  username: 'ankitbkana6459',
  email: 'ankitbkana@outlook.com',
  name: 'Ankit',
  role: 'superadmin',
  points: 1240,
  is_verified: 1,
  created_at: '2025-12-25 21:48:40',
  address: 'VPO Bakana',
  city: 'Kurukshetra',
  district: 'Kurukshetra',
  state: 'Haryana',
  country: 'India',
  phone: '7041049340',
  dob: '1995-03-04',
};

export default function ProfileScreen() {
  const router = useRouter();

  const { logout } = useAuth();

  const [profile, setProfile] = useState(INITIAL_PROFILE);

  const [editing, setEditing] = useState(false);

  const [saving, setSaving] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | FORM
  |--------------------------------------------------------------------------
  */

  const [name, setName] = useState(INITIAL_PROFILE.name);

  const [username, setUsername] = useState(INITIAL_PROFILE.username);

  const [phone, setPhone] = useState(INITIAL_PROFILE.phone);

  const [dob, setDob] = useState(INITIAL_PROFILE.dob);

  const [address, setAddress] = useState(INITIAL_PROFILE.address);

  const [city, setCity] = useState(INITIAL_PROFILE.city);

  const [district, setDistrict] = useState(INITIAL_PROFILE.district);

  const [state, setState] = useState(INITIAL_PROFILE.state);

  const [country, setCountry] = useState(INITIAL_PROFILE.country);

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

  useEffect(() => {
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
          delay: 120,
          useNativeDriver: true,
        }),

        Animated.spring(cardsTranslate, {
          toValue: 0,
          speed: 15,
          bounciness: 3,
          delay: 120,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */

  const copyToForm = data => {
    setName(data.name || '');
    setUsername(data.username || '');
    setPhone(data.phone || '');
    setDob(data.dob || '');
    setAddress(data.address || '');
    setCity(data.city || '');
    setDistrict(data.district || '');
    setState(data.state || '');
    setCountry(data.country || '');
  };

  /*
  |--------------------------------------------------------------------------
  | EDIT
  |--------------------------------------------------------------------------
  */

  const handleEdit = () => {
    copyToForm(profile);
    setEditing(true);
  };

  const handleCancel = () => {
    copyToForm(profile);
    setEditing(false);
  };

  /*
  |--------------------------------------------------------------------------
  | SAVE
  |--------------------------------------------------------------------------
  */

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your name.');
      return;
    }

    try {
      setSaving(true);

      await new Promise(resolve => setTimeout(resolve, 600));

      const updated = {
        ...profile,
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

      setProfile(updated);
      setEditing(false);

      Alert.alert(
        'Profile Updated',
        'Your profile has been updated successfully.',
      );
    } catch (error) {
      Alert.alert('Error', 'Unable to save profile.');
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | REFRESH
  |--------------------------------------------------------------------------
  */

  const handleRefresh = async () => {
    setRefreshing(true);

    await new Promise(resolve => setTimeout(resolve, 700));

    setRefreshing(false);
  };

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await logout();

              if (result?.success) {
                router.replace('/login2');
              } else {
                Alert.alert(
                  'Logout Failed',
                  result?.error || 'Unable to logout.',
                );
              }
            } catch (error) {
              Alert.alert('Logout Failed', 'Unable to logout.');
            }
          },
        },
      ],
      {
        cancelable: true,
      },
    );
  };

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
                tintColor={COLORS.primary}
              />
            }
            contentContainerStyle={styles.scrollContent}>
            {/* ==================================================
                HEADER
            ================================================== */}

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
              <View style={styles.topBar}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => router.back()}>
                  <Ionicons name="arrow-back" size={20} color={COLORS.text} />
                </TouchableOpacity>

                <Text style={styles.pageTitle}>My Profile</Text>

                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={editing ? handleCancel : handleEdit}>
                  <Ionicons
                    name={editing ? 'close-outline' : 'create-outline'}
                    size={20}
                    color={COLORS.text}
                  />
                </TouchableOpacity>
              </View>

              <Animated.View
                style={[
                  styles.avatarContainer,
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

              <Text style={styles.profileName}>{profile.name}</Text>

              <Text style={styles.username}>@{profile.username}</Text>

              <View style={styles.roleBadge}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={13}
                  color={COLORS.primary}
                />

                <Text style={styles.roleText}>
                  {String(profile.role).toUpperCase()}
                </Text>
              </View>
            </Animated.View>

            {/* ==================================================
                ACCOUNT SUMMARY
            ================================================== */}

            <Animated.View
              style={[
                styles.summaryCard,
                {
                  opacity: cardsOpacity,
                  transform: [
                    {
                      translateY: cardsTranslate,
                    },
                  ],
                },
              ]}>
              <SummaryItem
                icon="star-outline"
                value={profile.points}
                label="Points"
              />

              <View style={styles.summaryDivider} />

              <SummaryItem
                icon="mail-outline"
                value={emailVerified ? 'Verified' : 'Pending'}
                label="Email"
                valueColor={emailVerified ? COLORS.success : COLORS.warning}
              />

              <View style={styles.summaryDivider} />

              <SummaryItem
                icon="person-outline"
                value={`#${profile.id}`}
                label="Member ID"
              />
            </Animated.View>

            {/* ==================================================
                PERSONAL DETAILS
            ================================================== */}

            <Animated.View
              style={[
                styles.card,
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
                <View style={styles.emailLabelRow}>
                  <Text style={styles.label}>Email</Text>

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

                <View style={[styles.inputWrapper, styles.lockedInput]}>
                  <Ionicons
                    name="mail-outline"
                    size={17}
                    color="#999999"
                    style={styles.inputIcon}
                  />

                  <TextInput
                    value={profile.email}
                    editable={false}
                    style={styles.input}
                  />

                  <Ionicons
                    name="lock-closed-outline"
                    size={15}
                    color="#A0A0A0"
                    style={{
                      marginRight: 13,
                    }}
                  />
                </View>

                <Text style={styles.helper}>
                  Verified email cannot be changed.
                </Text>
              </View>

              <ProfileInput
                label="Phone"
                value={phone}
                onChangeText={setPhone}
                editable={editing}
                icon="call-outline"
                keyboardType="phone-pad"
              />

              <ProfileInput
                label="Date of Birth"
                value={dob}
                onChangeText={setDob}
                editable={editing}
                icon="calendar-outline"
              />
            </Animated.View>

            {/* ==================================================
                LOCATION
            ================================================== */}

            <Animated.View
              style={[
                styles.card,
                {
                  opacity: cardsOpacity,
                },
              ]}>
              <SectionHeader
                icon="location-outline"
                title="Location"
                subtitle="Your address details"
              />

              <ProfileInput
                label="Address"
                value={address}
                onChangeText={setAddress}
                editable={editing}
                icon="home-outline"
              />

              <View style={styles.twoColumn}>
                <View style={styles.column}>
                  <ProfileInput
                    label="City"
                    value={city}
                    onChangeText={setCity}
                    editable={editing}
                    icon="business-outline"
                  />
                </View>

                <View style={styles.column}>
                  <ProfileInput
                    label="District"
                    value={district}
                    onChangeText={setDistrict}
                    editable={editing}
                    icon="map-outline"
                  />
                </View>
              </View>

              <View style={styles.twoColumn}>
                <View style={styles.column}>
                  <ProfileInput
                    label="State"
                    value={state}
                    onChangeText={setState}
                    editable={editing}
                    icon="navigate-outline"
                  />
                </View>

                <View style={styles.column}>
                  <ProfileInput
                    label="Country"
                    value={country}
                    onChangeText={setCountry}
                    editable={editing}
                    icon="globe-outline"
                  />
                </View>
              </View>
            </Animated.View>

            {/* ==================================================
                SAVE
            ================================================== */}

            {editing && (
              <Animated.View style={styles.actions}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                  disabled={saving}>
                  {saving ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="checkmark" size={18} color="#FFFFFF" />

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

            {/* ==================================================
                ACCOUNT & SECURITY
            ================================================== */}

            <Animated.View
              style={[
                styles.card,
                {
                  opacity: cardsOpacity,
                },
              ]}>
              <SectionHeader
                icon="settings-outline"
                title="Account & Security"
                subtitle="Manage your account"
              />

              <AccountAction
                icon="shield-checkmark-outline"
                title="Security & Sessions"
                subtitle="View and manage active sessions"
                onPress={() => router.push('/profile/security')}
              />

              <AccountAction
                icon="lock-closed-outline"
                title="Change Password"
                subtitle="Update your account password"
                onPress={() => router.push('/profile/password')}
              />
            </Animated.View>

            {/* ==================================================
                LEGAL
            ================================================== */}

            <Animated.View
              style={[
                styles.card,
                {
                  opacity: cardsOpacity,
                },
              ]}>
              <SectionHeader
                icon="information-circle-outline"
                title="Legal"
                subtitle="Policies and conditions"
              />

              <AccountAction
                icon="document-text-outline"
                title="Privacy Policy"
                subtitle="Read our privacy policy"
                onPress={() =>
                  Alert.alert(
                    'Privacy Policy',
                    'Privacy Policy screen will be connected here.',
                  )
                }
              />

              <View style={styles.actionDivider} />

              <AccountAction
                icon="reader-outline"
                title="Terms & Conditions"
                subtitle="Read our terms and conditions"
                onPress={() =>
                  Alert.alert(
                    'Terms & Conditions',
                    'Terms & Conditions screen will be connected here.',
                  )
                }
              />
            </Animated.View>

            {/* ==================================================
                LOGOUT
            ================================================== */}

            <Animated.View
              style={[
                styles.logoutCard,
                {
                  opacity: cardsOpacity,
                },
              ]}>
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

                <Ionicons name="chevron-forward" size={18} color="#B0B0B0" />
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.bottomSpace} />
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

/*
|--------------------------------------------------------------------------
| SUMMARY ITEM
|--------------------------------------------------------------------------
*/

function SummaryItem({ icon, value, label, valueColor }) {
  return (
    <View style={styles.summaryItem}>
      <View style={styles.summaryIcon}>
        <Ionicons name={icon} size={17} color={COLORS.primary} />
      </View>

      <Text
        style={[
          styles.summaryValue,
          valueColor && {
            color: valueColor,
          },
        ]}>
        {value}
      </Text>

      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

/*
|--------------------------------------------------------------------------
| SECTION HEADER
|--------------------------------------------------------------------------
*/

function SectionHeader({ icon, title, subtitle }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIcon}>
        <Ionicons name={icon} size={18} color={COLORS.primary} />
      </View>

      <View style={styles.sectionText}>
        <Text style={styles.sectionTitle}>{title}</Text>

        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      </View>
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
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.inputWrapper, !editable && styles.readOnlyInput]}>
        <Ionicons
          name={icon}
          size={16}
          color={editable ? '#777777' : '#9C9C9C'}
          style={styles.inputIcon}
        />

        <TextInput
          value={value || ''}
          onChangeText={onChangeText}
          editable={editable}
          keyboardType={keyboardType}
          placeholder={label}
          placeholderTextColor="#A1A1A1"
          style={styles.input}
        />
      </View>
    </View>
  );
}

/*
|--------------------------------------------------------------------------
| ACCOUNT ACTION
|--------------------------------------------------------------------------
*/

function AccountAction({ icon, title, subtitle, onPress }) {
  return (
    <TouchableOpacity
      style={styles.accountAction}
      onPress={onPress}
      activeOpacity={0.75}>
      <View style={styles.accountActionIcon}>
        <Ionicons name={icon} size={18} color={COLORS.primary} />
      </View>

      <View style={styles.accountActionContent}>
        <Text style={styles.accountActionTitle}>{title}</Text>

        <Text style={styles.accountActionSubtitle}>{subtitle}</Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#B0B0B0" />
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

  scrollContent: {
    paddingBottom: 28,
  },

  /*
    |--------------------------------------------------------------------------
    | HERO
    |--------------------------------------------------------------------------
    */

  hero: {
    backgroundColor: COLORS.white,
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEDEA',
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  iconButton: {
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: '#F8F7F5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },

  avatarContainer: {
    alignSelf: 'center',
    marginTop: 19,
    position: 'relative',
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primary,
    borderWidth: 5,
    borderColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    fontSize: 33,
    fontWeight: '700',
    color: COLORS.white,
  },

  verifiedCircle: {
    position: 'absolute',
    right: 0,
    bottom: 1,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 3,
    borderColor: COLORS.white,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileName: {
    marginTop: 11,
    fontSize: 21,
    textAlign: 'center',
    fontWeight: '700',
    color: COLORS.text,
  },

  username: {
    marginTop: 2,
    fontSize: 11.5,
    textAlign: 'center',
    color: COLORS.secondary,
  },

  roleBadge: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
  },

  roleText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.primaryDark,
    letterSpacing: 0.5,
  },

  /*
    |--------------------------------------------------------------------------
    | SUMMARY
    |--------------------------------------------------------------------------
    */

  summaryCard: {
    marginHorizontal: 18,
    marginTop: 14,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.035,
    shadowRadius: 7,
    elevation: 2,
  },

  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },

  summaryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },

  summaryValue: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.text,
  },

  summaryLabel: {
    marginTop: 1,
    fontSize: 8.5,
    color: COLORS.secondary,
  },

  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#EEEEEE',
  },

  /*
    |--------------------------------------------------------------------------
    | CARDS
    |--------------------------------------------------------------------------
    */

  card: {
    marginHorizontal: 18,
    marginTop: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 17,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.03,
    shadowRadius: 7,
    elevation: 1,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  sectionIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  sectionText: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },

  sectionSubtitle: {
    marginTop: 1,
    fontSize: 9.5,
    color: COLORS.secondary,
  },

  /*
    |--------------------------------------------------------------------------
    | FIELDS
    |--------------------------------------------------------------------------
    */

  field: {
    marginBottom: 11,
  },

  label: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#4B4B4B',
    marginBottom: 5,
  },

  emailLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: COLORS.successLight,
  },

  verifiedText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: COLORS.success,
  },

  inputWrapper: {
    height: 44,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#ECEAE7',
    backgroundColor: COLORS.input,
    flexDirection: 'row',
    alignItems: 'center',
  },

  readOnlyInput: {
    backgroundColor: '#F3F2F0',
  },

  lockedInput: {
    backgroundColor: '#F1F0EE',
  },

  inputIcon: {
    marginLeft: 12,
    marginRight: 4,
  },

  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 9,
    fontSize: 11,
    color: '#333333',
  },

  helper: {
    marginTop: 4,
    fontSize: 8.5,
    color: COLORS.light,
  },

  twoColumn: {
    flexDirection: 'row',
    gap: 9,
  },

  column: {
    flex: 1,
  },

  /*
    |--------------------------------------------------------------------------
    | ACCOUNT ACTIONS
    |--------------------------------------------------------------------------
    */

  accountAction: {
    minHeight: 57,
    flexDirection: 'row',
    alignItems: 'center',
  },

  accountActionIcon: {
    width: 35,
    height: 35,
    borderRadius: 11,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  accountActionContent: {
    flex: 1,
  },

  accountActionTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.text,
  },

  accountActionSubtitle: {
    marginTop: 2,
    fontSize: 9,
    color: COLORS.secondary,
  },

  actionDivider: {
    height: 1,
    backgroundColor: '#F1F0EE',
    marginVertical: 2,
  },

  /*
    |--------------------------------------------------------------------------
    | SAVE
    |--------------------------------------------------------------------------
    */

  actions: {
    marginHorizontal: 18,
    marginTop: 13,
  },

  saveButton: {
    height: 48,
    borderRadius: 24,
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

  saveText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },

  cancelButton: {
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    color: COLORS.primaryDark,
    fontSize: 10.5,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

  logoutCard: {
    marginHorizontal: 18,
    marginTop: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#F0D8D8',
    borderRadius: 17,
    overflow: 'hidden',
  },

  logoutButton: {
    minHeight: 61,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoutIcon: {
    width: 35,
    height: 35,
    borderRadius: 11,
    backgroundColor: COLORS.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  logoutContent: {
    flex: 1,
  },

  logoutTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.danger,
  },

  logoutSubtitle: {
    marginTop: 2,
    fontSize: 9,
    color: COLORS.secondary,
  },

  bottomSpace: {
    height: 15,
  },
});
