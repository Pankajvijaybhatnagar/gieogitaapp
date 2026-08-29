import joinGieoGitaServices from '@/lib/services/joinGieoGitaServices';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const COLORS = {
  primary: '#6E3F1F',
  secondary: '#A8692D',
  background: '#FFF9F2',
  text: '#3F2A1F',
  muted: '#8B7566',
};

const Input = ({ label, icon, ...props }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>

    <View style={styles.inputContainer}>
      <Ionicons name={icon} size={18} color={COLORS.secondary} />

      <TextInput
        style={styles.input}
        placeholderTextColor="#B4A397"
        {...props}
      />
    </View>
  </View>
);

export default function EditProfileModal({
  visible,
  profile,
  onClose,
  onUpdated,
}) {
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [anniversary, setAnniversary] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setEmail(profile?.email || '');
      setDob(profile?.dob || '');
      setAnniversary(profile?.aniver_date || '');
    }
  }, [visible, profile]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const payload = {
        hash_id: profile?.hash_id,
        email: email.trim(),
        dob: dob.trim(),
        aniver_date: anniversary.trim(),
      };

      const response = await joinGieoGitaServices.updateProfile(payload);

      if (response?.success || response?.status) {
        Alert.alert('Success', 'Profile updated successfully.');

        onClose();

        await onUpdated?.();

        return;
      }

      Alert.alert(
        'Update Failed',
        response?.error || response?.message || 'Unable to update profile.',
      );
    } catch (error) {
      console.log(error);

      Alert.alert('Error', error?.message || 'Unable to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>MEMBER PROFILE</Text>

              <Text style={styles.title}>Update Profile</Text>
            </View>

            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={21} color={COLORS.text} />
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Input
              label="Email Address"
              icon="mail-outline"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter email"
            />

            <Input
              label="Date of Birth"
              icon="calendar-outline"
              value={dob}
              onChangeText={setDob}
              placeholder="YYYY-MM-DD"
            />

            <Input
              label="Anniversary Date"
              icon="heart-outline"
              value={anniversary}
              onChangeText={setAnniversary}
              placeholder="YYYY-MM-DD"
            />

            <Pressable
              onPress={handleUpdate}
              disabled={loading}
              style={[styles.saveButton, loading && styles.disabled]}>
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color="#FFF"
                  />

                  <Text style={styles.saveText}>Save Changes</Text>
                </>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(33,20,12,0.55)',
  },

  sheet: {
    maxHeight: '82%',
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingBottom: 28,
  },

  handle: {
    width: 48,
    height: 5,
    borderRadius: 10,
    backgroundColor: '#D7C8BD',
    alignSelf: 'center',
    marginVertical: 10,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  eyebrow: {
    color: COLORS.secondary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  title: {
    color: COLORS.text,
    fontSize: 23,
    fontWeight: '800',
    marginTop: 3,
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFE2D5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 7,
  },

  inputContainer: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: '#E4D4C6',
    backgroundColor: '#FFF',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    color: COLORS.text,
    fontSize: 14,
  },

  saveButton: {
    marginTop: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  saveText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },

  disabled: {
    opacity: 0.65,
  },
});
