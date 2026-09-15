import { DESIGN } from '@/constants/design';
import { useAppAlert } from '@/context/AppAlertContext';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';

import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { SectionHead } from './SharedUI';

import ConsentCheckboxes from '@/components/common/ConsentCheckboxes';
// Adjust this import only if your service file is in another folder.
import inquiriesServices from '@/lib/services/inquiriesServices';

// ============================================================
// COLORS
// ============================================================

const COLORS = {
  darkBrown: '#292328',
  brown: '#55334A',
  saffron: '#A65338',

  mediumBrown: '#74696A',
  softBrown: '#7A6650',
  mutedBrown: '#94806A',

  background: '#F4E9D8',

  biscuit: '#EEDFC9',
  biscuitLight: '#F8F1E7',

  cream: '#FFFFFF',
  white: '#FFFFFF',

  border: '#DDC8AA',
  borderSoft: '#E9DCC8',

  green: '#667747',
  greenLight: '#EFF3E8',

  error: '#A34F39',
  errorLight: '#FAECE8',
};

// ============================================================
// COMPONENT
// ============================================================

export default function ContactSection() {
  const { error } = useAppAlert();

  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const [loading, setLoading] = useState(false);

  const [responseMessage, setResponseMessage] = useState({
    type: '',
    text: '',
  });

  // ==========================================================
  // CLEAR RESPONSE
  // ==========================================================

  const clearResponse = () => {
    if (responseMessage.text) {
      setResponseMessage({
        type: '',
        text: '',
      });
    }
  };

  // ==========================================================
  // PHONE
  // ==========================================================

  const handlePhoneChange = value => {
    clearResponse();

    const cleanValue = value.replace(/[^0-9]/g, '');

    setPhone(cleanValue.slice(0, 10));
  };

  // ==========================================================
  // EMAIL VALIDATION
  // ==========================================================

  const validateEmail = value => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(value);
  };

  // ==========================================================
  // VALIDATE FORM
  // ==========================================================

  const validateForm = () => {
    if (!name.trim()) {
      error('Name Required', 'Please enter your full name.');

      return false;
    }

    if (name.trim().length < 2) {
      error('Invalid Name', 'Please enter a valid name.');

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

    if (email.trim() && !validateEmail(email.trim())) {
      error('Invalid Email', 'Please enter a valid email address.');

      return false;
    }

    if (!message.trim()) {
      error('Inquiry Required', 'Please write your inquiry.');

      return false;
    }

    if (message.trim().length < 5) {
      error(
        'Inquiry Too Short',
        'Please provide a little more information.',
      );

      return false;
    }

    if (!termsAccepted || !privacyAccepted) {
      error(
        'Terms Required',
        'Please accept the Terms & Conditions and Privacy Policy.',
      );

      return false;
    }

    return true;
  };

  // ==========================================================
  // SUBMIT MEDANTA INQUIRY
  // ==========================================================

  const handleInquirySubmit = async () => {
    if (loading) {
      return;
    }

    clearResponse();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // ======================================================
      // PAYLOAD
      // ======================================================

      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        message: message.trim(),
      };

      if (email.trim()) {
        payload.email = email.trim().toLowerCase();
      }

      console.log('=========================================');

      console.log('[Medanta Inquiry] Department:', 'medanta');

      console.log('[Medanta Inquiry] Payload:', payload);

      // ======================================================
      // API CALL
      //
      // POST:
      // /inquiry?department=medanta
      // ======================================================

      const result = await inquiriesServices.createPublicInquiry(
        'medanta',
        payload,
      );

      console.log('[Medanta Inquiry] Response:', result);

      console.log('=========================================');

      // ======================================================
      // SUCCESS
      // ======================================================

      if (result?.success) {
        const successMessage =
          result?.data?.message ||
          result?.message ||
          'Your inquiry has been submitted successfully. Our team will contact you shortly.';

        setResponseMessage({
          type: 'success',
          text: successMessage,
        });

        // Clear inquiry after successful submission.
        setMessage('');

        return;
      }

      // ======================================================
      // API ERROR
      // ======================================================

      const backendMessage =
        result?.error ||
        result?.message ||
        result?.data?.message ||
        result?.data?.error ||
        'Unable to submit your inquiry. Please try again.';

      setResponseMessage({
        type: 'error',
        text: backendMessage,
      });
    } catch (error) {
      console.error('[Medanta Inquiry] Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Something went wrong. Please try again.';

      setResponseMessage({
        type: 'error',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // CALL
  // ==========================================================

  const handleCall = async () => {
    try {
      await Linking.openURL('tel:+911234567890');
    } catch (_error) {
      error(
        'Unable to Call',
        'Phone service is not available on this device.',
      );
    }
  };

  // ==========================================================
  // WHATSAPP
  // ==========================================================

  const handleWhatsApp = async () => {
    try {
      await Linking.openURL('https://wa.me/911234567890');
    } catch (_error) {
      error('Unable to Open WhatsApp', 'WhatsApp could not be opened.');
    }
  };

  // ==========================================================
  // MEDANTA WEBSITE
  // ==========================================================

  const handleMedantaWebsite = async () => {
    try {
      await Linking.openURL('https://www.medanta.org');
    } catch (_error) {
      error(
        'Unable to Open Website',
        'Medanta website could not be opened.',
      );
    }
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <View style={styles.contactSection}>
      {/* =====================================================
          LOCATION
      ===================================================== */}

      <SectionHead label="LOCATION" title="Visit Us" accent="At Kurukshetra" />

      {/* =====================================================
          LOCATION CARD
      ===================================================== */}

      <View style={styles.locationCard}>
        <View style={styles.locationAccent} />

        <View style={styles.locationIconBox}>
          <FontAwesome name="map-marker" size={22} color={COLORS.white} />
        </View>

        <View style={styles.locationTextCol}>
          <Text style={styles.locationSmallLabel}>
            HEALTHCARE SEVA LOCATION
          </Text>

          <Text style={styles.locationTitle}>Gita Gyan Sansthanam</Text>

          <Text style={styles.locationAddr}>Kurukshetra, Haryana — 136118</Text>

          <View style={styles.locationBottom}>
            <View style={styles.freeDot} />

            <Text style={styles.locationSub}>
              Medanta Health Camp • Complimentary for all
            </Text>
          </View>
        </View>
      </View>

      {/* =====================================================
          QUICK CONTACT BUTTONS
      ===================================================== */}

   
      {/* =====================================================
          INQUIRY SECTION HEADER
      ===================================================== */}

      <View style={styles.inquiryHeading}>
        <View style={styles.inquiryIconBox}>
          <FontAwesome name="comments-o" size={18} color={COLORS.brown} />
        </View>

        <View style={styles.inquiryHeadingText}>
       

          <Text style={styles.inquiryTitle}>Send an Inquiry</Text>

          <Text style={styles.inquirySubtitle}>
            Ask us about health services, appointments or facilities.
          </Text>
        </View>
      </View>

      {/* =====================================================
          FORM
      ===================================================== */}

      <View style={styles.formCard}>
        {/* TOP DECORATION */}

        <View style={styles.topAccent}>
          <View style={styles.topAccentDark} />

          <View style={styles.topAccentBrown} />
        </View>

        {/* ===================================================
            NAME
        =================================================== */}

        <View style={styles.field}>
          <Text style={styles.label}>
            Full Name
            <Text style={styles.required}> *</Text>
          </Text>

          <TextInput
            value={name}
            onChangeText={value => {
              clearResponse();
              setName(value);
            }}
            placeholder="Enter your full name"
            placeholderTextColor={COLORS.mutedBrown}
            style={styles.input}
            editable={!loading}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
          />
        </View>

        {/* ===================================================
            PHONE
        =================================================== */}

        <View style={styles.field}>
          <Text style={styles.label}>
            Mobile Number
            <Text style={styles.required}> *</Text>
          </Text>

          <View style={styles.phoneContainer}>
            <View style={styles.countryCodeBox}>
              <Text style={styles.countryCode}>+91</Text>
            </View>

            <TextInput
              value={phone}
              onChangeText={handlePhoneChange}
              placeholder="Enter mobile number"
              placeholderTextColor={COLORS.mutedBrown}
              keyboardType="number-pad"
              maxLength={10}
              editable={!loading}
              returnKeyType="next"
              style={styles.phoneInput}
            />
          </View>
        </View>

        {/* ===================================================
            EMAIL
        =================================================== */}

        <View style={styles.field}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Email Address</Text>

            <Text style={styles.optional}>OPTIONAL</Text>
          </View>

          <TextInput
            value={email}
            onChangeText={value => {
              clearResponse();
              setEmail(value);
            }}
            placeholder="Enter your email"
            placeholderTextColor={COLORS.mutedBrown}
            style={styles.input}
            editable={!loading}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />
        </View>

        {/* ===================================================
            MESSAGE
        =================================================== */}

        <View style={styles.field}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>
              Your Inquiry
              <Text style={styles.required}> *</Text>
            </Text>

            <Text style={styles.counter}>{message.length}/500</Text>
          </View>

          <TextInput
            value={message}
            onChangeText={value => {
              clearResponse();

              setMessage(value.slice(0, 500));
            }}
            placeholder="Write your inquiry here..."
            placeholderTextColor={COLORS.mutedBrown}
            multiline
            maxLength={500}
            textAlignVertical="top"
            editable={!loading}
            style={styles.messageInput}
          />
        </View>

        {/* ===================================================
            CONSENT
        =================================================== */}

        <ConsentCheckboxes
          termsAccepted={termsAccepted}
          onToggleTerms={() => setTermsAccepted(prev => !prev)}
          privacyAccepted={privacyAccepted}
          onTogglePrivacy={() => setPrivacyAccepted(prev => !prev)}
          disabled={loading}
          style={styles.consentWrap}
        />

        {/* ===================================================
            RESPONSE MESSAGE
        =================================================== */}

        {!!responseMessage.text && (
          <View
            style={[
              styles.responseBox,

              responseMessage.type === 'success'
                ? styles.successBox
                : styles.errorBox,
            ]}>
            <View
              style={[
                styles.responseIcon,

                responseMessage.type === 'success'
                  ? styles.successIcon
                  : styles.errorIcon,
              ]}>
              <Text style={styles.responseIconText}>
                {responseMessage.type === 'success' ? '✓' : '!'}
              </Text>
            </View>

            <Text
              style={[
                styles.responseText,

                responseMessage.type === 'success'
                  ? styles.successText
                  : styles.errorText,
              ]}>
              {responseMessage.text}
            </Text>
          </View>
        )}

        {/* ===================================================
            SUBMIT BUTTON
        =================================================== */}

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={loading}
          onPress={handleInquirySubmit}
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}>
          {loading ? (
            <View style={styles.submitRow}>
              <ActivityIndicator size="small" color={COLORS.white} />

              <Text style={styles.submitBtnText}>Sending Inquiry...</Text>
            </View>
          ) : (
            <View style={styles.submitRow}>
              <FontAwesome name="paper-plane" size={13} color={COLORS.white} />

              <Text style={styles.submitBtnText}>Send Inquiry</Text>

              <View style={styles.arrowBox}>
                <FontAwesome
                  name="angle-right"
                  size={17}
                  color={COLORS.white}
                />
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* ===================================================
            DEPARTMENT NOTE
        =================================================== */}

        <View style={styles.departmentRow}>
          <View style={styles.departmentDot} />

          <Text style={styles.departmentText}>
            Inquiry will be sent to the Medanta department of GIEO Gita.
          </Text>
        </View>
      </View>
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  // ==========================================================
  // SECTION
  // ==========================================================

  contactSection: {
    paddingHorizontal: 18,
    paddingBottom: 12
  },
  // ==========================================================
  // LOCATION
  // ==========================================================

  locationCard: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    paddingHorizontal: 15,
    paddingVertical: 16,
    marginBottom: 12,
    borderRadius: 24,
    backgroundColor: DESIGN.colors.surface,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    elevation: 2,
    shadowColor: COLORS.darkBrown,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.045,
    shadowRadius: 8
  },
  locationAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: COLORS.brown
  },
  locationIconBox: {
    width: 47,
    height: 47,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: COLORS.brown,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)'
  },
  locationTextCol: {
    flex: 1
  },
  locationSmallLabel: {
    color: COLORS.softBrown,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 3
  },
  locationTitle: {
    color: COLORS.darkBrown,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 3
  },
  locationAddr: {
    color: COLORS.softBrown,
    fontSize: 12,
    marginBottom: 6
  },
  locationBottom: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  freeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
    backgroundColor: COLORS.green
  },
  locationSub: {
    flex: 1,
    color: COLORS.mutedBrown,
    fontSize: 12,
    lineHeight: 18
  },
  // ==========================================================
  // CONTACT BUTTONS
  // ==========================================================

  contactBtnRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginBottom: 25
  },
  contactBtn: {
    flex: 1,
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: COLORS.biscuitLight,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  brownContactBtn: {
    backgroundColor: COLORS.brown,
    borderColor: COLORS.darkBrown
  },
  darkContactBtn: {
    backgroundColor: COLORS.darkBrown,
    borderColor: COLORS.darkBrown
  },
  contactBtnText: {
    color: COLORS.darkBrown,
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "600"
  },
  contactBtnWhiteText: {
    color: COLORS.white,
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "600"
  },
  // ==========================================================
  // INQUIRY HEADER
  // ==========================================================

  inquiryHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  inquiryIconBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: COLORS.biscuitLight,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  inquiryHeadingText: {
    flex: 1
  },
  inquiryLabel: {
    color: COLORS.softBrown,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.1,
    marginBottom: 2
  },
  inquiryTitle: {
    color: COLORS.darkBrown,
    fontSize: 16,
    fontWeight: "600"
  },
  inquirySubtitle: {
    color: COLORS.softBrown,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2
  },
  // ==========================================================
  // FORM CARD
  // ==========================================================

  formCard: {
    position: 'relative',
    overflow: 'hidden',
    paddingHorizontal: 15,
    paddingTop: 19,
    paddingBottom: 15,
    borderRadius: 24,
    backgroundColor: DESIGN.colors.surface,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    elevation: 2,
    shadowColor: COLORS.darkBrown,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.045,
    shadowRadius: 8
  },
  // ==========================================================
  // TOP ACCENT
  // ==========================================================

  topAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    flexDirection: 'row'
  },
  topAccentDark: {
    flex: 1,
    backgroundColor: COLORS.darkBrown
  },
  topAccentBrown: {
    flex: 1,
    backgroundColor: COLORS.brown
  },
  // ==========================================================
  // FORM FIELDS
  // ==========================================================

  field: {
    marginBottom: 12
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  label: {
    color: COLORS.darkBrown,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6
  },
  required: {
    color: COLORS.error
  },
  optional: {
    color: COLORS.mutedBrown,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 6
  },
  counter: {
    color: COLORS.mutedBrown,
    fontSize: 10,
    marginBottom: 6
  },
  // ==========================================================
  // NORMAL INPUT
  // ==========================================================

  input: {
    height: 50,
    paddingHorizontal: 13,
    borderRadius: 10,
    backgroundColor: COLORS.biscuitLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.darkBrown,
    fontSize: 15
  },
  // ==========================================================
  // PHONE
  // ==========================================================

  phoneContainer: {
    height: 52,
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: 14,
    backgroundColor: COLORS.biscuitLight,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  countryCodeBox: {
    width: 57,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.biscuit,
    borderRightWidth: 1,
    borderRightColor: COLORS.border
  },
  countryCode: {
    color: COLORS.brown,
    fontSize: 12,
    fontWeight: "600"
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 12,
    color: COLORS.darkBrown,
    fontSize: 15
  },
  // ==========================================================
  // MESSAGE
  // ==========================================================

  messageInput: {
    minHeight: 95,
    maxHeight: 125,
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.biscuitLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.darkBrown,
    fontSize: 12,
    lineHeight: 18
  },
  // ==========================================================
  // CONSENT
  // ==========================================================

  consentWrap: {
    marginBottom: 4
  },
  // ==========================================================
  // RESPONSE
  // ==========================================================

  responseBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginBottom: 11,
    borderRadius: 10,
    borderWidth: 1
  },
  successBox: {
    backgroundColor: COLORS.greenLight,
    borderColor: '#CAD6B3'
  },
  errorBox: {
    backgroundColor: COLORS.errorLight,
    borderColor: '#E3BBAE'
  },
  responseIcon: {
    width: 23,
    height: 23,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  successIcon: {
    backgroundColor: COLORS.green
  },
  errorIcon: {
    backgroundColor: COLORS.error
  },
  responseIconText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '900'
  },
  responseText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600'
  },
  successText: {
    color: '#596A40'
  },
  errorText: {
    color: '#914735'
  },
  // ==========================================================
  // SUBMIT BUTTON
  // ==========================================================

  submitBtn: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: COLORS.richBrown,
    borderWidth: 1,
    borderColor: COLORS.saffron,
    elevation: 2,
    shadowColor: COLORS.saffron,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    minHeight: 52
  },
  submitBtnDisabled: {
    opacity: 0.6
  },
  submitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
    marginHorizontal: 7
  },
  arrowBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 3,
    backgroundColor: COLORS.darkBrown
  },
  // ==========================================================
  // DEPARTMENT
  // ==========================================================

  departmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  departmentDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 6,
    backgroundColor: COLORS.brown
  },
  departmentText: {
    color: COLORS.mutedBrown,
    fontSize: 12
  }
});
