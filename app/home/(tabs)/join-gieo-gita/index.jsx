// app/join-gieo-gita/index.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
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
   SCREEN
============================================================ */

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SHEET_MIN_HEIGHT = SCREEN_HEIGHT * 0.4;

const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.75;

/* ============================================================
   COLORS
============================================================ */

const COLORS = {
  background: '#F5EEE6',
  card: '#FFFDF9',
  input: '#FFFBF6',

  brown: '#5A321F',
  darkBrown: '#3B2115',
  mediumBrown: '#795039',

  gold: '#B68A4A',
  goldLight: '#E9D5B7',

  text: '#3D2B21',
  muted: '#8D7A6E',

  border: '#DCC9B7',
  lightBorder: '#EAE0D7',

  white: '#FFFFFF',

  green: '#3F7C4D',
  greenBg: '#EDF7EF',

  red: '#B63D3D',
  redBg: '#FCEEEE',
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
          <Ionicons name={icon} size={16} color={COLORS.gold} />
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

function OptionSheet({
  visible,
  title,
  options,
  value,
  onSelect,
  onClose,
  loading = false,
}) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const opacity = useRef(new Animated.Value(0)).current;

  const [search, setSearch] = useState('');

  useEffect(() => {
    if (visible) {
      setSearch('');

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 220,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) {
      return options || [];
    }

    const q = search.trim().toLowerCase();

    return (options || []).filter(item => item.toLowerCase().includes(q));
  }, [options, search]);

  const close = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose?.();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={close}>
      <View style={styles.sheetRoot}>
        <Animated.View
          style={[
            styles.sheetBackdrop,
            {
              opacity,
            },
          ]}
        />

        <Pressable style={styles.sheetCloseArea} onPress={close} />

        <Animated.View
          style={[
            styles.bottomSheet,
            {
              height: Math.min(
                Math.max(SHEET_MIN_HEIGHT, SCREEN_HEIGHT * 0.55),
                SHEET_MAX_HEIGHT,
              ),

              transform: [
                {
                  translateY,
                },
              ],
            },
          ]}>
          {/* HANDLE */}

          <View style={styles.sheetHandle} />

          {/* HEADER */}

          <View style={styles.sheetHeader}>
            <View
              style={{
                flex: 1,
              }}>
              <Text style={styles.sheetTitle}>{title}</Text>

              <Text style={styles.sheetCount}>
                {loading ? 'Loading...' : `${filteredOptions.length} options`}
              </Text>
            </View>

            <Pressable onPress={close} hitSlop={12} style={styles.closeButton}>
              <Ionicons name="close" size={19} color={COLORS.brown} />
            </Pressable>
          </View>

          {/* SEARCH */}

          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={17} color={COLORS.muted} />

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder={`Search ${title.toLowerCase()}`}
              placeholderTextColor={COLORS.muted}
              style={styles.searchInput}
            />

            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={17} color={COLORS.muted} />
              </Pressable>
            )}
          </View>

          {/* OPTIONS */}

          {loading ? (
            <View style={styles.loadingView}>
              <ActivityIndicator size="small" color={COLORS.gold} />

              <Text style={styles.loadingText}>Loading options...</Text>
            </View>
          ) : (
            <ScrollView
              style={styles.sheetList}
              contentContainerStyle={styles.sheetListContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              {filteredOptions.length === 0 ? (
                <View style={styles.noOptions}>
                  <Ionicons
                    name="search-outline"
                    size={27}
                    color={COLORS.muted}
                  />

                  <Text style={styles.noOptionsText}>No options found</Text>
                </View>
              ) : (
                filteredOptions.map((item, index) => {
                  const selected = item === value;

                  return (
                    <Pressable
                      key={`${item}-${index}`}
                      onPress={() => onSelect(item)}
                      style={({ pressed }) => [
                        styles.optionRow,

                        selected && styles.selectedOption,

                        pressed && styles.optionPressed,
                      ]}>
                      <Text
                        style={[
                          styles.optionText,
                          selected && styles.selectedOptionText,
                        ]}>
                        {item}
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
              )}
            </ScrollView>
          )}
        </Animated.View>
      </View>
    </Modal>
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

  return (
    <>
      <View style={styles.field}>
        <Label required={required}>{label}</Label>

        <Pressable
          disabled={disabled || loading}
          onPress={() => setVisible(true)}
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

          {loading ? (
            <ActivityIndicator size="small" color={COLORS.gold} />
          ) : (
            <Ionicons
              name="chevron-down"
              size={17}
              color={disabled ? COLORS.muted : COLORS.brown}
            />
          )}
        </Pressable>
      </View>

      <OptionSheet
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

        <Ionicons name="calendar-outline" size={18} color={COLORS.brown} />
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={parseDate(value)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
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
        setExistingProfile(profile);
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
        router.push(`/join-gieo-gita/${hashId}`);
      } else {
        Alert.alert(
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
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}>
          {/* HERO */}

          <View style={styles.hero}>
            <View style={styles.heroIcon}>
              <Ionicons name="people-outline" size={25} color={COLORS.gold} />
            </View>

            <Text style={styles.heroTitle}>Join GIEO Gita</Text>

            <Text style={styles.heroSubtitle}>
              Become a part of the GIEO Gita family
            </Text>
          </View>

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
                  <ActivityIndicator size="small" color={COLORS.gold} />
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
                  Profile already exists for this number.
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
              onSelect={handleStateChange}
            />

            <SelectField
              label="District"
              value={formData.district}
              options={districts}
              loading={loadingDistricts}
              disabled={!formData.state}
              onSelect={handleDistrictChange}
            />

            <SelectField
              label="City / Tehsil"
              value={formData.tehsil}
              options={tehsils}
              loading={loadingTehsils}
              disabled={!formData.district}
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

          {/* SUBMIT */}

          <Pressable
            onPress={handleSubmit}
            disabled={submitting}
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
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 13,
    paddingTop: 7,
    paddingBottom: 35,
  },

  /* HERO */

  hero: {
    alignItems: 'center',
    paddingTop: 3,
    paddingBottom: 10,
  },

  heroIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: COLORS.darkBrown,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.gold,
    marginBottom: 5,
  },

  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.darkBrown,
  },

  heroSubtitle: {
    fontSize: 10.5,
    color: COLORS.muted,
    marginTop: 2,
  },

  /* SECTION */

  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 11,
    paddingTop: 10,
    paddingBottom: 3,
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

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },

  sectionIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F3E7D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  sectionTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: COLORS.darkBrown,
  },

  /* FIELDS */

  field: {
    marginBottom: 6,
  },

  label: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 3,
    paddingLeft: 1,
  },

  required: {
    color: COLORS.red,
  },

  inputContainer: {
    minHeight: 39,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    backgroundColor: COLORS.input,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  textInput: {
    flex: 1,
    minHeight: 37,
    fontSize: 12.5,
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
    justifyContent: 'space-between',
  },

  selectText: {
    flex: 1,
    fontSize: 12.5,
    color: COLORS.text,
    paddingVertical: 5,
  },

  placeholder: {
    color: COLORS.muted,
  },

  disabledInput: {
    backgroundColor: '#F0EBE6',
    opacity: 0.62,
  },

  pressedInput: {
    borderColor: COLORS.gold,
    backgroundColor: '#FFF8EE',
  },

  /* DATE */

  dateContainer: {
    justifyContent: 'space-between',
  },

  dateText: {
    flex: 1,
    fontSize: 12.5,
    color: COLORS.text,
    paddingVertical: 5,
  },

  /* PROFILE */

  profileExists: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.greenBg,
    borderWidth: 1,
    borderColor: '#CDE1D1',
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 6,
  },

  profileExistsText: {
    marginLeft: 6,
    fontSize: 10.5,
    color: COLORS.green,
    fontWeight: '700',
  },

  /* ERROR */

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.redBg,
    borderWidth: 1,
    borderColor: '#E7C1C1',
    borderRadius: 9,
    paddingHorizontal: 9,
    paddingVertical: 8,
    marginBottom: 8,
  },

  errorText: {
    flex: 1,
    marginLeft: 6,
    color: COLORS.red,
    fontSize: 10.5,
    lineHeight: 15,
  },

  /* ========================================================
       BOTTOM SHEET
    ======================================================== */

  sheetRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(37, 20, 12, 0.58)',
  },

  sheetCloseArea: {
    ...StyleSheet.absoluteFillObject,
  },

  bottomSheet: {
    width: '100%',
    minHeight: SHEET_MIN_HEIGHT,
    maxHeight: SHEET_MAX_HEIGHT,
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 27 : 12,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 18,
  },

  sheetHandle: {
    width: 42,
    height: 4,
    borderRadius: 3,
    backgroundColor: '#CDB9A8',
    alignSelf: 'center',
    marginBottom: 9,
  },

  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 9,
  },

  sheetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.darkBrown,
  },

  sheetCount: {
    fontSize: 9.5,
    color: COLORS.muted,
    marginTop: 1,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1E8DF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchContainer: {
    height: 39,
    marginHorizontal: 13,
    marginBottom: 7,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#FFFBF6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
  },

  searchInput: {
    flex: 1,
    fontSize: 12,
    color: COLORS.text,
    marginLeft: 6,
    paddingVertical: 0,
  },

  sheetList: {
    flex: 1,
  },

  sheetListContent: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },

  optionRow: {
    minHeight: 43,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightBorder,
    borderRadius: 8,
  },

  selectedOption: {
    backgroundColor: '#F5EBDD',
    borderBottomWidth: 0,
    marginVertical: 2,
  },

  optionPressed: {
    backgroundColor: '#F1E3D4',
  },

  optionText: {
    flex: 1,
    fontSize: 12.5,
    color: COLORS.text,
    paddingRight: 8,
  },

  selectedOptionText: {
    color: COLORS.brown,
    fontWeight: '800',
  },

  loadingView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 7,
  },

  noOptions: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 45,
  },

  noOptionsText: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 7,
  },

  /* TERMS */

  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
    marginBottom: 10,
    paddingHorizontal: 2,
  },

  checkbox: {
    width: 19,
    height: 19,
    borderRadius: 5,
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
    fontSize: 10,
    color: COLORS.text,
    marginLeft: 7,
    lineHeight: 14,
  },

  termsLink: {
    color: COLORS.brown,
    fontWeight: '800',
  },

  /* SUBMIT */

  submitButton: {
    height: 45,
    borderRadius: 11,
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
    shadowOpacity: 0.14,
    shadowRadius: 5,
    elevation: 3,
  },

  submitPressed: {
    transform: [
      {
        scale: 0.985,
      },
    ],
    opacity: 0.9,
  },

  submitDisabled: {
    opacity: 0.6,
  },

  submitText: {
    color: COLORS.white,
    fontSize: 13.5,
    fontWeight: '800',
  },

  footer: {
    textAlign: 'center',
    fontSize: 9,
    color: COLORS.muted,
    marginTop: 12,
  },
});
