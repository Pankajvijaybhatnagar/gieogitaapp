import JoinGitaProfile from '@/components/join/JoinGitaProfile';
import joinGieoGitaServices from '@/lib/services/joinGieoGitaServices';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const COLORS = {
  background: '#F7EFE5',
  primary: '#6E3F1F',
  secondary: '#A8692D',
  cream: '#FFF9F2',
  text: '#382418',
  muted: '#8B7465',
};

export default function JoinGieoGitaProfilePage() {
  const { hashid } = useLocalSearchParams();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProfile = useCallback(async () => {
    if (!hashid) return;

    try {
      setLoading(true);
      setError('');

      const response = await joinGieoGitaServices.getProfileByHashId(hashid);

      const profileData = response?.data?.data ?? response?.data ?? null;

      if (!response?.status || !profileData) {
        setError('Profile not found.');
        return;
      }

      setProfile(profileData);
    } catch (err) {
      console.log('Profile error:', err);

      setError(err?.message || 'Unable to load member profile.');
    } finally {
      setLoading(false);
    }
  }, [hashid]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />

        <SafeAreaView style={styles.screen}>
          <View style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.primary} />

            <Text style={styles.loadingText}>Loading member profile...</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  if (error || !profile) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />

        <SafeAreaView style={styles.screen}>
          <View style={styles.center}>
            <View style={styles.errorIcon}>
              <Ionicons
                name="person-outline"
                size={34}
                color={COLORS.primary}
              />
            </View>

            <Text style={styles.errorTitle}>Profile unavailable</Text>

            <Text style={styles.errorText}>
              {error || 'This member profile could not be found.'}
            </Text>

            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={18} color="#fff" />

              <Text style={styles.backButtonText}>Go Back</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <JoinGitaProfile profile={profile} onRefresh={loadProfile} />
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  center: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 14,
    color: COLORS.muted,
    fontSize: 15,
  },

  errorIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EEDCCB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  errorTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '800',
  },

  errorText: {
    color: COLORS.muted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 21,
  },

  backButton: {
    marginTop: 24,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  backButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
