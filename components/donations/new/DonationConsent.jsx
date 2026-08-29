import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Checkbox = ({
  checked,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.checkbox,
        checked && styles.checkboxActive,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {checked && (
        <Ionicons
          name="checkmark"
          size={13}
          color="#FFFFFF"
        />
      )}
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
            <Ionicons
              name="receipt-outline"
              size={17}
              color="#704025"
            />
          </View>

          <Text style={styles.infoTitle}>
            Donation & 80G Information
          </Text>
        </View>

        <Text style={styles.infoText}>
          Eligible donations may qualify for
          tax benefits under Section 80G,
          subject to applicable laws and GIEO
          GITA's eligibility for the relevant
          donation.
        </Text>

        <Text style={styles.infoText}>
          Please provide accurate name,
          contact and identity information if
          you require a compliant donation
          receipt.
        </Text>

        <Text style={styles.infoText}>
          Tax benefits, where applicable, are
          subject to prevailing Income Tax
          rules. Please consult your tax
          advisor for individual eligibility.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.consentRow}
        onPress={() =>
          setWhatsappOptIn(
            !whatsappOptIn,
          )
        }
        activeOpacity={0.85}
      >
        <Checkbox
          checked={whatsappOptIn}
          onPress={() =>
            setWhatsappOptIn(
              !whatsappOptIn,
            )
          }
        />

        <View style={styles.consentContent}>
          <Text style={styles.consentTitle}>
            WhatsApp Updates
          </Text>

          <Text style={styles.consentText}>
            I would like to receive donation
            confirmation and GIEO GITA updates
            on WhatsApp.
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.consentRow}>
        <Checkbox
          checked={termsAccepted}
          onPress={() =>
            setTermsAccepted(
              !termsAccepted,
            )
          }
        />

        <Text style={styles.legalText}>
          I agree to the{' '}

          <Text
            style={styles.link}
            onPress={() =>
              router.push('/terms')
            }
          >
            Terms & Conditions
          </Text>
          .
        </Text>
      </View>

      <View style={styles.consentRow}>
        <Checkbox
          checked={privacyAccepted}
          onPress={() =>
            setPrivacyAccepted(
              !privacyAccepted,
            )
          }
        />

        <Text style={styles.legalText}>
          I have read and accept the{' '}

          <Text
            style={styles.link}
            onPress={() =>
              router.push(
                '/privacy-policy',
              )
            }
          >
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
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5D4C5',
    backgroundColor: '#F8EFE7',
  },

  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  infoIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoTitle: {
    marginLeft: 8,
    fontSize: 11.5,
    fontWeight: '700',
    color: '#553420',
  },

  infoText: {
    marginTop: 5,
    fontSize: 9.5,
    lineHeight: 14,
    color: '#826A57',
  },

  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  checkbox: {
    width: 20,
    height: 20,
    marginTop: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CDB9A8',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxActive: {
    backgroundColor: '#704025',
    borderColor: '#704025',
  },

  consentContent: {
    flex: 1,
    marginLeft: 9,
  },

  consentTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#573925',
  },

  consentText: {
    marginTop: 2,
    fontSize: 9,
    lineHeight: 13,
    color: '#927863',
  },

  legalText: {
    flex: 1,
    marginLeft: 9,
    fontSize: 9.5,
    lineHeight: 15,
    color: '#735A48',
  },

  link: {
    color: '#704025',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});