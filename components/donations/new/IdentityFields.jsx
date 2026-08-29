import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

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
          placeholderTextColor="#AF9987"
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
    marginBottom: 14,
  },

  titleRow: {
    marginBottom: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },

  label: {
    flex: 1,
    fontSize: 10.5,
    fontWeight: '600',
    color: '#634735',
  },

  required: {
    color: '#B54E3F',
  },

  requirementBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: '#F3ECE6',
  },

  requirementBadgeRequired: {
    backgroundColor: '#FBE7E3',
  },

  requirementText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#947A66',
  },

  requirementTextRequired: {
    color: '#A34A3C',
  },

  typeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 7,
  },

  typeButton: {
    minWidth: 68,
    height: 29,
    paddingHorizontal: 13,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E5D6C9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  typeButtonActive: {
    backgroundColor: '#704025',
    borderColor: '#704025',
  },

  typeText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#755541',
  },

  typeTextActive: {
    color: '#FFFFFF',
  },

  inputWrapper: {
    height: 43,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9DCCE',
    backgroundColor: '#FFFFFF',
  },

  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 12,
    color: '#412A1D',
  },

  helper: {
    marginTop: 5,
    fontSize: 9,
    lineHeight: 13,
    color: '#9A806C',
  },
});
