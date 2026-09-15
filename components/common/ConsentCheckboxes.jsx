import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/constants/brandColors';
import { hairline } from '@/constants/theme';

const Checkbox = ({ checked, onPress, disabled }) => (
  <TouchableOpacity
    style={[styles.checkbox, checked && styles.checkboxActive]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.8}>
    {checked && <Ionicons name="checkmark" size={13} color={COLORS.white} />}
  </TouchableOpacity>
);

// Shared Terms & Conditions / Privacy Policy consent rows — reused across
// every form that collects personal data, so the wording, links and look
// stay identical everywhere instead of being re-implemented per screen.
export default function ConsentCheckboxes({
  termsAccepted,
  onToggleTerms,
  privacyAccepted,
  onTogglePrivacy,
  disabled,
  style,
}) {
  const router = useRouter();

  return (
    <View style={[style, disabled && styles.disabled]}>
      <View style={styles.consentRow}>
        <Checkbox
          checked={termsAccepted}
          onPress={onToggleTerms}
          disabled={disabled}
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
          onPress={onTogglePrivacy}
          disabled={disabled}
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
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.6,
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
    borderColor: hairline,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: COLORS.saffron,
    borderColor: COLORS.saffron,
  },
  legalText: {
    flex: 1,
    marginLeft: 9,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.warmBrown,
  },
  link: {
    color: COLORS.saffron,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
