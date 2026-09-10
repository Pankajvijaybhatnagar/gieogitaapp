import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '@/constants/brandColors';
import { radii, spacing, type } from '@/constants/theme';

// Single shared button style for the whole app: solid saffron fill, white
// readable text, generous rounded corners. Use this everywhere instead of
// one-off TouchableOpacity + StyleSheet button styles so every button in the
// app looks and behaves the same.
//
// Usage:
//   <Button title="Submit" onPress={handleSubmit} />
//   <Button title="Save" onPress={handleSave} loading={saving} />
//   <Button title="Retry" onPress={retry} icon={<Ionicons name="refresh" size={16} color={COLORS.white} />} />
//   <Button title="Disabled" onPress={() => {}} disabled />
//   <Button title="Pill" onPress={() => {}} pill />
export default function Button({
  title,
  children,
  onPress,
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  pill = false,
  style,
  textStyle,
  ...rest
}) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.button,
        pill && styles.pill,
        isDisabled && styles.disabled,
        style,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={COLORS.white} />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' ? (
            <View style={styles.iconLeft}>{icon}</View>
          ) : null}

          <Text style={[styles.text, textStyle]} numberOfLines={1}>
            {title ?? children}
          </Text>

          {icon && iconPosition === 'right' ? (
            <View style={styles.iconRight}>{icon}</View>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: radii.lg,
    backgroundColor: COLORS.richBrown,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  pill: {
    borderRadius: radii.pill,
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  text: {
    ...type.headline,
    color: COLORS.white,
  },
});
