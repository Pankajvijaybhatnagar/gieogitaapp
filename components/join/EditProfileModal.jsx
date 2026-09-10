import joinGieoGitaServices from '@/lib/services/joinGieoGitaServices';
import { useAppAlert } from '@/context/AppAlertContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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

import { COLORS, RGB } from '@/constants/brandColors';
import { hairline, radii, spacing, type } from '@/constants/theme';

const Input = ({ label, icon, ...props }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>

    <View style={styles.inputContainer}>
      <Ionicons name={icon} size={18} color={COLORS.goldDark} />

      <TextInput
        style={styles.input}
        placeholderTextColor={`rgba(${RGB.deepBrown}, 0.4)`}
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
  const { success, error } = useAppAlert();
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
        success('Success', 'Profile updated successfully.');

        onClose();

        await onUpdated?.();

        return;
      }

      error(
        'Update Failed',
        response?.error || response?.message || 'Unable to update profile.',
      );
    } catch (err) {
      console.log(err);

      error('Error', err?.message || 'Unable to update profile.');
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
              <Ionicons name="close" size={21} color={COLORS.deepBrown} />
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
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color={COLORS.white}
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
    justifyContent: 'flex-end'
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `rgba(${RGB.deepBrown}, 0.55)`
  },
  sheet: {
    maxHeight: '82%',
    backgroundColor: COLORS.creamDark,
    borderTopLeftRadius: radii.xl + 6,
    borderTopRightRadius: radii.xl + 6,
    paddingHorizontal: spacing.lg - 4,
    paddingBottom: spacing.lg + 4
  },
  handle: {
    width: 48,
    height: 5,
    borderRadius: radii.sm,
    backgroundColor: hairline,
    alignSelf: 'center',
    marginVertical: spacing.sm + 2
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg - 2
  },
  eyebrow: {
    color: COLORS.goldDark,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.5
  },
  title: {
    ...type.title,
    fontSize: 23,
    color: COLORS.deepBrown,
    marginTop: 3
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputGroup: {
    marginBottom: spacing.md
  },
  label: {
    color: COLORS.deepBrown,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: spacing.sm - 1
  },
  inputContainer: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: hairline,
    backgroundColor: COLORS.cream,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md - 1
  },
  input: {
    flex: 1,
    marginLeft: spacing.sm + 2,
    color: COLORS.deepBrown,
    fontSize: 15
  },
  saveButton: {
    marginTop: spacing.sm,
    backgroundColor: COLORS.richBrown,
    borderRadius: 16,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm
  },
  saveText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600"
  },
  disabled: {
    opacity: 0.65
  }
});
