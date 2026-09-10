import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS } from '@/constants/brandColors';
import { hairline, radii } from '@/constants/theme';

const AMOUNTS = [101, 501, 1100, 2100, 5100];

const AmountSelector = ({ amount, onChange }) => {
  const selectedAmount = Number(amount || 0);

  const handlePreset = value => {
    onChange(String(value));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Donation Amount
        <Text style={styles.required}> *</Text>
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.presetRow}>
        {AMOUNTS.map(value => {
          const selected = selectedAmount === value;

          return (
            <TouchableOpacity
              key={value}
              style={[
                styles.presetButton,
                selected && styles.presetButtonSelected,
              ]}
              onPress={() => handlePreset(value)}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.presetText,
                  selected && styles.presetTextSelected,
                ]}>
                ₹{value}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.customWrapper}>
        <Text style={styles.currency}>₹</Text>

        <TextInput
          value={amount}
          onChangeText={value => {
            const cleaned = value.replace(/[^0-9.]/g, '');

            onChange(cleaned);
          }}
          keyboardType="decimal-pad"
          placeholder="Enter custom amount"
          placeholderTextColor={COLORS.warmBrown}
          style={styles.customInput}
        />
      </View>

      <Text style={styles.helper}>
        Select an amount above or enter your preferred contribution.
      </Text>
    </View>
  );
};

export default AmountSelector;

const styles = StyleSheet.create({
  container: {
    marginBottom: 14
  },
  label: {
    marginLeft: 2,
    marginBottom: 7,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.deepBrown
  },
  required: {
    color: COLORS.dangerRed
  },
  presetRow: {
    gap: 6,
    paddingRight: 4
  },
  presetButton: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: hairline,
    backgroundColor: COLORS.creamDark,
    justifyContent: 'center',
    alignItems: 'center'
  },
  presetButtonSelected: {
    backgroundColor: COLORS.richBrown,
    borderColor: COLORS.saffron
  },
  presetText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.saffron
  },
  presetTextSelected: {
    color: COLORS.white
  },
  customWrapper: {
    height: 44,
    marginTop: 9,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: hairline,
    backgroundColor: COLORS.creamDark,
    flexDirection: 'row',
    alignItems: 'center'
  },
  currency: {
    marginLeft: 13,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.saffron
  },
  customInput: {
    flex: 1,
    paddingHorizontal: 9,
    fontSize: 13,
    color: COLORS.deepBrown
  },
  helper: {
    marginTop: 5,
    marginLeft: 2,
    fontSize: 12,
    color: COLORS.warmBrown
  }
});
