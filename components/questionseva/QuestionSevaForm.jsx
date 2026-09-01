import { useEffect, useState } from 'react';

import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';

import { useAuth } from '@/context/AuthContext';
import questionSevaServices from '@/lib/services/questionSevaServices';

export default function QuestionSevaForm() {
  // =========================================================
  // SCREEN SIZE
  // =========================================================

  const { height, width } = useWindowDimensions();

  const isSmallScreen = height < 720;
  const isVerySmallScreen = height < 650;
  const isTablet = width >= 600;

  // =========================================================
  // AUTH
  // =========================================================

  const { user, access_token, isAuthenticated } = useAuth();

  // =========================================================
  // FORM STATE
  // =========================================================

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: '',
    text: '',
  });

  // =========================================================
  // AUTO FILL USER
  // =========================================================

  useEffect(() => {
    if (!user) {
      return;
    }

    if (user?.name) {
      setName(String(user.name));
    }

    if (user?.email) {
      setEmail(String(user.email));
    }

    const userPhone =
      user?.phone ||
      user?.mobile ||
      user?.phone_number ||
      user?.mobile_number ||
      user?.contact_no ||
      '';

    if (userPhone) {
      const cleanPhone = String(userPhone).replace(/[^0-9]/g, '');

      setPhone(cleanPhone.slice(-10));
    }
  }, [user]);

  // =========================================================
  // CLEAR MESSAGE
  // =========================================================

  const clearMessage = () => {
    if (message.text) {
      setMessage({
        type: '',
        text: '',
      });
    }
  };

  // =========================================================
  // PHONE
  // =========================================================

  const handlePhoneChange = value => {
    clearMessage();

    const cleanValue = value.replace(/[^0-9]/g, '');

    setPhone(cleanValue.slice(0, 10));
  };

  // =========================================================
  // VALIDATION
  // =========================================================

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your full name.');

      return false;
    }

    if (!phone.trim()) {
      Alert.alert('Mobile Number Required', 'Please enter your mobile number.');

      return false;
    }

    if (phone.length !== 10) {
      Alert.alert(
        'Invalid Mobile Number',
        'Please enter a valid 10-digit mobile number.',
      );

      return false;
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email.trim())) {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');

        return false;
      }
    }

    if (!question.trim()) {
      Alert.alert('Question Required', 'Please write your question.');

      return false;
    }

    if (question.trim().length < 5) {
      Alert.alert(
        'Question Too Short',
        'Please write your question in a little more detail.',
      );

      return false;
    }

    return true;
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async () => {
    if (loading) {
      return;
    }

    clearMessage();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // =====================================================
      // PAYLOAD
      // =====================================================

      const payload = {
        name: name.trim(),
        whatsapp_number: phone.trim(),
        question: question.trim(),
      };

      if (email.trim()) {
        payload.email = email.trim().toLowerCase();
      }

      console.log('[QuestionSeva] Payload:', payload);

      console.log('[QuestionSeva] Authenticated:', isAuthenticated);

      // =====================================================
      // API CALL
      // =====================================================

      const result = await questionSevaServices.submitQuestion(
        payload,
        isAuthenticated && access_token ? access_token : null,
      );

      console.log('[QuestionSeva] Result:', result);

      // =====================================================
      // SUCCESS
      // =====================================================

      if (result?.success) {
        const successMessage =
          result?.data?.message ||
          result?.message ||
          'Your question has been submitted successfully.';

        setMessage({
          type: 'success',
          text: successMessage,
        });

        // Keep personal details
        setQuestion('');

        return;
      }

      // =====================================================
      // BACKEND ERROR
      // =====================================================

      const errorMessage =
        result?.error ||
        result?.message ||
        result?.data?.message ||
        result?.data?.error ||
        'Unable to submit your question. Please try again.';

      setMessage({
        type: 'error',
        text: errorMessage,
      });
    } catch (error) {
      console.error('[QuestionSeva] Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Something went wrong. Please try again.';

      setMessage({
        type: 'error',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5EAD9" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.screen, isSmallScreen && styles.screenSmall]}>
          {/* =================================================
              HEADER
          ================================================= */}

          <View
            style={[
              styles.header,
              isTablet && styles.tabletWidth,
              isSmallScreen && styles.headerSmall,
            ]}>
            <View style={styles.headerAccent} />

            <View style={styles.headerTextArea}>
              <Text style={[styles.title, isSmallScreen && styles.titleSmall]}>
                Question Seva
              </Text>

              {!isVerySmallScreen && (
                <Text style={styles.subtitle}>Share your question with us</Text>
              )}
            </View>
          </View>

          {/* =================================================
              MAIN CARD
          ================================================= */}

          <View
            style={[
              styles.card,
              isTablet && styles.tabletWidth,
              isSmallScreen && styles.cardSmall,
            ]}>
            {/* ===============================================
                LOGIN STATUS
            =============================================== */}

            <View
              style={[styles.loginBox, isSmallScreen && styles.loginBoxSmall]}>
              <View
                style={[styles.statusDot, !isAuthenticated && styles.guestDot]}
              />

              <Text numberOfLines={1} style={styles.loginText}>
                {isAuthenticated
                  ? `Logged in as ${user?.name || 'User'}`
                  : 'Continue as Guest'}
              </Text>
            </View>

            {/* =================================================
                FULL NAME
            ================================================= */}

            <View style={[styles.field, isSmallScreen && styles.fieldSmall]}>
              <Text style={styles.label}>
                Full Name
                <Text style={styles.required}> *</Text>
              </Text>

              <TextInput
                value={name}
                onChangeText={value => {
                  clearMessage();
                  setName(value);
                }}
                placeholder="Enter your full name"
                placeholderTextColor="#A0927F"
                editable={!loading}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                style={[styles.input, isSmallScreen && styles.inputSmall]}
              />
            </View>

            {/* =================================================
                MOBILE
            ================================================= */}

            <View style={[styles.field, isSmallScreen && styles.fieldSmall]}>
              <Text style={styles.label}>
                Mobile Number
                <Text style={styles.required}> *</Text>
              </Text>

              <View
                style={[
                  styles.phoneContainer,
                  isSmallScreen && styles.phoneContainerSmall,
                ]}>
                <View style={styles.countryCodeBox}>
                  <Text style={styles.countryCode}>+91</Text>
                </View>

                <TextInput
                  value={phone}
                  onChangeText={handlePhoneChange}
                  placeholder="Enter mobile number"
                  placeholderTextColor="#A0927F"
                  keyboardType="number-pad"
                  maxLength={10}
                  editable={!loading}
                  returnKeyType="next"
                  style={styles.phoneInput}
                />
              </View>
            </View>

            {/* =================================================
                EMAIL
            ================================================= */}

            <View style={[styles.field, isSmallScreen && styles.fieldSmall]}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Email</Text>

                <Text style={styles.optional}>Optional</Text>
              </View>

              <TextInput
                value={email}
                onChangeText={value => {
                  clearMessage();
                  setEmail(value);
                }}
                placeholder="email@example.com"
                placeholderTextColor="#A0927F"
                editable={!loading}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                style={[styles.input, isSmallScreen && styles.inputSmall]}
              />
            </View>

            {/* =================================================
                QUESTION
            ================================================= */}

            <View style={[styles.field, isSmallScreen && styles.fieldSmall]}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>
                  Your Question
                  <Text style={styles.required}> *</Text>
                </Text>

                <Text style={styles.counter}>{question.length}/500</Text>
              </View>

              <TextInput
                value={question}
                onChangeText={value => {
                  clearMessage();

                  setQuestion(value.slice(0, 500));
                }}
                placeholder="Write your question here..."
                placeholderTextColor="#A0927F"
                editable={!loading}
                multiline
                numberOfLines={4}
                maxLength={500}
                textAlignVertical="top"
                style={[
                  styles.questionInput,
                  isSmallScreen && styles.questionInputSmall,
                  isVerySmallScreen && styles.questionInputVerySmall,
                ]}
              />
            </View>

            {/* =================================================
                RESPONSE
            ================================================= */}

            {!!message.text && (
              <View
                style={[
                  styles.messageBox,
                  message.type === 'success'
                    ? styles.successBox
                    : styles.errorBox,
                ]}>
                <Text
                  numberOfLines={2}
                  style={[
                    styles.messageText,
                    message.type === 'success'
                      ? styles.successText
                      : styles.errorText,
                  ]}>
                  {message.type === 'success' ? '✓ ' : '! '}

                  {message.text}
                </Text>
              </View>
            )}

            {/* =================================================
                BUTTON
            ================================================= */}

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={loading}
              onPress={handleSubmit}
              style={[
                styles.submitButton,
                isSmallScreen && styles.submitButtonSmall,
                loading && styles.submitButtonDisabled,
              ]}>
              {loading ? (
                <View style={styles.buttonRow}>
                  <ActivityIndicator size="small" color="#FFFFFF" />

                  <Text style={styles.submitText}>Submitting...</Text>
                </View>
              ) : (
                <Text style={styles.submitText}>Submit Question</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ============================================================
// COLORS
// ============================================================
//
// Main dark brown : #3a2c16
// Main brown      : #5a3816
// Biscuit         : #F5EAD9
// Light biscuit   : #FBF7F0
// Input           : #F9F3E9
//
// ============================================================

const styles = StyleSheet.create({
  // ==========================================================
  // MAIN SCREEN
  // ==========================================================

  safeArea: {
    flex: 1,
    backgroundColor: '#F5EAD9',
  },

  keyboardView: {
    flex: 1,
  },

  screen: {
    flex: 1,

    justifyContent: 'center',

    backgroundColor: '#F5EAD9',

    paddingHorizontal: 16,

    paddingTop: Platform.OS === 'ios' ? 8 : 10,

    paddingBottom: 10,
  },

  screenSmall: {
    paddingTop: 5,
    paddingBottom: 5,
  },

  tabletWidth: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },

  // ==========================================================
  // HEADER
  // ==========================================================

  header: {
    width: '100%',

    maxWidth: 600,

    alignSelf: 'center',

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 13,

    paddingHorizontal: 2,
  },

  headerSmall: {
    marginBottom: 8,
  },

  headerAccent: {
    width: 5,

    height: 43,

    borderRadius: 10,

    marginRight: 11,

    backgroundColor: '#5a3816',
  },

  headerTextArea: {
    flex: 1,
  },

  title: {
    color: '#3a2c16',

    fontSize: 25,

    fontWeight: '800',

    letterSpacing: 0.1,
  },

  titleSmall: {
    fontSize: 21,
  },

  subtitle: {
    marginTop: 2,

    color: '#78654E',

    fontSize: 11.5,

    fontWeight: '500',
  },

  // ==========================================================
  // CARD
  // ==========================================================

  card: {
    width: '100%',

    maxWidth: 600,

    alignSelf: 'center',

    paddingHorizontal: 17,

    paddingTop: 16,

    paddingBottom: 17,

    borderRadius: 20,

    backgroundColor: '#FFFDF9',

    borderWidth: 1,

    borderColor: '#E2D2BA',

    elevation: 5,

    shadowColor: '#3a2c16',

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.12,

    shadowRadius: 10,
  },

  cardSmall: {
    paddingHorizontal: 13,
    paddingTop: 11,
    paddingBottom: 12,

    borderRadius: 16,
  },

  // ==========================================================
  // LOGIN STATUS
  // ==========================================================

  loginBox: {
    minHeight: 39,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 12,

    marginBottom: 15,

    borderRadius: 10,

    backgroundColor: '#F2E7D6',

    borderWidth: 1,

    borderColor: '#E3D1B7',
  },

  loginBoxSmall: {
    minHeight: 33,
    marginBottom: 9,
  },

  statusDot: {
    width: 8,

    height: 8,

    borderRadius: 4,

    marginRight: 8,

    backgroundColor: '#6D7F4A',
  },

  guestDot: {
    backgroundColor: '#5a3816',
  },

  loginText: {
    flex: 1,

    color: '#5a3816',

    fontSize: 11.5,

    fontWeight: '700',

    textTransform: 'capitalize',
  },

  // ==========================================================
  // FORM
  // ==========================================================

  field: {
    marginBottom: 12,
  },

  fieldSmall: {
    marginBottom: 7,
  },

  labelRow: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',
  },

  label: {
    color: '#3a2c16',

    fontSize: 12,

    fontWeight: '700',

    marginBottom: 6,
  },

  required: {
    color: '#A14B37',
  },

  optional: {
    color: '#95836C',

    fontSize: 9.5,

    fontWeight: '500',

    marginBottom: 6,
  },

  counter: {
    color: '#95836C',

    fontSize: 9,

    fontWeight: '500',

    marginBottom: 6,
  },

  // ==========================================================
  // INPUT
  // ==========================================================

  input: {
    width: '100%',

    height: 44,

    borderWidth: 1,

    borderColor: '#DDC9AD',

    borderRadius: 10,

    backgroundColor: '#F9F3E9',

    paddingHorizontal: 13,

    color: '#3a2c16',

    fontSize: 12.5,
  },

  inputSmall: {
    height: 38,
    fontSize: 12,
  },

  // ==========================================================
  // PHONE
  // ==========================================================

  phoneContainer: {
    width: '100%',

    height: 44,

    flexDirection: 'row',

    overflow: 'hidden',

    borderWidth: 1,

    borderColor: '#DDC9AD',

    borderRadius: 10,

    backgroundColor: '#F9F3E9',
  },

  phoneContainerSmall: {
    height: 38,
  },

  countryCodeBox: {
    width: 57,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: '#EFE3D1',

    borderRightWidth: 1,

    borderRightColor: '#DDC9AD',
  },

  countryCode: {
    color: '#5a3816',

    fontSize: 12,

    fontWeight: '800',
  },

  phoneInput: {
    flex: 1,

    paddingHorizontal: 12,

    color: '#3a2c16',

    fontSize: 12.5,
  },

  // ==========================================================
  // QUESTION
  // ==========================================================

  questionInput: {
    width: '100%',

    minHeight: 93,

    maxHeight: 100,

    paddingHorizontal: 13,

    paddingTop: 10,

    paddingBottom: 10,

    borderWidth: 1,

    borderColor: '#DDC9AD',

    borderRadius: 10,

    backgroundColor: '#F9F3E9',

    color: '#3a2c16',

    fontSize: 12.5,

    lineHeight: 18,
  },

  questionInputSmall: {
    minHeight: 70,
    maxHeight: 73,

    paddingTop: 7,
  },

  questionInputVerySmall: {
    minHeight: 56,
    maxHeight: 60,
  },

  // ==========================================================
  // MESSAGE
  // ==========================================================

  messageBox: {
    paddingHorizontal: 10,

    paddingVertical: 7,

    marginBottom: 9,

    borderWidth: 1,

    borderRadius: 9,
  },

  successBox: {
    backgroundColor: '#EFF3E7',
    borderColor: '#CAD4B2',
  },

  errorBox: {
    backgroundColor: '#FAECE8',
    borderColor: '#E3BBAE',
  },

  messageText: {
    fontSize: 10,

    lineHeight: 14,

    fontWeight: '600',
  },

  successText: {
    color: '#596A40',
  },

  errorText: {
    color: '#934936',
  },

  // ==========================================================
  // SUBMIT
  // ==========================================================

  submitButton: {
    width: '100%',

    height: 48,

    alignItems: 'center',

    justifyContent: 'center',

    borderRadius: 10,

    backgroundColor: '#5a3816',

    borderWidth: 1,

    borderColor: '#3a2c16',

    elevation: 3,

    shadowColor: '#3a2c16',

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.2,

    shadowRadius: 5,
  },

  submitButtonSmall: {
    height: 41,
  },

  submitButtonDisabled: {
    opacity: 0.6,
  },

  buttonRow: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',
  },

  submitText: {
    marginLeft: 7,

    color: '#FFFFFF',

    fontSize: 13.5,

    fontWeight: '800',

    letterSpacing: 0.2,
  },
});
