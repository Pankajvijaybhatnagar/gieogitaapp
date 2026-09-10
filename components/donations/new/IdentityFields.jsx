import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS, RGB } from '@/constants/brandColors';
import { hairline, radii } from '@/constants/theme';

const IdentityFields = ({
  amount,
  identityType,
  identityNumber,
  onIdentityTypeChange,
  onIdentityNumberChange,
}) => {
  const required = Number(amount || 0) >= 2000;

  const formatAadhaar = value => {
    const numbers = value.replace(/\D/g, '').slice(0, 12);

    return numbers.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const handleChange = value => {
    if (identityType === 'pan') {
      onIdentityNumberChange(
        value
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, '')
          .slice(0, 10),
      );

      return;
    }

    onIdentityNumberChange(formatAadhaar(value));
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.label}>
          PAN / Aadhaar
          {required && <Text style={styles.required}> *</Text>}
        </Text>

        <View
          style={[
            styles.requirementBadge,
            required && styles.requirementBadgeRequired,
          ]}>
          <Text
            style={[
              styles.requirementText,
              required && styles.requirementTextRequired,
            ]}>
            {required ? 'Required' : 'Optional'}
          </Text>
        </View>
      </View>

      <View style={styles.typeRow}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            identityType === 'pan' && styles.typeButtonActive,
          ]}
          onPress={() => {
            onIdentityTypeChange('pan');
            onIdentityNumberChange('');
          }}>
          <Text
            style={[
              styles.typeText,
              identityType === 'pan' && styles.typeTextActive,
            ]}>
            PAN
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeButton,
            identityType === 'aadhaar' && styles.typeButtonActive,
          ]}
          onPress={() => {
            onIdentityTypeChange('aadhaar');

            onIdentityNumberChange('');
          }}>
          <Text
            style={[
              styles.typeText,
              identityType === 'aadhaar' && styles.typeTextActive,
            ]}>
            Aadhaar
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          value={identityNumber}
          onChangeText={handleChange}
          autoCapitalize="characters"
          keyboardType={identityType === 'aadhaar' ? 'number-pad' : 'default'}
          placeholder={
            identityType === 'pan' ? 'Enter PAN number' : 'Enter Aadhaar number'
          }
          placeholderTextColor={COLORS.warmBrown}
          style={styles.input}
        />
      </View>

      <Text style={styles.helper}>
        {required
          ? 'Identity information is required for this donation amount as configured by GIEO GITA.'
          : 'You may provide identity information for receipt and compliance purposes.'}
      </Text>
    </View>
  );
};

export default IdentityFields;

const styles = StyleSheet.create({
  container: {
    marginBottom: 14
  },
  titleRow: {
    marginBottom: 7,
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.deepBrown
  },
  required: {
    color: COLORS.dangerRed
  },
  requirementBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: COLORS.creamDark
  },
  requirementBadgeRequired: {
    backgroundColor: `rgba(${RGB.dangerRed},0.1)`
  },
  requirementText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.warmBrown
  },
  requirementTextRequired: {
    color: COLORS.dangerRed
  },
  typeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 7
  },
  typeButton: {
    minWidth: 68,
    height: 29,
    paddingHorizontal: 13,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: hairline,
    justifyContent: 'center',
    alignItems: 'center'
  },
  typeButtonActive: {
    backgroundColor: COLORS.richBrown,
    borderColor: COLORS.saffron
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.warmBrown
  },
  typeTextActive: {
    color: COLORS.white
  },
  inputWrapper: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: hairline,
    backgroundColor: COLORS.creamDark
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 15,
    color: COLORS.deepBrown
  },
  helper: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.warmBrown
  }
});
