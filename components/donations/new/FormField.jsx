import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const FormField = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  editable = true,
  required = false,
  multiline = false,
  maxLength,
  rightElement,
}) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>
        {label}

        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <View
        style={[
          styles.inputWrapper,
          multiline && styles.multilineWrapper,
          !editable && styles.disabledWrapper,
        ]}>
        {icon && (
          <Ionicons name={icon} size={16} color="#94745D" style={styles.icon} />
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#B09A88"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          multiline={multiline}
          maxLength={maxLength}
          style={[styles.input, multiline && styles.multilineInput]}
        />

        {rightElement}
      </View>
    </View>
  );
};

export default FormField;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 11,
  },

  label: {
    marginLeft: 2,
    marginBottom: 5,
    fontSize: 10.5,
    fontWeight: '600',
    color: '#634735',
  },

  required: {
    color: '#B54E3F',
  },

  inputWrapper: {
    minHeight: 43,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9DCCE',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
  },

  disabledWrapper: {
    backgroundColor: '#F8F3ED',
  },

  multilineWrapper: {
    minHeight: 88,
    alignItems: 'flex-start',
  },

  icon: {
    marginLeft: 12,
    marginRight: 3,
  },

  input: {
    flex: 1,
    minHeight: 43,
    paddingHorizontal: 8,
    fontSize: 12,
    color: '#412A1D',
  },

  multilineInput: {
    minHeight: 85,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
});
