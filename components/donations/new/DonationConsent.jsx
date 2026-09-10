
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '@/constants/brandColors';
import { hairline, radii } from '@/constants/theme';

const Checkbox = ({ checked, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.checkbox, checked && styles.checkboxActive]}
      onPress={onPress}
      activeOpacity={0.8}>
      {checked && <Ionicons name="checkmark" size={13} color={COLORS.white} />}
    </TouchableOpacity>
  );
};

const DonationConsent = ({
  whatsappOptIn,
  setWhatsappOptIn,
  termsAccepted,
  setTermsAccepted,
  privacyAccepted,
  setPrivacyAccepted,
}) => {
  const router = useRouter();

  return (
    <View>
      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <View style={styles.infoIcon}>
            <Ionicons name="receipt-outline" size={17} color={COLORS.saffron} />
          </View>

          <Text style={styles.infoTitle}>Donation & 80G Information</Text>
        </View>

        <Text style={styles.infoText}>
          Eligible donations may qualify for tax benefits under Section 80G,
          subject to applicable laws and GIEO GITA&apos;s eligibility for the
          relevant donation.
        </Text>

        <Text style={styles.infoText}>
          Please provide accurate name, contact and identity information if you
          require a compliant donation receipt.
        </Text>

        <Text style={styles.infoText}>
          Tax benefits, where applicable, are subject to prevailing Income Tax
          rules. Please consult your tax advisor for individual eligibility.
        </Text>
      </View>

      <View style={styles.consentRow}>
        <Checkbox
          checked={termsAccepted}
          onPress={() => setTermsAccepted(!termsAccepted)}
        />

        <Text style={styles.legalText}>
          I agree to the{' '}
          <Text style={styles.link} onPress={() => router.push('/terms')}>
            Terms & Conditions
          </Text>
          .
        </Text>
      </View>

      <View style={styles.consentRow}>
        <Checkbox
          checked={privacyAccepted}
          onPress={() => setPrivacyAccepted(!privacyAccepted)}
        />

        <Text style={styles.legalText}>
          I have read and accept the{' '}
          <Text
            style={styles.link}
            onPress={() => router.push('/privacy-policy')}>
            Privacy Policy
          </Text>
          .
        </Text>
      </View>
    </View>
  );
};

export default DonationConsent;

const styles = StyleSheet.create({
  infoCard: {
    marginBottom: 15,
    padding: 13,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: hairline,
    backgroundColor: COLORS.white,
    shadowOpacity: 0.045,
    elevation: 2
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  infoIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoTitle: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.deepBrown
  },
  infoText: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.warmBrown
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  checkbox: {
    width: 20,
    height: 20,
    marginTop: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: hairline,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkboxActive: {
    backgroundColor: COLORS.saffron,
    borderColor: COLORS.saffron
  },
  consentContent: {
    flex: 1,
    marginLeft: 9
  },
  consentTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.deepBrown
  },
  consentText: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.warmBrown
  },
  legalText: {
    flex: 1,
    marginLeft: 9,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.warmBrown
  },
  link: {
    color: COLORS.saffron,
    fontWeight: '700',
    textDecorationLine: 'underline'
  }
});
