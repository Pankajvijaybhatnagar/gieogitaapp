import { DESIGN } from '@/constants/design';
// app/join-gieo-gita/index.jsx

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, Stack, useRouter } from 'expo-router';

import ListBottomSheet from '@/components/ui/ListBottomSheet';
import { COLORS as BASE, RGB } from '@/constants/brandColors';
import { hairline, radii, shadow, spacing } from '@/constants/theme';
import { useAppAlert } from '@/context/AppAlertContext';
import { useHeaderScrollProps } from '@/context/HeaderScrollContext';
import joinGieoGitaServices from '@/lib/services/joinGieoGitaServices';

/* ============================================================
   SCREEN
============================================================ */

/* ============================================================
   COLORS
============================================================ */

const COLORS = {
  background: BASE.creamDark,
  card: BASE.cream,
  input: BASE.creamDark,

  brown: BASE.richBrown,
  darkBrown: BASE.deepBrown,
  mediumBrown: BASE.warmBrown,

  gold: BASE.gold,
  goldLight: BASE.goldLight,

  text: BASE.deepBrown,
  muted: BASE.warmBrown,

  border: hairline,
  lightBorder: hairline,

  white: BASE.white,

  green: '#3F7C4D',
  greenBg: '#EDF7EF',

  red: BASE.dangerRed,
  redBg: `rgba(${RGB.dangerRed},0.08)`,
};

/* ============================================================
   STATIC OPTIONS
============================================================ */

const MARITAL_OPTIONS = ['Single', 'Married'];

const DIKSHIT_OPTIONS = ['Yes', 'No', 'No, But Interested'];

const WING_OPTIONS = [
  'GIEO Gita',
  'जीओ गीता महिला मंडल',
  'जीओ गीता युवा चेतना',
  'जीओ गीता सत्संग मंडल',
];

/* ============================================================
   DEBUG
============================================================ */

const DEBUG_LOCATION = true;

const locationLog = (label, data) => {
  if (!DEBUG_LOCATION) return;

  console.log(`[JOIN-GIEO-GITA][LOCATION] ${label}`, data);
};

/* ============================================================
   TIMEZONE → COUNTRY
============================================================ */

const TIMEZONE_COUNTRY_MAP = {
  'Asia/Kolkata': 'India',
  'Asia/Calcutta': 'India',

  'Asia/Dubai': 'United Arab Emirates',

  'Asia/Riyadh': 'Saudi Arabia',

  'Asia/Dhaka': 'Bangladesh',

  'Asia/Kathmandu': 'Nepal',

  'Asia/Colombo': 'Sri Lanka',

  'Asia/Singapore': 'Singapore',

  'Asia/Kuala_Lumpur': 'Malaysia',

  'Asia/Bangkok': 'Thailand',

  'Asia/Jakarta': 'Indonesia',

  'Asia/Manila': 'Philippines',

  'Asia/Tokyo': 'Japan',

  'Asia/Seoul': 'South Korea',

  'Asia/Shanghai': 'China',

  'Europe/London': 'United Kingdom',

  'Europe/Paris': 'France',

  'Europe/Berlin': 'Germany',

  'Europe/Rome': 'Italy',

  'Europe/Madrid': 'Spain',

  'America/New_York': 'United States',

  'America/Chicago': 'United States',

  'America/Denver': 'United States',

  'America/Los_Angeles': 'United States',

  'America/Toronto': 'Canada',

  'America/Vancouver': 'Canada',

  'Australia/Sydney': 'Australia',

  'Australia/Melbourne': 'Australia',

  'Pacific/Auckland': 'New Zealand',
};

/* ============================================================
   COUNTRY DETECTION
============================================================ */

function detectCountryFromTimezone() {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const country = TIMEZONE_COUNTRY_MAP[timezone] || '';

    locationLog('Device timezone', timezone);

    locationLog('Detected country', country);

    return country;
  } catch (error) {
    console.log('[JOIN-GIEO-GITA] Country detection failed:', error);

    return '';
  }
}

/* ============================================================
   GENERIC ARRAY NORMALIZER
============================================================ */

function normalizeArray(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'object') {
    return Object.values(value);
  }

  return [];
}

/* ============================================================
   EXTRACT LOCATION ARRAY
   ------------------------------------------------------------
   Supports multiple API response structures.
============================================================ */

function extractLocationList(response, level) {
  locationLog(`Raw ${level} response`, response);

  if (!response) {
    return [];
  }

  /*
   * If apiRequest returns:
   *
   * {
   *   success: true,
   *   data: [...]
   * }
   */

  let root = response;

  if (response.data !== undefined && response.data !== null) {
    root = response.data;
  }

  /*
   * Some APIs return:
   *
   * {
   *   data: {
   *      countries: [...]
   *   }
   * }
   */

  if (root && typeof root === 'object' && !Array.isArray(root)) {
    const possibleKeys = [
      level,
      `${level}s`,
      'data',
      'results',
      'items',
      'options',
      'locations',
    ];

    for (const key of possibleKeys) {
      if (root[key] !== undefined) {
        const result = normalizeArray(root[key]);

        if (result.length) {
          root = result;
          break;
        }
      }
    }
  }

  const array = normalizeArray(root);

  const normalized = array
    .map(item => {
      /*
       * String:
       *
       * "India"
       */
      if (typeof item === 'string') {
        return item.trim();
      }

      /*
       * Object:
       *
       * {
       *   name: "India"
       * }
       *
       * or
       *
       * {
       *   label: "India"
       * }
       */

      if (item && typeof item === 'object') {
        return (
          item.name ??
          item.label ??
          item.value ??
          item.title ??
          item.country ??
          item.state ??
          item.district ??
          item.city ??
          item.tehsil ??
          ''
        )
          .toString()
          .trim();
      }

      return '';
    })
    .filter(Boolean);

  /*
   * Remove duplicates.
   */

  return [...new Set(normalized)];
}

/* ============================================================
   DATE
============================================================ */

function formatDate(date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function parseDate(value) {
  if (!value) {
    return new Date();
  }

  const parts = value.split('-');

  if (parts.length !== 3) {
    return new Date();
  }

  const result = new Date(
    Number(parts[0]),
    Number(parts[1]) - 1,
    Number(parts[2]),
  );

  return Number.isNaN(result.getTime()) ? new Date() : result;
}

/* ============================================================
   SECTION
============================================================ */

function Section({ title, icon, children, delay = 0 }) {
  const opacity = useRef(new Animated.Value(0)).current;

  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        styles.sectionCard,
        {
          opacity,
          transform: [
            {
              translateY,
            },
          ],
        },
      ]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <Ionicons name={icon} size={17} color={COLORS.white} />
        </View>

        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      {children}
    </Animated.View>
  );
}

/* ============================================================
   LABEL
============================================================ */

function Label({ children, required = true }) {
  return (
    <Text style={styles.label}>
      {children}

      {required && <Text style={styles.required}> *</Text>}
    </Text>
  );
}

/* ============================================================
   TEXT INPUT
============================================================ */

function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize = 'sentences',
  required = true,
  multiline = false,
  right,
  maxLength,
}) {
  return (
    <View style={styles.field}>
      <Label required={required}>{label}</Label>

      <View
        style={[styles.inputContainer, multiline && styles.multilineContainer]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          placeholderTextColor={COLORS.muted}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          maxLength={maxLength}
          style={[styles.textInput, multiline && styles.multilineInput]}
        />

        {right}
      </View>
    </View>
  );
}

/* ============================================================
   BOTTOM OPTION SHEET
   ------------------------------------------------------------
   MINIMUM = 40%
   MAXIMUM = 75%
============================================================ */

/* ============================================================
   SELECT FIELD
============================================================ */

function SelectField({
  label,
  value,
  options,
  onSelect,
  placeholder = 'Select',
  disabled = false,
  loading = false,
  required = true,
  hint,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <View style={styles.field}>
        <Label required={required}>{label}</Label>

        <Pressable
          disabled={disabled || loading}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setVisible(true);
          }}
          style={({ pressed }) => [
            styles.inputContainer,
            styles.selectContainer,

            disabled && styles.disabledInput,

            pressed && !disabled && styles.pressedInput,
          ]}>
          <Text
            numberOfLines={1}
            style={[styles.selectText, !value && styles.placeholder]}>
            {value || placeholder}
          </Text>

          <View style={styles.fieldTrailingBadge}>
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.brown} />
            ) : (
              <Ionicons
                name="chevron-down"
                size={15}
                color={disabled ? COLORS.muted : COLORS.brown}
              />
            )}
          </View>
        </Pressable>

        {disabled && hint ? (
          <View style={styles.fieldHintRow}>
            <Ionicons
              name="information-circle"
              size={13}
              color={COLORS.muted}
            />
            <Text style={styles.fieldHintText}>{hint}</Text>
          </View>
        ) : null}
      </View>

      <ListBottomSheet
        visible={visible}
        title={label}
        options={options || []}
        value={value}
        loading={loading}
        onClose={() => setVisible(false)}
        onSelect={item => {
          onSelect(item);
          setVisible(false);
        }}
      />
    </>
  );
}

/* ============================================================
   DATE FIELD
============================================================ */

function DateField({ label, value, onChange, maximumDate }) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={styles.field}>
      <Label>{label}</Label>

      <Pressable
        onPress={() => setShowPicker(true)}
        style={({ pressed }) => [
          styles.inputContainer,
          styles.dateContainer,

          pressed && styles.pressedInput,
        ]}>
        <Text style={[styles.dateText, !value && styles.placeholder]}>
          {value || `Select ${label}`}
        </Text>

        <View style={styles.fieldTrailingBadge}>
          <Ionicons name="calendar-outline" size={15} color={COLORS.brown} />
        </View>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={parseDate(value)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          themeVariant="light"
          accentColor={COLORS.brown}
          textColor={COLORS.text}
          maximumDate={maximumDate}
          onChange={(event, selectedDate) => {
            setShowPicker(false);

            if (event?.type === 'dismissed') {
              return;
            }

            if (selectedDate) {
              onChange(formatDate(selectedDate));
            }
          }}
        />
      )}
    </View>
  );
}

/* ============================================================
   CHECKBOX
============================================================ */

function Checkbox({ checked, onPress }) {
  const scale = useRef(new Animated.Value(checked ? 1 : 0.85)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: checked ? 1 : 0.85,
      friction: 5,
      tension: 150,
      useNativeDriver: true,
    }).start();
  }, [checked]);

  return (
    <Pressable onPress={onPress} style={styles.termsRow}>
      <Animated.View
        style={[
          styles.checkbox,
          checked && styles.checkboxChecked,
          {
            transform: [
              {
                scale,
              },
            ],
          },
        ]}>
        {checked && (
          <Ionicons name="checkmark" size={14} color={COLORS.white} />
        )}
      </Animated.View>

      <Text style={styles.termsText}>
        I agree to the <Text style={styles.termsLink}>Terms</Text> and{' '}
        <Text style={styles.termsLink}>Privacy Policy</Text>
      </Text>
    </Pressable>
  );
}

/* ============================================================
   MAIN
============================================================ */

export default function JoinGieoGitaScreen() {
  const router = useRouter();
  const { success: showSuccessAlert } = useAppAlert();
  const headerScrollProps = useHeaderScrollProps();

  /* ----------------------------------------------------------
     FORM
  ---------------------------------------------------------- */

  const [formData, setFormData] = useState({
    country: '',
    name: '',
    whatsapp: '',
    dikshit: '',
    state: '',
    district: '',
    tehsil: '',
    address: '',
    occupation: '',
    education: '',
    maritalStatus: '',
    email: '',
    dob: '',
    anniver_date: '',
    interest: '',
    terms: false,
  });

  /* ----------------------------------------------------------
     LOCATION
  ---------------------------------------------------------- */

  const [countries, setCountries] = useState([]);

  const [states, setStates] = useState([]);

  const [districts, setDistricts] = useState([]);

  const [tehsils, setTehsils] = useState([]);

  /* ----------------------------------------------------------
     OTHER OPTIONS
  ---------------------------------------------------------- */

  const [occupations, setOccupations] = useState([]);

  const [educations, setEducations] = useState([]);

  /* ----------------------------------------------------------
     LOADING
  ---------------------------------------------------------- */

  const [loadingCountries, setLoadingCountries] = useState(false);

  const [loadingStates, setLoadingStates] = useState(false);

  const [loadingDistricts, setLoadingDistricts] = useState(false);

  const [loadingTehsils, setLoadingTehsils] = useState(false);

  const [loadingOtherOptions, setLoadingOtherOptions] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [checkingPhone, setCheckingPhone] = useState(false);

  const [existingProfile, setExistingProfile] = useState(null);
  const [existingProfileData, setExistingProfileData] = useState({});

  const [error, setError] = useState('');

  /* ==========================================================
     UPDATE FIELD
  ========================================================== */

  const updateField = useCallback((key, value) => {
    setError('');

    setFormData(previous => ({
      ...previous,
      [key]: value,
    }));
  }, []);

  /* ==========================================================
     COUNTRY
  ========================================================== */

  const loadCountries = useCallback(async () => {
    try {
      setLoadingCountries(true);

      locationLog('Loading countries...');

      /*
       * IMPORTANT:
       * This uses the service method.
       */

      const response = await joinGieoGitaServices.getLocationOptions();

      const list = extractLocationList(response, 'country');

      locationLog('Countries extracted', list);

      setCountries(list);

      return list;
    } catch (error) {
      console.log('[JOIN-GIEO-GITA] Countries API ERROR:', error);

      setCountries([]);

      return [];
    } finally {
      setLoadingCountries(false);
    }
  }, []);

  /* ==========================================================
     STATES
========================================================== */

  const loadStates = useCallback(async country => {
    if (!country) {
      return;
    }

    try {
      setLoadingStates(true);

      locationLog('Loading states for country', country);

      const response = await joinGieoGitaServices.getLocationOptions(country);

      const list = extractLocationList(response, 'state');

      locationLog(`States for ${country}`, list);

      setStates(list);
    } catch (error) {
      console.log('[JOIN-GIEO-GITA] States API ERROR:', error);

      setStates([]);
    } finally {
      setLoadingStates(false);
    }
  }, []);

  /* ==========================================================
     DISTRICTS
========================================================== */

  const loadDistricts = useCallback(async (country, state) => {
    if (!country || !state) {
      return;
    }

    try {
      setLoadingDistricts(true);

      locationLog('Loading districts', {
        country,
        state,
      });

      const response = await joinGieoGitaServices.getLocationOptions(
        country,
        state,
      );

      const list = extractLocationList(response, 'district');

      locationLog('Districts extracted', list);

      setDistricts(list);
    } catch (error) {
      console.log('[JOIN-GIEO-GITA] District API ERROR:', error);

      setDistricts([]);
    } finally {
      setLoadingDistricts(false);
    }
  }, []);

  /* ==========================================================
     TEHSIL / CITY
========================================================== */

  const loadTehsils = useCallback(async (country, state, district) => {
    if (!country || !state || !district) {
      return;
    }

    try {
      setLoadingTehsils(true);

      locationLog('Loading tehsil/city', {
        country,
        state,
        district,
      });

      const response = await joinGieoGitaServices.getLocationOptions(
        country,
        state,
        district,
      );

      const list = extractLocationList(response, 'tehsil');

      locationLog('Tehsil/city extracted', list);

      setTehsils(list);
    } catch (error) {
      console.log('[JOIN-GIEO-GITA] Tehsil API ERROR:', error);

      setTehsils([]);
    } finally {
      setLoadingTehsils(false);
    }
  }, []);

  /* ==========================================================
     INITIAL LOCATION
========================================================== */

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      locationLog('========== LOCATION INITIALIZATION ==========');

      const list = await loadCountries();

      if (!mounted) {
        return;
      }

      locationLog('Country list received', list);

      /*
       * Don't depend on automatic detection.
       *
       * First show country list.
       */

      const detected = detectCountryFromTimezone();

      if (!detected) {
        locationLog('No country detected automatically');

        return;
      }

      const matching = list.find(
        item => item.toLowerCase() === detected.toLowerCase(),
      );

      if (matching) {
        locationLog('Automatic country selected', matching);

        setFormData(previous => ({
          ...previous,
          country: matching,
        }));

        await loadStates(matching);
      } else {
        locationLog('Detected country not found in API list', {
          detected,
          availableCountries: list,
        });
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [loadCountries, loadStates]);

  /* ==========================================================
     OTHER OPTIONS
========================================================== */

  useEffect(() => {
    let mounted = true;

    const loadOptions = async () => {
      try {
        setLoadingOtherOptions(true);

        const [occupationResponse, educationResponse] = await Promise.all([
          joinGieoGitaServices.getOccupationOptions(),
          joinGieoGitaServices.getEducationOptions(),
        ]);

        if (!mounted) {
          return;
        }

        const occupationList = extractLocationList(
          occupationResponse,
          'occupation',
        );

        const educationList = extractLocationList(
          educationResponse,
          'education',
        );

        setOccupations(occupationList);

        setEducations(educationList);
      } catch (error) {
        console.log('[JOIN-GIEO-GITA] Occupation/Education ERROR:', error);
      } finally {
        if (mounted) {
          setLoadingOtherOptions(false);
        }
      }
    };

    loadOptions();

    return () => {
      mounted = false;
    };
  }, []);

  /* ==========================================================
     COUNTRY CHANGE
========================================================== */

  const handleCountryChange = async country => {
    locationLog('USER SELECTED COUNTRY', country);

    setFormData(previous => ({
      ...previous,
      country,
      state: '',
      district: '',
      tehsil: '',
    }));

    setStates([]);
    setDistricts([]);
    setTehsils([]);

    await loadStates(country);
  };

  /* ==========================================================
     STATE CHANGE
========================================================== */

  const handleStateChange = async state => {
    locationLog('USER SELECTED STATE', state);

    const country = formData.country;

    setFormData(previous => ({
      ...previous,
      state,
      district: '',
      tehsil: '',
    }));

    setDistricts([]);
    setTehsils([]);

    await loadDistricts(country, state);
  };

  /* ==========================================================
     DISTRICT CHANGE
========================================================== */

  const handleDistrictChange = async district => {
    locationLog('USER SELECTED DISTRICT', district);

    const country = formData.country;

    const state = formData.state;

    setFormData(previous => ({
      ...previous,
      district,
      tehsil: '',
    }));

    setTehsils([]);

    await loadTehsils(country, state, district);
  };

  /* ==========================================================
     PHONE
========================================================== */

  const handlePhoneChange = async value => {
    const digits = value.replace(/\D/g, '');

    updateField('whatsapp', digits);

    setExistingProfile(null);

    if (digits.length < 10) {
      return;
    }

    try {
      setCheckingPhone(true);

      const response = await joinGieoGitaServices.getProfileByPhone(digits);

      console.log('[JOIN-GIEO-GITA] Phone check:', response);

      const profile = response?.data?.data || response?.data || null;

      if (profile && typeof profile === 'object') {
        setExistingProfile(response.success);
        setExistingProfileData(profile);
      }
    } catch (error) {
      console.log('[JOIN-GIEO-GITA] Phone check error:', error);
    } finally {
      setCheckingPhone(false);
    }
  };

  /* ==========================================================
     VALIDATE
========================================================== */

  const validate = () => {
    const required = [
      ['name', 'Full Name'],
      ['whatsapp', 'WhatsApp Number'],
      ['dikshit', 'Dikshit'],
      ['country', 'Country'],
      ['state', 'State'],
      ['district', 'District'],
      ['tehsil', 'Tehsil'],
      ['address', 'Address'],
      ['occupation', 'Occupation'],
      ['education', 'Education'],
      ['maritalStatus', 'Marital Status'],
      ['dob', 'Date of Birth'],
      ['interest', 'Wing'],
    ];

    for (const [key, label] of required) {
      if (!String(formData[key] || '').trim()) {
        setError(`${label} is required.`);

        return false;
      }
    }

    if (formData.maritalStatus === 'Married' && !formData.anniver_date) {
      setError('Anniversary Date is required.');

      return false;
    }

    if (!formData.terms) {
      setError('Please accept the Terms and Privacy Policy.');

      return false;
    }

    return true;
  };

  /* ==========================================================
     SUBMIT
========================================================== */

  const handleSubmit = async () => {
    if (submitting) {
      return;
    }

    setError('');

    if (!validate()) {
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        country: formData.country,

        name: formData.name,

        phone: formData.whatsapp,

        email: formData.email,

        dikshit: formData.dikshit,

        married: formData.maritalStatus,

        state: formData.state,

        district: formData.district,

        tehsil: formData.tehsil,

        address: formData.address,

        occupation: formData.occupation,

        education: formData.education,

        dob: formData.dob,

        aniver_date: formData.anniver_date || '',

        interest: formData.interest || '',
      };

      console.log('================================');

      console.log('[JOIN-GIEO-GITA] SUBMIT PAYLOAD:', payload);

      console.log('================================');

      const response = await joinGieoGitaServices.createProfile(payload);

      console.log('[JOIN-GIEO-GITA] CREATE RESPONSE:', response);

      if (!response?.success) {
        throw new Error(response?.error || 'Unable to create profile.');
      }

      const hashId = response?.data?.hash_id;

      if (hashId) {
        router.push(`/home/(tabs)/join-gieo-gita/${hashId}`);
      } else {
        showSuccessAlert(
          'Success',
          'Your GIEO Gita profile has been created successfully.',
        );
      }
    } catch (error) {
      console.log('[JOIN-GIEO-GITA] SUBMIT ERROR:', error);

      setError(error?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ==========================================================
     RENDER
========================================================== */

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Join GIEO Gita',
          headerShown: true,

          headerStyle: {
            backgroundColor: COLORS.card,
          },

          headerTintColor: COLORS.darkBrown,

          headerTitleStyle: {
            fontSize: 17,
            fontWeight: '700',
          },

          headerShadowVisible: false,
        }}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
          {...headerScrollProps}>
          {/* HERO */}

          <View style={styles.hero}>
            <View style={styles.heroBanner}>
              <View style={styles.heroPatternOne} />
              <View style={styles.heroPatternTwo} />
              <Text style={styles.heroOm}>ॐ</Text>
            </View>

            <View style={styles.heroIconRing}>
              <View style={styles.heroIcon}>
                <Ionicons
                  name="people-outline"
                  size={28}
                  color={COLORS.white}
                />
              </View>
            </View>

            <Text style={styles.heroTitle}>Join GIEO Gita</Text>

            <View style={styles.heroDivider} />

            <Text style={styles.heroSubtitle}>
              Become a part of the GIEO Gita family
            </Text>
          </View>

          {/* =================================================
              PERSONAL
          ================================================= */}

          <Section title="Personal Details" icon="person-outline" delay={40}>
            <TextField
              label="Full Name"
              value={formData.name}
              onChangeText={value => updateField('name', value)}
              placeholder="Enter full name"
            />

            <TextField
              label="Email"
              value={formData.email}
              onChangeText={value => updateField('email', value)}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
              required={false}
            />

            <TextField
              label="WhatsApp Number"
              value={formData.whatsapp}
              onChangeText={handlePhoneChange}
              placeholder="Enter WhatsApp number"
              keyboardType="phone-pad"
              maxLength={15}
              autoCapitalize="none"
              right={
                checkingPhone ? (
                  <View style={styles.fieldTrailingBadge}>
                    <ActivityIndicator size="small" color={COLORS.brown} />
                  </View>
                ) : null
              }
            />

            {existingProfile ? (
              <View style={styles.profileExists}>
                <Ionicons
                  name="checkmark-circle"
                  size={19}
                  color={COLORS.green}
                />

                <Text style={styles.profileExistsText}>
                  Profile already exists for this number.{' '}
                  <Link
                    href={`/home/join-gieo-gita/${existingProfileData?.hash_id}`}>
                    View
                  </Link>
                </Text>
              </View>
            ) : null}

            <SelectField
              label="Dikshit"
              value={formData.dikshit}
              options={DIKSHIT_OPTIONS}
              onSelect={value => updateField('dikshit', value)}
            />

            <SelectField
              label="Marital Status"
              value={formData.maritalStatus}
              options={MARITAL_OPTIONS}
              onSelect={value => {
                updateField('maritalStatus', value);

                if (value !== 'Married') {
                  updateField('anniver_date', '');
                }
              }}
            />

            <DateField
              label="Date of Birth"
              value={formData.dob}
              onChange={value => updateField('dob', value)}
              maximumDate={new Date()}
            />

            {formData.maritalStatus === 'Married' ? (
              <DateField
                label="Anniversary Date"
                value={formData.anniver_date}
                onChange={value => updateField('anniver_date', value)}
                maximumDate={new Date()}
              />
            ) : null}
          </Section>

          {/* =================================================
              LOCATION
          ================================================= */}

          <Section title="Location" icon="location-outline" delay={100}>
            <SelectField
              label="Country"
              value={formData.country}
              options={countries}
              loading={loadingCountries}
              onSelect={handleCountryChange}
            />

            <SelectField
              label="State"
              value={formData.state}
              options={states}
              loading={loadingStates}
              disabled={!formData.country}
              hint="Select Country first"
              onSelect={handleStateChange}
            />

            <SelectField
              label="District"
              value={formData.district}
              options={districts}
              loading={loadingDistricts}
              disabled={!formData.state}
              hint="Select State first"
              onSelect={handleDistrictChange}
            />

            <SelectField
              label="City / Tehsil"
              value={formData.tehsil}
              options={tehsils}
              loading={loadingTehsils}
              disabled={!formData.district}
              hint="Select District first"
              onSelect={value => updateField('tehsil', value)}
            />

            <TextField
              label="Address"
              value={formData.address}
              onChangeText={value => updateField('address', value)}
              placeholder="Enter address"
              multiline
            />
          </Section>

          {/* =================================================
              PROFESSIONAL
          ================================================= */}

          <Section
            title="Professional Details"
            icon="briefcase-outline"
            delay={160}>
            <SelectField
              label="Occupation"
              value={formData.occupation}
              options={occupations}
              loading={loadingOtherOptions}
              onSelect={value => updateField('occupation', value)}
            />

            <SelectField
              label="Education"
              value={formData.education}
              options={educations}
              loading={loadingOtherOptions}
              onSelect={value => updateField('education', value)}
            />
          </Section>

          {/* =================================================
              GIEO GITA
          ================================================= */}

          <Section title="GIEO Gita" icon="heart-outline" delay={220}>
            <SelectField
              label="Wing"
              value={formData.interest}
              options={WING_OPTIONS}
              onSelect={value => updateField('interest', value)}
            />
          </Section>

          {/* TERMS */}

          <Checkbox
            checked={formData.terms}
            onPress={() => updateField('terms', !formData.terms)}
          />

          {/* ERROR */}

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color={COLORS.red}
              />

              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* SUBMIT */}

          <Pressable
            onPress={handleSubmit}
            disabled={submitting || existingProfile}
            style={({ pressed }) => [
              styles.submitButton,

              pressed && !submitting && styles.submitPressed,

              submitting && styles.submitDisabled,
            ]}>
            <LinearGradient
              colors={[COLORS.mediumBrown, COLORS.brown, COLORS.darkBrown]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.submitGradient}>
              {submitting ? (
                <>
                  <ActivityIndicator size="small" color={COLORS.white} />

                  <Text style={styles.submitText}>Submitting...</Text>
                </>
              ) : (
                <>
                  <Text style={styles.submitText}>Join GIEO Gita</Text>

                  <View style={styles.submitArrowBadge}>
                    <Ionicons
                      name="arrow-forward"
                      size={16}
                      color={COLORS.brown}
                    />
                  </View>
                </>
              )}
            </LinearGradient>
          </Pressable>

          <Text style={styles.footer}>
            GIEO Gita • Spreading the message of Shri Bhagavad Gita
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

/* ============================================================
   STYLES
============================================================ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },

  /* HERO */

  hero: {
    alignItems: 'center',
    // Cancels the scroll content's own horizontal padding so the banner
    // can bleed edge-to-edge instead of sitting as an inset rectangle.
    marginHorizontal: -spacing.md,
    paddingBottom: spacing.lg,
    marginBottom: spacing.sm,
  },
  heroBanner: {
    width: '100%',
    height: 118,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPatternOne: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: `rgba(${RGB.gold}, 0.12)`,
    top: -60,
    left: -45,
  },
  heroPatternTwo: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: `rgba(${RGB.saffron}, 0.08)`,
    right: -75,
    top: -85,
  },
  heroOm: {
    color: `rgba(${RGB.gold}, 0.16)`,
    fontSize: 64,
    fontWeight: '700',
  },
  heroIconRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -44,
    ...shadow.raised,
    shadowColor: COLORS.brown,
  },
  heroIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.brown,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.card,
  },
  heroTitle: {
    marginTop: spacing.sm,
    fontSize: 24,
    fontWeight: '400',
    color: COLORS.darkBrown,
    fontFamily: DESIGN.fonts.editorial,
    letterSpacing: -0.4,
  },
  heroDivider: {
    width: 40,
    height: 3,
    borderRadius: radii.pill,
    backgroundColor: COLORS.gold,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
    paddingHorizontal: spacing.lg,
    textAlign: 'center',
  },
  /* SECTION */

  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.brown,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    ...shadow.card,
    shadowColor: COLORS.brown,
  },
  sectionTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: COLORS.darkBrown,
  },
  /* FIELDS */

  field: {
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 5,
    paddingLeft: 1,
  },
  required: {
    color: COLORS.red,
  },
  inputContainer: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: radii.lg,
    backgroundColor: COLORS.card,
    paddingHorizontal: spacing.sm + 2,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.darkBrown,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  textInput: {
    flex: 1,
    minHeight: 46,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 4,
  },
  multilineContainer: {
    minHeight: 67,
    alignItems: 'flex-start',
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: 'top',
    paddingTop: 7,
  },
  /* SELECT */

  selectContainer: {
    position: 'relative',
    paddingRight: spacing.xl + spacing.sm,
    borderWidth: 1,
    borderColor: COLORS.brown,
    borderRadius: radii.lg,
    backgroundColor: COLORS.card,
  },
  fieldTrailingBadge: {
    width: 28,
    height: 46,
    position: 'absolute',
    right: spacing.sm + 2,
    top: 2,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectText: {
    flex: 1,
    minHeight: 46,
    fontSize: 15,
    fontWeight: '400',
    color: COLORS.text,
    paddingVertical: 4,
  },
  placeholder: {
    color: COLORS.muted,
    fontWeight: '400',
  },
  fieldHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 5,
    paddingLeft: 1,
  },
  fieldHintText: {
    fontSize: 11,
    color: COLORS.muted,
  },
  disabledInput: {
    backgroundColor: COLORS.background,
    opacity: 0.62,
  },
  pressedInput: {
    borderColor: COLORS.brown,
    borderWidth: 1.5,
    backgroundColor: COLORS.background,
  },
  /* DATE */

  dateContainer: {
    position: 'relative',
    paddingRight: spacing.xl + spacing.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: radii.lg,
    backgroundColor: COLORS.card,
  },
  dateText: {
    flex: 1,
    minHeight: 46,
    fontSize: 15,
    fontWeight: '400',
    color: COLORS.text,
    paddingVertical: 4,
  },
  /* PROFILE */

  profileExists: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.greenBg,
    borderWidth: 1,
    borderColor: '#CDE1D1',
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  profileExistsText: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 12,
    color: COLORS.green,
    fontWeight: '700',
    lineHeight: 18,
  },
  /* ERROR */

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.redBg,
    borderWidth: 1,
    borderColor: `rgba(${RGB.dangerRed},0.3)`,
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  errorText: {
    flex: 1,
    marginLeft: spacing.sm,
    color: COLORS.red,
    fontSize: 12,
    lineHeight: 18,
  },
  /* TERMS */

  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: COLORS.brown,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  checkboxChecked: {
    backgroundColor: COLORS.brown,
    borderColor: COLORS.brown,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.text,
    marginLeft: 7,
    lineHeight: 18,
  },
  termsLink: {
    color: COLORS.brown,
    fontWeight: '600',
  },
  /* SUBMIT */

  submitButton: {
    borderRadius: radii.pill,
    overflow: 'hidden',
    ...shadow.raised,
    shadowColor: COLORS.brown,
    shadowOpacity: 0.32,
    shadowRadius: 16,
    minHeight: 58,
  },
  submitGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: spacing.lg,
  },
  submitArrowBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitPressed: {
    transform: [
      {
        scale: 0.985,
      },
    ],
    opacity: 0.92,
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  footer: {
    textAlign: 'center',
    fontSize: 11.5,
    fontWeight: '600',
    letterSpacing: 0.3,
    color: COLORS.goldDark,
    marginTop: spacing.lg,
  },
});
