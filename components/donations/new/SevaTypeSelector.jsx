import { DESIGN } from '@/constants/design';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS, RGB } from '@/constants/brandColors';
import { hairline, radii, shadow } from '@/constants/theme';

export const SEVA_TYPES = [
  {
    label: 'General Seva',
    value: 'other',
  },
  {
    label: 'Gau Seva',
    value: 'Gau Seva',
  },
  {
    label: 'Gau Poojan Seva',
    value: 'Gau-Poojan Seva',
  },
  {
    label: 'Gita Learning Seva',
    value: 'gita_learning_seva',
  },
  {
    label: 'Vidya Seva',
    value: 'vidya_seva',
  },
  {
    label: 'Food Distribution Seva',
    value: 'food_distribution_seva',
  },
  {
    label: 'Jano Gita Mano Gita',
    value: 'jano_gita_mano_gita',
  },
];

const SevaTypeSelector = ({ value, onChange }) => {
  const [visible, setVisible] = useState(false);

  const selected =
    SEVA_TYPES.find(item => item.value === value) || SEVA_TYPES[0];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Seva Type
        <Text style={styles.required}> *</Text>
      </Text>

      <TouchableOpacity
        style={styles.selector}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}>
        <View style={styles.icon}>
          <Ionicons name="heart-outline" size={16} color={COLORS.saffron} />
        </View>

        <Text style={styles.selectorText}>{selected.label}</Text>

        <Ionicons name="chevron-down" size={16} color={COLORS.warmBrown} />
      </TouchableOpacity>

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>Choose Seva</Text>

                <Text style={styles.sheetSubtitle}>
                  Select where you would like to contribute
                </Text>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setVisible(false)}>
                <Ionicons name="close" size={18} color={COLORS.deepBrown} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {SEVA_TYPES.map(item => {
                const active = item.value === value;

                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[styles.option, active && styles.optionActive]}
                    onPress={() => {
                      onChange(item.value);

                      setVisible(false);
                    }}>
                    <Text
                      style={[
                        styles.optionText,
                        active && styles.optionTextActive,
                      ]}>
                      {item.label}
                    </Text>

                    {active && (
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color={COLORS.saffron}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default SevaTypeSelector;

const styles = StyleSheet.create({
  container: {
    marginBottom: 11
  },
  label: {
    marginLeft: 2,
    marginBottom: 5,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.deepBrown
  },
  required: {
    color: COLORS.dangerRed
  },
  selector: {
    height: 44,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: hairline,
    backgroundColor: COLORS.creamDark,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11
  },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectorText: {
    flex: 1,
    marginLeft: 9,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.deepBrown
  },
  overlay: {
    flex: 1,
    backgroundColor: `rgba(${RGB.deepBrown},0.35)`,
    justifyContent: 'flex-end'
  },
  sheet: {
    maxHeight: '65%',
    backgroundColor: COLORS.cream,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: 18,
    ...shadow.raised
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "400",
    color: COLORS.deepBrown,
    fontFamily: DESIGN.fonts.editorial,
    letterSpacing: -0.4
  },
  sheetSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: COLORS.warmBrown
  },
  closeButton: {
    marginLeft: 'auto',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center'
  },
  option: {
    minHeight: 48,
    paddingHorizontal: 12,
    borderRadius: radii.md,
    flexDirection: 'row',
    alignItems: 'center'
  },
  optionActive: {
    backgroundColor: COLORS.creamDark
  },
  optionText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.warmBrown
  },
  optionTextActive: {
    fontWeight: '700',
    color: COLORS.deepBrown
  }
});
