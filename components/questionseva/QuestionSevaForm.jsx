import { DESIGN } from '@/constants/design';
import { useEffect, useState } from 'react';

import {
    ActivityIndicator,
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
import { useAppAlert } from '@/context/AppAlertContext';
import questionSevaServices from '@/lib/services/questionSevaServices';

export default function QuestionSevaForm() {
  const { error } = useAppAlert();
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
      error('Name Required', 'Please enter your full name.');

      return false;
    }

    if (!phone.trim()) {
      error('Mobile Number Required', 'Please enter your mobile number.');

      return false;
    }

    if (phone.length !== 10) {
      error(
        'Invalid Mobile Number',
        'Please enter a valid 10-digit mobile number.',
      );

      return false;
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email.trim())) {
        error('Invalid Email', 'Please enter a valid email address.');

        return false;
      }
    }

    if (!question.trim()) {
      error('Question Required', 'Please write your question.');

      return false;
    }

    if (question.trim().length < 5) {
      error(
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
      <StatusBar barStyle="dark-content" backgroundColor="#F8F5F0" />

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
                placeholderTextColor="#8A7863"
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
                  placeholderTextColor="#8A7863"
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
                placeholderTextColor="#8A7863"
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
                placeholderTextColor="#8A7863"
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
// Main dark brown : #2B1B12
// Main brown      : #E8721C
// Biscuit         : #FFF8EE
// Light biscuit   : #FFFDF9
// Input           : #FFFCF8
//
// ============================================================

const styles = StyleSheet.create({
  // ==========================================================
  // MAIN SCREEN
  // ==========================================================

  safeArea: {
    flex: 1,
    backgroundColor: DESIGN.colors.canvas
  },
  keyboardView: {
    flex: 1
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: DESIGN.colors.canvas,
    paddingHorizontal: 24,
    paddingTop: 6,
    paddingBottom: 6
  },
  screenSmall: {
    paddingTop: 5,
    paddingBottom: 5
  },
  tabletWidth: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center'
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
    marginBottom: 20,
    paddingHorizontal: 2
  },
  headerSmall: {
    marginBottom: 8
  },
  headerAccent: {
    width: 3,
    height: 42,
    borderRadius: 10,
    marginRight: 14,
    backgroundColor: DESIGN.colors.gold
  },
  headerTextArea: {
    flex: 1
  },
  title: {
    color: '#292328',
    fontSize: 28,
    fontWeight: "400",
    letterSpacing: -0.4,
    fontFamily: DESIGN.fonts.editorial,
    lineHeight: 36
  },
  titleSmall: {
    fontSize: 26,
    fontFamily: DESIGN.fonts.editorial,
    fontWeight: "400",
    letterSpacing: -0.4
  },
  subtitle: {
    marginTop: 2,
    color: DESIGN.colors.muted,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18
  },
  // ==========================================================
  // CARD
  // ==========================================================

  card: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 22,
    borderRadius: 24,
    backgroundColor: DESIGN.colors.surface,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    elevation: 2,
    shadowColor: '#292328',
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.045,
    shadowRadius: 10
  },
  cardSmall: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 24
  },
  // ==========================================================
  // LOGIN STATUS
  // ==========================================================

  loginBox: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: DESIGN.colors.sageSoft,
    borderWidth: 0,
    borderColor: '#E7DFD7',
    paddingVertical: 10
  },
  loginBoxSmall: {
    minHeight: 44,
    marginBottom: 16
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: '#1FA97E'
  },
  guestDot: {
    backgroundColor: '#A65338'
  },
  loginText: {
    flex: 1,
    color: DESIGN.colors.sage,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize'
  },
  // ==========================================================
  // FORM
  // ==========================================================

  field: {
    marginBottom: 16
  },
  fieldSmall: {
    marginBottom: 14
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  label: {
    color: '#292328',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8
  },
  required: {
    color: '#E5484D'
  },
  optional: {
    color: '#8A7863',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6
  },
  counter: {
    color: '#8A7863',
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 6
  },
  // ==========================================================
  // INPUT
  // ==========================================================

  input: {
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    borderRadius: 14,
    backgroundColor: "#FCFAF7",
    paddingHorizontal: 13,
    color: '#292328',
    fontSize: 15
  },
  inputSmall: {
    height: 52,
    fontSize: 15
  },
  // ==========================================================
  // PHONE
  // ==========================================================

  phoneContainer: {
    width: '100%',
    height: 52,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    borderRadius: 14,
    backgroundColor: "#FCFAF7"
  },
  phoneContainerSmall: {
    height: 52
  },
  countryCodeBox: {
    width: 57,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0EAE2',
    borderRightWidth: 1,
    borderRightColor: '#E7DFD7'
  },
  countryCode: {
    color: '#A65338',
    fontSize: 12,
    fontWeight: "600"
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 12,
    color: '#292328',
    fontSize: 15
  },
  // ==========================================================
  // QUESTION
  // ==========================================================

  questionInput: {
    width: '100%',
    minHeight: 120,
    maxHeight: 180,
    paddingHorizontal: 13,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    borderRadius: 14,
    backgroundColor: "#FCFAF7",
    color: '#292328',
    fontSize: 15,
    lineHeight: 23
  },
  questionInputSmall: {
    minHeight: 120,
    maxHeight: 180,
    paddingTop: 12
  },
  questionInputVerySmall: {
    minHeight: 120,
    maxHeight: 180
  },
  // ==========================================================
  // MESSAGE
  // ==========================================================

  messageBox: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginBottom: 9,
    borderWidth: 1,
    borderRadius: 9
  },
  successBox: {
    backgroundColor: '#E6FBF7',
    borderColor: '#B8F3E6'
  },
  errorBox: {
    backgroundColor: '#FDECEC',
    borderColor: '#F8C9C9'
  },
  messageText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600'
  },
  successText: {
    color: '#0B7F6B'
  },
  errorText: {
    color: '#D62839'
  },
  // ==========================================================
  // SUBMIT
  // ==========================================================

  submitButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: DESIGN.colors.plum,
    borderWidth: 0,
    borderColor: '#292328',
    elevation: 0,
    shadowColor: '#292328',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0,
    shadowRadius: 5,
    minHeight: 52,
    height: 54
  },
  submitButtonSmall: {
    height: 54
  },
  submitButtonDisabled: {
    opacity: 0.6
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitText: {
    marginLeft: 7,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.2
  }
});
