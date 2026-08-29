import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AmountSelector from './AmountSelector';
import CityAutocomplete from './CityAutocomplete';
import DonationConsent from './DonationConsent';
import FormField from './FormField';
import IdentityFields from './IdentityFields';
import SevaTypeSelector from './SevaTypeSelector';

const DonationForm = ({ profile, submitting, serverError, onSubmit }) => {
  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [phone, setPhone] = useState('');

  const [amount, setAmount] = useState('501');

  const [sevaType, setSevaType] = useState('other');

  const [city, setCity] = useState('');

  const [district, setDistrict] = useState('');

  const [state, setState] = useState('');

  const [country, setCountry] = useState('');

  const [pincode, setPincode] = useState('');

  const [address, setAddress] = useState('');

  const [message, setMessage] = useState('');

  const [identityType, setIdentityType] = useState('pan');

  const [identityNumber, setIdentityNumber] = useState('');

  const [whatsappOptIn, setWhatsappOptIn] = useState(true);

  const [termsAccepted, setTermsAccepted] = useState(false);

  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | PREFILL PROFILE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!profile) return;

    setName(profile?.name || '');

    setEmail(profile?.email || '');

    setPhone(profile?.phone || '');

    setCity(profile?.city || '');

    setDistrict(profile?.district || '');

    setState(profile?.state || '');

    setCountry(profile?.country || 'India');

    setPincode(profile?.pincode || '');

    setAddress(profile?.address || '');
  }, [profile]);

  const handleLocationSelect = location => {
    setCity(location?.city || '');

    setDistrict(location?.district || '');

    setState(location?.state || '');

    setCountry(location?.country || '');

    if (location?.pincode) {
      setPincode(location.pincode);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | VALIDATION
  |--------------------------------------------------------------------------
  */

  const validate = () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your name.');

      return false;
    }

    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address.');

      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');

      return false;
    }

    if (!phone.trim()) {
      Alert.alert('Phone Required', 'Please enter your phone number.');

      return false;
    }

    if (phone.replace(/\D/g, '').length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number.');

      return false;
    }

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      Alert.alert('Amount Required', 'Please enter a valid donation amount.');

      return false;
    }

    if (!sevaType) {
      Alert.alert('Seva Required', 'Please select a seva type.');

      return false;
    }

    if (!city.trim()) {
      Alert.alert('City Required', 'Please select your city.');

      return false;
    }

    /*
     * Required according to your app rule.
     */
    if (numericAmount >= 2000) {
      if (!identityNumber.trim()) {
        Alert.alert(
          'Identity Required',
          `Please enter your ${
            identityType === 'pan' ? 'PAN' : 'Aadhaar'
          } number.`,
        );

        return false;
      }

      if (
        identityType === 'pan' &&
        identityNumber.replace(/\s/g, '').length !== 10
      ) {
        Alert.alert('Invalid PAN', 'Please enter a valid 10-character PAN.');

        return false;
      }

      if (
        identityType === 'aadhaar' &&
        identityNumber.replace(/\D/g, '').length !== 12
      ) {
        Alert.alert(
          'Invalid Aadhaar',
          'Please enter a valid 12-digit Aadhaar number.',
        );

        return false;
      }
    }

    if (!termsAccepted) {
      Alert.alert('Terms Required', 'Please accept the Terms & Conditions.');

      return false;
    }

    if (!privacyAccepted) {
      Alert.alert('Privacy Policy', 'Please accept the Privacy Policy.');

      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    onSubmit({
      name,
      email,
      phone,

      amount,
      sevaType,

      city,
      district,
      state,
      country,
      pincode,
      address,

      message,

      identityType,
      identityNumber,

      whatsappOptIn,
      termsAccepted,
      privacyAccepted,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="heart" size={20} color="#FFFFFF" />
          </View>

          <View style={styles.headerContent}>
            <Text style={styles.eyebrow}>GITA SEVA</Text>

            <Text style={styles.title}>Make a Donation</Text>

            <Text style={styles.subtitle}>
              Your contribution supports the mission of GIEO GITA.
            </Text>
          </View>
        </View>

        {serverError ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={16} color="#A34B3C" />

            <Text style={styles.errorText}>{serverError}</Text>
          </View>
        ) : null}

        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Donation Details</Text>
        </View>

        <View style={styles.card}>
          <SevaTypeSelector value={sevaType} onChange={setSevaType} />

          <AmountSelector amount={amount} onChange={setAmount} />
        </View>

        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Donor Information</Text>
        </View>

        <View style={styles.card}>
          <FormField
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Your full name"
            icon="person-outline"
            required
          />

          <FormField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            required
          />

          <FormField
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone number"
            icon="call-outline"
            keyboardType="phone-pad"
            required
          />
        </View>

        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Location</Text>

          <Text style={styles.sectionHint}>Search and select your city</Text>
        </View>

        <View style={styles.card}>
          <CityAutocomplete
            city={city}
            onCityChange={setCity}
            onLocationSelect={handleLocationSelect}
          />

          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <FormField
                label="District"
                value={district}
                onChangeText={setDistrict}
                placeholder="District"
                icon="map-outline"
              />
            </View>

            <View style={styles.column}>
              <FormField
                label="State"
                value={state}
                onChangeText={setState}
                placeholder="State"
                icon="navigate-outline"
              />
            </View>
          </View>

          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <FormField
                label="Country"
                value={country}
                onChangeText={setCountry}
                placeholder="Country"
                icon="globe-outline"
              />
            </View>

            <View style={styles.column}>
              <FormField
                label="Pincode"
                value={pincode}
                onChangeText={setPincode}
                placeholder="Pincode"
                keyboardType="number-pad"
                icon="pin-outline"
              />
            </View>
          </View>

          <FormField
            label="Address"
            value={address}
            onChangeText={setAddress}
            placeholder="House / street address"
            icon="home-outline"
          />
        </View>

        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Receipt & Compliance</Text>
        </View>

        <View style={styles.card}>
          <IdentityFields
            amount={amount}
            identityType={identityType}
            identityNumber={identityNumber}
            onIdentityTypeChange={setIdentityType}
            onIdentityNumberChange={setIdentityNumber}
          />

          <FormField
            label="Message"
            value={message}
            onChangeText={setMessage}
            placeholder="Message or prayer request (optional)"
            icon="chatbubble-outline"
            multiline
            maxLength={500}
          />
        </View>

        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Confirmation</Text>
        </View>

        <View style={styles.card}>
          <DonationConsent
            whatsappOptIn={whatsappOptIn}
            setWhatsappOptIn={setWhatsappOptIn}
            termsAccepted={termsAccepted}
            setTermsAccepted={setTermsAccepted}
            privacyAccepted={privacyAccepted}
            setPrivacyAccepted={setPrivacyAccepted}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.85}>
          {submitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="heart" size={17} color="#FFFFFF" />

              <Text style={styles.submitText}>
                Proceed to Donate ₹{Number(amount || 0).toLocaleString('en-IN')}
              </Text>

              <Ionicons name="arrow-forward" size={17} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>

        <View style={styles.secureRow}>
          <Ionicons name="shield-checkmark-outline" size={13} color="#846A57" />

          <Text style={styles.secureText}>
            Your payment will be processed securely through the authorized
            payment gateway.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default DonationForm;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 17,
    paddingBottom: 45,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },

  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#704025',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerContent: {
    flex: 1,
    marginLeft: 11,
  },

  eyebrow: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#AE7957',
  },

  title: {
    marginTop: 2,
    fontSize: 22,
    fontWeight: '700',
    color: '#472C1B',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 10.5,
    lineHeight: 15,
    color: '#8C725F',
  },

  sectionTitleRow: {
    marginTop: 4,
    marginBottom: 6,
    marginHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#523421',
  },

  sectionHint: {
    marginLeft: 'auto',
    fontSize: 8.5,
    color: '#A08673',
  },

  card: {
    marginBottom: 14,
    padding: 13,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECDFD3',
    backgroundColor: '#FFFFFF',

    shadowColor: '#63412B',
    shadowOpacity: 0.035,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 1,
  },

  twoColumn: {
    flexDirection: 'row',
    gap: 7,
  },

  column: {
    flex: 1,
  },

  errorBox: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 11,
    backgroundColor: '#FBEDEA',
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
  },

  errorText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 14,
    color: '#964839',
  },

  submitButton: {
    minHeight: 49,
    marginTop: 4,
    paddingHorizontal: 15,
    borderRadius: 16,
    backgroundColor: '#65391F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,

    shadowColor: '#4E2917',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 3,
  },

  submitDisabled: {
    opacity: 0.65,
  },

  submitText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  secureRow: {
    marginTop: 11,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secureText: {
    marginLeft: 5,
    fontSize: 8.5,
    lineHeight: 12,
    textAlign: 'center',
    color: '#927965',
  },
});
