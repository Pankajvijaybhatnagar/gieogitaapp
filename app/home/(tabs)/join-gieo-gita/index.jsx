import { useCallback, useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
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
import { Stack, useRouter } from 'expo-router';

import joinGieoGitaServices from '@/lib/services/joinGieoGitaServices';

/* ============================================================
   COLORS
============================================================ */

const COLORS = {
  bg: '#F6F0E8',
  card: '#FFFDF9',
  brown: '#5B321F',
  darkBrown: '#3B2115',
  brown2: '#75482F',
  gold: '#B88A48',
  goldLight: '#E9D5B7',

  text: '#3B2A21',
  muted: '#8D7A6E',

  border: '#DCC8B4',
  borderLight: '#EAE0D6',

  white: '#FFFFFF',

  success: '#3F7D50',
  successBg: '#EDF7EF',

  danger: '#B53B3B',
  dangerBg: '#FCEEEE',

  disabled: '#F0EBE5',
};

/* ============================================================
   CONSTANTS
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
   TIMEZONE → COUNTRY
   ------------------------------------------------------------
   The web version uses countries-and-timezones.
   We keep a lightweight mapping here so we don't need another
   dependency just for country detection.
============================================================ */

const TIMEZONE_COUNTRY_MAP = {
  'Asia/Kolkata': 'India',
  'Asia/Calcutta': 'India',

  'Asia/Dubai': 'United Arab Emirates',

  'Asia/Riyadh': 'Saudi Arabia',

  'Asia/Dhaka': 'Bangladesh',

  'Asia/Kathmandu': 'Nepal',

  'Asia/Colombo': 'Sri Lanka',

  'Asia/Karachi': 'Pakistan',

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
   HELPERS
============================================================ */

const getAutomaticCountry = () => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return TIMEZONE_COUNTRY_MAP[timezone] || '';
  } catch (error) {
    console.log('Timezone country detection failed:', error);
    return '';
  }
};

const normalizeOptions = data => {
  if (!Array.isArray(data)) return [];

  return data
    .map(item => {
      if (typeof item === 'string') {
        return item;
      }

      return item?.name || item?.label || item?.value || item?.country || '';
    })
    .filter(Boolean);
};

const formatDate = date => {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const parseDate = value => {
  if (!value) return new Date();

  const parts = value.split('-');

  if (parts.length !== 3) {
    return new Date();
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const day = Number(parts[2]);

  const result = new Date(year, month, day);

  return Number.isNaN(result.getTime()) ? new Date() : result;
};

/* ============================================================
   ANIMATED SECTION
============================================================ */

function AnimatedSection({ title, icon, children, delay = 0 }) {
  const opacity = useRef(new Animated.Value(0)).current;

  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.timing(translateY, {
          toValue: 0,
          duration: 420,
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
        styles.card,
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
          <Ionicons name={icon} size={17} color={COLORS.gold} />
        </View>

        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      {children}
    </Animated.View>
  );
}

/* ============================================================
   FIELD LABEL
============================================================ */

function FieldLabel({ label, required = true }) {
  return (
    <Text style={styles.label}>
      {label}

      {required && <Text style={styles.required}> *</Text>}
    </Text>
  );
}

/* ============================================================
   TEXT FIELD
============================================================ */

function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize = 'sentences',
  editable = true,
  multiline = false,
  maxLength,
  required = true,
  rightElement,
}) {
  return (
    <View style={styles.field}>
      <FieldLabel label={label} required={required} />

      <View
        style={[
          styles.inputBox,
          multiline && styles.inputBoxMultiline,
          !editable && styles.inputDisabled,
        ]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder || label}
          placeholderTextColor={COLORS.muted}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          multiline={multiline}
          maxLength={maxLength}
          style={[styles.input, multiline && styles.multilineInput]}
        />

        {rightElement}
      </View>
    </View>
  );
}

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
}) {
  const [visible, setVisible] = useState(false);

  const arrowRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(arrowRotation, {
      toValue: visible ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const rotate = arrowRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const open = () => {
    if (disabled || loading) return;

    setVisible(true);
  };

  const close = () => {
    setVisible(false);
  };

  return (
    <>
      <View style={styles.field}>
        <FieldLabel label={label} required={required} />

        <Pressable
          onPress={open}
          disabled={disabled || loading}
          style={({ pressed }) => [
            styles.inputBox,
            styles.selectBox,
            disabled && styles.inputDisabled,

            pressed && !disabled && styles.pressedInput,
          ]}>
          <Text
            numberOfLines={1}
            style={[styles.selectText, !value && styles.placeholder]}>
            {value || placeholder}
          </Text>

          {loading ? (
            <ActivityIndicator size="small" color={COLORS.gold} />
          ) : (
            <Animated.View
              style={{
                transform: [
                  {
                    rotate,
                  },
                ],
              }}>
              <Ionicons name="chevron-down" size={17} color={COLORS.brown} />
            </Animated.View>
          )}
        </Pressable>
      </View>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={close}>
        <Pressable style={styles.modalOverlay} onPress={close}>
          <Pressable
            style={styles.selectModal}
            onPress={event => event.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>

              <Pressable onPress={close} hitSlop={10}>
                <Ionicons name="close" size={21} color={COLORS.brown} />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              style={styles.optionsList}>
              {options?.length ? (
                options.map((option, index) => {
                  const selected = option === value;

                  return (
                    <Pressable
                      key={`${option}-${index}`}
                      onPress={() => {
                        onSelect(option);
                        close();
                      }}
                      style={({ pressed }) => [
                        styles.option,
                        selected && styles.optionSelected,
                        pressed && styles.optionPressed,
                      ]}>
                      <Text
                        style={[
                          styles.optionText,
                          selected && styles.optionSelectedText,
                        ]}>
                        {option}
                      </Text>

                      {selected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={19}
                          color={COLORS.gold}
                        />
                      )}
                    </Pressable>
                  );
                })
              ) : (
                <View style={styles.emptyOptions}>
                  <Ionicons
                    name="list-outline"
                    size={25}
                    color={COLORS.muted}
                  />

                  <Text style={styles.emptyText}>No options available</Text>
                </View>
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

/* ============================================================
   DATE FIELD
============================================================ */

function DateField({ label, value, onChange, maximumDate }) {
  const [showPicker, setShowPicker] = useState(false);

  const selectedDate = parseDate(value);

  const handleChange = (event, date) => {
    setShowPicker(false);

    if (Platform.OS === 'android' && event?.type === 'dismissed') {
      return;
    }

    if (date) {
      onChange(formatDate(date));
    }
  };

  return (
    <View style={styles.field}>
      <FieldLabel label={label} />

      <Pressable
        onPress={() => setShowPicker(true)}
        style={({ pressed }) => [
          styles.inputBox,
          styles.dateBox,
          pressed && styles.pressedInput,
        ]}>
        <Text style={[styles.dateText, !value && styles.placeholder]}>
          {value || `Select ${label}`}
        </Text>

        <Ionicons name="calendar-outline" size={18} color={COLORS.brown} />
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={maximumDate}
          onChange={handleChange}
          themeVariant="light"
        />
      )}
    </View>
  );
}

/* ============================================================
   TERMS
============================================================ */

function TermsCheckbox({ checked, onPress }) {
  const scale = useRef(new Animated.Value(checked ? 1 : 0.85)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: checked ? 1 : 0.85,
      friction: 5,
      tension: 130,
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
   MAIN SCREEN
============================================================ */

export default function JoinGieoGitaScreen() {
  const router = useRouter();

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

  const [loadingOptions, setLoadingOptions] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [checkingPhone, setCheckingPhone] = useState(false);

  /* ----------------------------------------------------------
     PROFILE
  ---------------------------------------------------------- */

  const [profileFound, setProfileFound] = useState(null);

  /* ----------------------------------------------------------
     ERROR
  ---------------------------------------------------------- */

  const [error, setError] = useState('');

  /* ----------------------------------------------------------
     FIELD UPDATE
  ---------------------------------------------------------- */

  const updateField = useCallback((key, value) => {
    setError('');

    setFormData(previous => ({
      ...previous,
      [key]: value,
    }));
  }, []);

  /* ==========================================================
     LOAD LOCATION OPTIONS
  ========================================================== */

  const loadCountries = useCallback(async () => {
    try {
      setLoadingCountries(true);

      const response = await joinGieoGitaServices.getLocationOptions();

      if (response?.success === false) {
        throw new Error(response?.error || 'Unable to load countries');
      }

      /*
       * Support both:
       *
       * {
       *   level: "country",
       *   data: [...]
       * }
       *
       * and apiRequest wrapped responses.
       */

      const data = response?.data || response;

      const list = normalizeOptions(data?.data || data);

      setCountries(list);

      return list;
    } catch (err) {
      console.log('Countries error:', err);

      setCountries([]);

      return [];
    } finally {
      setLoadingCountries(false);
    }
  }, []);

  /* ==========================================================
     LOAD STATES
  ========================================================== */

  const loadStates = useCallback(async country => {
    if (!country) {
      setStates([]);
      return;
    }

    try {
      setLoadingStates(true);

      const response = await joinGieoGitaServices.getLocationOptions(country);

      const data = response?.data || response;

      const list = normalizeOptions(data?.data || data);

      setStates(list);
    } catch (err) {
      console.log('States error:', err);

      setStates([]);
    } finally {
      setLoadingStates(false);
    }
  }, []);

  /* ==========================================================
     LOAD DISTRICTS
  ========================================================== */

  const loadDistricts = useCallback(async (country, state) => {
    if (!country || !state) {
      setDistricts([]);
      return;
    }

    try {
      setLoadingDistricts(true);

      const response = await joinGieoGitaServices.getLocationOptions(
        country,
        state,
      );

      const data = response?.data || response;

      const list = normalizeOptions(data?.data || data);

      setDistricts(list);
    } catch (err) {
      console.log('District error:', err);

      setDistricts([]);
    } finally {
      setLoadingDistricts(false);
    }
  }, []);

  /* ==========================================================
     LOAD TEHSILS
  ========================================================== */

  const loadTehsils = useCallback(async (country, state, district) => {
    if (!country || !state || !district) {
      setTehsils([]);
      return;
    }

    try {
      setLoadingTehsils(true);

      const response = await joinGieoGitaServices.getLocationOptions(
        country,
        state,
        district,
      );

      const data = response?.data || response;

      const list = normalizeOptions(data?.data || data);

      setTehsils(list);
    } catch (err) {
      console.log('Tehsil error:', err);

      setTehsils([]);
    } finally {
      setLoadingTehsils(false);
    }
  }, []);

  /* ==========================================================
     INITIAL LOCATION
     ----------------------------------------------------------
     This follows the web behavior:
     1. Get country list
     2. Detect device timezone
     3. Convert timezone → country
     4. Automatically select country
     5. Load states
  ========================================================== */

  useEffect(() => {
    let mounted = true;

    const initializeLocation = async () => {
      const countryList = await loadCountries();

      if (!mounted) return;

      const detectedCountry = getAutomaticCountry();

      if (detectedCountry && countryList.includes(detectedCountry)) {
        setFormData(previous => ({
          ...previous,
          country: detectedCountry,
        }));

        await loadStates(detectedCountry);
      } else {
        /*
         * Sometimes API returns:
         *
         * "India"
         *
         * but timezone mapping returns
         * another spelling/case.
         */

        const matchingCountry = countryList.find(
          country => country.toLowerCase() === detectedCountry.toLowerCase(),
        );

        if (matchingCountry) {
          setFormData(previous => ({
            ...previous,
            country: matchingCountry,
          }));

          await loadStates(matchingCountry);
        }
      }
    };

    initializeLocation();

    return () => {
      mounted = false;
    };
  }, [loadCountries, loadStates]);

  /* ==========================================================
     OCCUPATION + EDUCATION
  ========================================================== */

  useEffect(() => {
    let mounted = true;

    const loadOptions = async () => {
      try {
        setLoadingOptions(true);

        const [occupationResponse, educationResponse] = await Promise.all([
          joinGieoGitaServices.getOccupationOptions(),
          joinGieoGitaServices.getEducationOptions(),
        ]);

        if (!mounted) return;

        const occupationData = occupationResponse?.data || occupationResponse;

        const educationData = educationResponse?.data || educationResponse;

        setOccupations(
          normalizeOptions(occupationData?.data || occupationData),
        );

        setEducations(normalizeOptions(educationData?.data || educationData));
      } catch (err) {
        console.log('Options error:', err);
      } finally {
        if (mounted) {
          setLoadingOptions(false);
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
    setFormData(previous => ({
      ...previous,
      state,
      district: '',
      tehsil: '',
    }));

    setDistricts([]);
    setTehsils([]);

    await loadDistricts(formData.country, state);
  };

  /* ==========================================================
     DISTRICT CHANGE
  ========================================================== */

  const handleDistrictChange = async district => {
    setFormData(previous => ({
      ...previous,
      district,
      tehsil: '',
    }));

    setTehsils([]);

    await loadTehsils(formData.country, formData.state, district);
  };

  /* ==========================================================
     PHONE CHECK
  ========================================================== */

  const handlePhoneChange = async value => {
    const digits = value.replace(/\D/g, '');

    if (digits.length > 11) {
      return;
    }

    updateField('whatsapp', digits);

    setProfileFound(null);

    if (digits.length < 10) {
      return;
    }

    try {
      setCheckingPhone(true);

      const response = await joinGieoGitaServices.getProfileByPhone(digits);

      if (response?.success && response?.data?.data) {
        setProfileFound(response.data.data);
      } else {
        setProfileFound(null);
      }
    } catch (err) {
      console.log('Phone check error:', err);

      setProfileFound(null);
    } finally {
      setCheckingPhone(false);
    }
  };

  /* ==========================================================
     MARITAL STATUS
  ========================================================== */

  const handleMaritalChange = value => {
    setFormData(previous => ({
      ...previous,
      maritalStatus: value,
      anniver_date: value === 'Married' ? previous.anniver_date : '',
    }));
  };

  /* ==========================================================
     VALIDATION
  ========================================================== */

  const validate = () => {
    const requiredFields = [
      ['country', 'Country'],
      ['name', 'Full Name'],
      ['whatsapp', 'WhatsApp Number'],
      ['dikshit', 'Dikshit'],
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

    for (const [key, label] of requiredFields) {
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
    if (submitting) return;

    setError('');

    if (!validate()) {
      return;
    }

    try {
      setSubmitting(true);

      /*
       * SAME PAYLOAD AS WEB VERSION
       */

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

      console.log('Join GIEO Gita payload:', payload);

      const response = await joinGieoGitaServices.createProfile(payload);

      if (!response?.success) {
        throw new Error(response?.error || 'Failed to submit form.');
      }

      const hashId = response?.data?.hash_id;

      if (!hashId) {
        Alert.alert(
          'Success',
          'Your GIEO Gita profile has been created successfully.',
        );

        return;
      }

      router.push(`/join-gieo-gita/${hashId}`);
    } catch (err) {
      console.log('Create profile error:', err);

      setError(err?.message || 'Something went wrong. Please try again.');
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
            backgroundColor: COLORS.darkBrown,
          },

          headerTintColor: COLORS.white,

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
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* =================================================
              HERO
          ================================================= */}

          <Animated.View style={styles.hero}>
            <View style={styles.heroCircle}>
              <Ionicons name="people-outline" size={26} color={COLORS.gold} />
            </View>

            <Text style={styles.heroTitle}>Join GIEO Gita</Text>

            <Text style={styles.heroText}>
              Become a part of the GIEO Gita family
            </Text>
          </Animated.View>

          {/* =================================================
              ERROR
          ================================================= */}

          {error ? (
            <Animated.View style={styles.errorBox}>
              <Ionicons
                name="alert-circle-outline"
                size={19}
                color={COLORS.danger}
              />

              <Text style={styles.errorText}>{error}</Text>
            </Animated.View>
          ) : null}

          {/* =================================================
              PERSONAL DETAILS
          ================================================= */}

          <AnimatedSection
            title="Personal Details"
            icon="person-outline"
            delay={50}>
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
              autoCapitalize="none"
              maxLength={11}
              rightElement={
                checkingPhone ? (
                  <ActivityIndicator size="small" color={COLORS.gold} />
                ) : null
              }
            />

            {profileFound ? (
              <View style={styles.profileBox}>
                <View style={styles.profileIcon}>
                  <Ionicons name="checkmark" size={17} color={COLORS.success} />
                </View>

                <View
                  style={{
                    flex: 1,
                  }}>
                  <Text style={styles.profileTitle}>
                    Profile already exists
                  </Text>

                  <Text style={styles.profileText}>
                    This WhatsApp number is already registered.
                  </Text>
                </View>

                <Pressable
                  onPress={() =>
                    router.push(`/join-gieo-gita/${profileFound.hash_id}`)
                  }
                  style={styles.smallButton}>
                  <Text style={styles.smallButtonText}>View</Text>
                </Pressable>
              </View>
            ) : null}

            <SelectField
              label="Dikshit (दीक्षित परिवार)"
              value={formData.dikshit}
              options={DIKSHIT_OPTIONS}
              onSelect={value => updateField('dikshit', value)}
            />

            <SelectField
              label="Marital Status"
              value={formData.maritalStatus}
              options={MARITAL_OPTIONS}
              onSelect={handleMaritalChange}
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
          </AnimatedSection>

          {/* =================================================
              LOCATION
          ================================================= */}

          <AnimatedSection title="Location" icon="location-outline" delay={110}>
            <SelectField
              label="Country"
              value={formData.country}
              options={countries}
              onSelect={handleCountryChange}
              loading={loadingCountries}
            />

            <SelectField
              label="State"
              value={formData.state}
              options={states}
              onSelect={handleStateChange}
              disabled={!formData.country}
              loading={loadingStates}
            />

            <SelectField
              label="District"
              value={formData.district}
              options={districts}
              onSelect={handleDistrictChange}
              disabled={!formData.state}
              loading={loadingDistricts}
            />

            <SelectField
              label="Tehsil"
              value={formData.tehsil}
              options={tehsils}
              onSelect={value => updateField('tehsil', value)}
              disabled={!formData.district}
              loading={loadingTehsils}
            />

            <TextField
              label="Address"
              value={formData.address}
              onChangeText={value => updateField('address', value)}
              placeholder="Enter address"
              multiline
            />
          </AnimatedSection>

          {/* =================================================
              PROFESSIONAL
          ================================================= */}

          <AnimatedSection
            title="Professional Details"
            icon="briefcase-outline"
            delay={170}>
            <SelectField
              label="Occupation"
              value={formData.occupation}
              options={occupations}
              onSelect={value => updateField('occupation', value)}
              loading={loadingOptions}
            />

            <SelectField
              label="Education"
              value={formData.education}
              options={educations}
              onSelect={value => updateField('education', value)}
              loading={loadingOptions}
            />
          </AnimatedSection>

          {/* =================================================
              GIEO GITA
          ================================================= */}

          <AnimatedSection title="GIEO Gita" icon="heart-outline" delay={230}>
            <SelectField
              label="Wing"
              value={formData.interest}
              options={WING_OPTIONS}
              onSelect={value => updateField('interest', value)}
            />
          </AnimatedSection>

          {/* =================================================
              TERMS
          ================================================= */}

          <TermsCheckbox
            checked={formData.terms}
            onPress={() => updateField('terms', !formData.terms)}
          />

          {/* =================================================
              SUBMIT
          ================================================= */}

          <Pressable
            disabled={submitting}
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.submitButton,

              pressed && !submitting && styles.submitPressed,

              submitting && styles.submitDisabled,
            ]}>
            {submitting ? (
              <>
                <ActivityIndicator size="small" color={COLORS.white} />

                <Text style={styles.submitText}>Submitting...</Text>
              </>
            ) : (
              <>
                <Text style={styles.submitText}>Join GIEO Gita</Text>

                <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
              </>
            )}
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
    backgroundColor: COLORS.bg,
  },

  scrollContent: {
    paddingHorizontal: 13,
    paddingTop: 8,
    paddingBottom: 35,
  },

  /* --------------------------------------------------------
       HERO
    -------------------------------------------------------- */

  hero: {
    alignItems: 'center',
    paddingTop: 7,
    paddingBottom: 10,
  },

  heroCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.darkBrown,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },

  heroTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: COLORS.darkBrown,
    letterSpacing: 0.15,
  },

  heroText: {
    fontSize: 11.5,
    color: COLORS.muted,
    marginTop: 2,
    textAlign: 'center',
  },

  /* --------------------------------------------------------
       CARD
    -------------------------------------------------------- */

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingTop: 11,
    paddingBottom: 5,
    marginBottom: 8,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.045,
    shadowRadius: 5,
    elevation: 2,
  },

  /* --------------------------------------------------------
       SECTION
    -------------------------------------------------------- */

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  sectionIcon: {
    width: 29,
    height: 29,
    borderRadius: 9,
    backgroundColor: '#F3E8DA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.darkBrown,
  },

  /* --------------------------------------------------------
       FIELD
    -------------------------------------------------------- */

  field: {
    marginBottom: 6,
  },

  label: {
    fontSize: 10.8,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 3,
    paddingLeft: 2,
  },

  required: {
    color: COLORS.danger,
  },

  inputBox: {
    minHeight: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: '#FFFCF8',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    minHeight: 38,
    fontSize: 13,
    color: COLORS.text,
    paddingVertical: 5,
    paddingHorizontal: 0,
  },

  inputDisabled: {
    backgroundColor: COLORS.disabled,
    opacity: 0.65,
  },

  pressedInput: {
    borderColor: COLORS.gold,
    backgroundColor: '#FFF9F1',
  },

  inputBoxMultiline: {
    minHeight: 68,
    alignItems: 'flex-start',
  },

  multilineInput: {
    minHeight: 62,
    textAlignVertical: 'top',
    paddingTop: 7,
  },

  /* --------------------------------------------------------
       SELECT
    -------------------------------------------------------- */

  selectBox: {
    justifyContent: 'space-between',
  },

  selectText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    paddingVertical: 5,
  },

  placeholder: {
    color: COLORS.muted,
  },

  /* --------------------------------------------------------
       MODAL
    -------------------------------------------------------- */

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(42, 24, 15, 0.48)',
    justifyContent: 'flex-end',
  },

  selectModal: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 14,
    paddingBottom: Platform.OS === 'ios' ? 28 : 18,
    maxHeight: '72%',
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },

  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.darkBrown,
  },

  optionsList: {
    paddingHorizontal: 10,
  },

  option: {
    minHeight: 43,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },

  optionSelected: {
    backgroundColor: '#F7EEE3',
    borderRadius: 9,
    marginVertical: 2,
    borderBottomWidth: 0,
  },

  optionPressed: {
    backgroundColor: '#F4E9DC',
  },

  optionText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    paddingRight: 8,
  },

  optionSelectedText: {
    color: COLORS.brown,
    fontWeight: '700',
  },

  emptyOptions: {
    alignItems: 'center',
    paddingVertical: 30,
  },

  emptyText: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 6,
  },

  /* --------------------------------------------------------
       PROFILE
    -------------------------------------------------------- */

  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successBg,
    borderWidth: 1,
    borderColor: '#CFE4D3',
    borderRadius: 10,
    padding: 8,
    marginBottom: 6,
  },

  profileIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DDF0E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  profileTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: COLORS.success,
  },

  profileText: {
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 1,
  },

  smallButton: {
    backgroundColor: COLORS.brown,
    borderRadius: 7,
    paddingHorizontal: 11,
    paddingVertical: 6,
    marginLeft: 6,
  },

  smallButtonText: {
    color: COLORS.white,
    fontSize: 10.5,
    fontWeight: '800',
  },

  /* --------------------------------------------------------
       DATE
    -------------------------------------------------------- */

  dateBox: {
    justifyContent: 'space-between',
  },

  dateText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    paddingVertical: 5,
  },

  /* --------------------------------------------------------
       ERROR
    -------------------------------------------------------- */

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerBg,
    borderWidth: 1,
    borderColor: '#E8C1C1',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 8,
    marginBottom: 8,
  },

  errorText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.danger,
    marginLeft: 6,
    lineHeight: 15,
  },

  /* --------------------------------------------------------
       TERMS
    -------------------------------------------------------- */

  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 10,
    paddingHorizontal: 2,
  },

  checkbox: {
    width: 19,
    height: 19,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: COLORS.brown,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxChecked: {
    backgroundColor: COLORS.brown,
    borderColor: COLORS.brown,
  },

  termsText: {
    flex: 1,
    fontSize: 10.5,
    color: COLORS.text,
    marginLeft: 7,
    lineHeight: 15,
  },

  termsLink: {
    color: COLORS.brown,
    fontWeight: '800',
  },

  /* --------------------------------------------------------
       SUBMIT
    -------------------------------------------------------- */

  submitButton: {
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.darkBrown,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.13,
    shadowRadius: 5,
    elevation: 3,
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
    opacity: 0.65,
  },

  submitText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },

  footer: {
    textAlign: 'center',
    fontSize: 9.5,
    color: COLORS.muted,
    marginTop: 13,
    paddingHorizontal: 15,
  },
});
