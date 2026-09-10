import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '@/context/AuthContext';
import { useAppAlert } from '@/context/AppAlertContext';
import masikPatrikaServices from '@/lib/services/masikPatrikaServices';

import { COLORS } from '@/constants/brandColors';
import { hairline } from '@/constants/theme';

export default function PatrikaSubscribeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { access_token, isAuthenticated } = useAuth();
  const { error, confirm } = useAppAlert();

  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    subscription_type: 'yearly',
    name: '',
    phone: '',
    email: '',
  });

  const patrikaId = Array.isArray(params.patrikaId)
    ? params.patrikaId[0]
    : params.patrikaId;

  const patrikaTitle = Array.isArray(params.patrikaTitle)
    ? params.patrikaTitle[0]
    : params.patrikaTitle;

  const price = Array.isArray(params.price) ? params.price[0] : params.price;

  const displayPrice = useMemo(() => {
    const value = Number(price);

    return value > 0 ? `₹${value.toLocaleString('en-IN')}` : '₹150';
  }, [price]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubscriptionType = type => {
    setFormData(prev => ({
      ...prev,
      subscription_type: type,
    }));
  };

  const validateForm = () => {
    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();

    if (!name) {
      error('Required', 'Please enter your name.');
      return false;
    }

    if (!phone) {
      error('Required', 'Please enter your WhatsApp number.');
      return false;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      error(
        'Invalid Number',
        'Please enter a valid 10-digit WhatsApp number.',
      );
      return false;
    }

    if (!email) {
      error('Required', 'Please enter your email address.');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      error('Invalid Email', 'Please enter a valid email address.');
      return false;
    }

    return true;
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated || !access_token) {
      router.push('/login2');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      /*
       * Payload matches the website subscription form:
       *
       * subscription_type
       * name
       * phone
       * email
       *
       * patrika_id is also included so the mobile app can
       * associate the subscription request with the selected
       * Patrika issue if the backend supports it.
       */
      const payload = {
        subscription_type: formData.subscription_type,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        patrika_id: patrikaId ? Number(patrikaId) : undefined,
      };

      console.log('[Patrika] Subscription payload:', payload);

      const response = await masikPatrikaServices.subscribe(
        payload,
        access_token,
      );

      if (response?.success === false) {
        throw new Error(
          response?.error ||
            response?.message ||
            'Unable to start subscription.',
        );
      }

      confirm(
        'Subscription Successful',
        response?.message ||
          'Your subscription request was submitted successfully.',
        () => router.replace('/home/patrika'),
        {
          buttonText: 'View Patrika',
          secondaryButtonText: null,
          icon: 'checkmark-circle',
        },
      );
    } catch (err) {
      console.log('[Patrika] Subscription error:', err);

      error(
        'Subscription Failed',
        err?.message || 'Unable to process your subscription.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={20} color={COLORS.deepBrown} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Subscribe to Patrika</Text>

            <View style={{ width: 38 }} />
          </View>

          {/* Hero */}
          <View style={styles.heroCard}>
            <View style={styles.bookIcon}>
              <Ionicons name="book" size={30} color="#FFFFFF" />
            </View>

            <Text style={styles.eyebrow}>GIEO GITA • MONTHLY</Text>

            <Text style={styles.title}>Monthly Patrika</Text>

            {patrikaTitle ? (
              <Text style={styles.issueTitle}>{patrikaTitle}</Text>
            ) : null}

            <Text style={styles.description}>
              Subscribe to access paid Patrika issues and read them securely
              inside the app.
            </Text>
          </View>

          {/* Subscription */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Subscription</Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleSubscriptionType('yearly')}
              style={[
                styles.subscriptionOption,
                formData.subscription_type === 'yearly' &&
                  styles.subscriptionOptionActive,
              ]}>
              <View style={styles.radioOuter}>
                {formData.subscription_type === 'yearly' && (
                  <View style={styles.radioInner} />
                )}
              </View>

              <View style={styles.subscriptionInfo}>
                <Text style={styles.subscriptionTitle}>
                  Yearly Subscription
                </Text>

                <Text style={styles.subscriptionText}>
                  Full access to Monthly Patrika
                </Text>
              </View>

              <Text style={styles.subscriptionPrice}>₹150</Text>
            </TouchableOpacity>
          </View>

          {/* Selected issue */}
          {patrikaTitle ? (
            <View style={styles.issueCard}>
              <View style={styles.issueIcon}>
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={COLORS.goldDark}
                />
              </View>

              <View style={styles.issueInfo}>
                <Text style={styles.issueLabel}>SELECTED PATRIKA</Text>

                <Text style={styles.issueName} numberOfLines={2}>
                  {patrikaTitle}
                </Text>
              </View>

              <Text style={styles.issuePrice}>{displayPrice}</Text>
            </View>
          ) : null}

          {/* Form */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Your Details</Text>

            <Text style={styles.formSubtitle}>
              Enter your details to complete the subscription request.
            </Text>

            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Your Name</Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={COLORS.goldDark}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor="#A38C79"
                  value={formData.name}
                  onChangeText={value => handleInputChange('name', value)}
                  autoCapitalize="words"
                  editable={!submitting}
                />
              </View>
            </View>

            {/* Phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Your WhatsApp Number</Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="logo-whatsapp"
                  size={18}
                  color={COLORS.goldDark}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter 10-digit WhatsApp number"
                  placeholderTextColor="#A38C79"
                  value={formData.phone}
                  onChangeText={value =>
                    handleInputChange('phone', value.replace(/[^0-9]/g, ''))
                  }
                  keyboardType="phone-pad"
                  maxLength={10}
                  editable={!submitting}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Your Email Address</Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={COLORS.goldDark}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter your email address"
                  placeholderTextColor="#A38C79"
                  value={formData.email}
                  onChangeText={value => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!submitting}
                />
              </View>
            </View>
          </View>

          {/* Security note */}
          <View style={styles.note}>
            <Ionicons
              name="shield-checkmark-outline"
              size={17}
              color={COLORS.goldDark}
            />

            <Text style={styles.noteText}>
              Your subscription details are linked to your account and used only
              to process your Patrika subscription.
            </Text>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.subscribeButton, submitting && styles.disabled]}
            activeOpacity={0.88}
            onPress={handleSubscribe}
            disabled={submitting}>
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons name="lock-open-outline" size={18} color="#FFFFFF" />

                <Text style={styles.subscribeButtonText}>Subscribe Now</Text>

                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.creamDark
  },
  keyboard: {
    flex: 1
  },
  content: {
    padding: 16,
    paddingBottom: 40
  },
  header: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.deepBrown
  },
  heroCard: {
    alignItems: 'center',
    padding: 22,
    borderRadius: 22,
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: hairline
  },
  bookIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.richBrown,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 1.8,
    color: COLORS.saffron,
    fontWeight: "600"
  },
  title: {
    marginTop: 7,
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.deepBrown
  },
  issueTitle: {
    marginTop: 5,
    fontSize: 12,
    color: COLORS.saffron,
    fontWeight: '700',
    textAlign: 'center'
  },
  description: {
    marginTop: 10,
    maxWidth: 310,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.warmBrown,
    textAlign: 'center'
  },
  section: {
    marginTop: 15
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.deepBrown,
    marginBottom: 9
  },
  subscriptionOption: {
    minHeight: 76,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 17,
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: hairline,
    flexDirection: 'row',
    alignItems: 'center'
  },
  subscriptionOptionActive: {
    borderColor: COLORS.gold,
    backgroundColor: '#FFFDF7'
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.goldDark,
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: COLORS.goldDark
  },
  subscriptionInfo: {
    flex: 1,
    marginLeft: 11
  },
  subscriptionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.deepBrown
  },
  subscriptionText: {
    marginTop: 3,
    fontSize: 12,
    color: COLORS.warmBrown
  },
  subscriptionPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.warmBrown
  },
  issueCard: {
    marginTop: 15,
    padding: 14,
    borderRadius: 24,
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: hairline,
    flexDirection: 'row',
    alignItems: 'center',
    shadowOpacity: 0.045,
    elevation: 2
  },
  issueIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center'
  },
  issueInfo: {
    flex: 1,
    marginLeft: 10
  },
  issueLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    color: COLORS.warmBrown
  },
  issueName: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
    color: COLORS.deepBrown
  },
  issuePrice: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.warmBrown
  },
  formCard: {
    marginTop: 15,
    padding: 16,
    borderRadius: 24,
    backgroundColor: COLORS.cream,
    borderWidth: 1,
    borderColor: hairline,
    shadowOpacity: 0.045,
    elevation: 2
  },
  formTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.deepBrown
  },
  formSubtitle: {
    marginTop: 4,
    marginBottom: 15,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.warmBrown
  },
  inputGroup: {
    marginBottom: 13
  },
  inputLabel: {
    marginBottom: 6,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.warmBrown
  },
  inputWrapper: {
    minHeight: 48,
    paddingHorizontal: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: hairline,
    backgroundColor: COLORS.creamDark,
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    marginLeft: 9,
    paddingVertical: 0,
    fontSize: 15,
    color: COLORS.deepBrown
  },
  note: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    padding: 12,
    borderRadius: 13,
    backgroundColor: COLORS.cream
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.warmBrown
  },
  subscribeButton: {
    marginTop: 18,
    minHeight: 52,
    borderRadius: 26,
    backgroundColor: COLORS.richBrown,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: "600"
  },
  disabled: {
    opacity: 0.6
  }
});
