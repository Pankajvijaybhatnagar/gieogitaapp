import DonationForm from '@/components/donations/new/DonationForm';
import { useAuth } from '@/context/AuthContext';
import donationServices from '@/lib/services/donationServices';
import userServices from '@/lib/services/userServices';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function NewDonationScreen() {
  const router = useRouter();

  const {
    user,
    access_token,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const normalizeProfileResponse = result => {
    if (result?.data?.data && typeof result.data.data === 'object') {
      return result.data.data;
    }

    if (
      result?.data &&
      typeof result.data === 'object' &&
      !Array.isArray(result.data)
    ) {
      return result.data;
    }

    return null;
  };

  const normalizeDonationResponse = result => {
    if (result?.data && typeof result.data === 'object') {
      return result.data;
    }

    return result;
  };

  const fetchProfile = useCallback(async () => {
    if (!access_token) {
      setProfileLoading(false);
      return;
    }

    try {
      setProfileLoading(true);
      setError('');

      const result = await userServices.getCurrentUser(access_token);

      if (result?.success === false) {
        throw new Error(result?.error || 'Unable to load profile.');
      }

      if (result?.data?.status === false) {
        throw new Error(result?.data?.message || 'Unable to load profile.');
      }

      const currentProfile = normalizeProfileResponse(result);

      if (currentProfile) {
        setProfile(currentProfile);
      } else {
        setProfile(user || null);
      }
    } catch (err) {
      console.log('[Donation] Profile error:', err);

      setError(err?.message || 'Unable to load your profile.');

      setProfile(user || null);
    } finally {
      setProfileLoading(false);
    }
  }, [access_token, user]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated || !access_token) {
      setProfileLoading(false);
      return;
    }

    fetchProfile();
  }, [authLoading, isAuthenticated, access_token, fetchProfile]);

  const updateProfileIfRequired = async form => {
    const current = profile || {};

    const updatePayload = {};

    if (!current?.name && form.name) {
      updatePayload.name = form.name;
    }

    if (!current?.phone && form.phone) {
      updatePayload.phone = form.phone;
    }

    if (!current?.city && form.city) {
      updatePayload.city = form.city;
    }

    if (!current?.district && form.district) {
      updatePayload.district = form.district;
    }

    if (!current?.state && form.state) {
      updatePayload.state = form.state;
    }

    if (!current?.country && form.country) {
      updatePayload.country = form.country;
    }

    if (Object.keys(updatePayload).length === 0) {
      return true;
    }

    console.log('[Donation] Updating missing profile fields:', updatePayload);

    const result = await userServices.updateCurrentUser(
      updatePayload,
      access_token,
    );

    if (result?.success === false) {
      throw new Error(
        result?.error || result?.message || 'Unable to update your profile.',
      );
    }

    if (result?.data?.status === false) {
      throw new Error(
        result?.data?.message || 'Unable to update your profile.',
      );
    }

    return true;
  };

  const handleCreateDonation = async form => {
    if (!access_token) {
      router.push('/login2');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      /*
       * STEP 1
       * Save missing profile information.
       */
      await updateProfileIfRequired(form);

      /*
       * STEP 2
       * Build donation payload.
       */
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),

        amount: Number(form.amount),

        type: form.sevaType,

        city: form.city.trim(),
        district: form.district.trim(),
        state: form.state.trim(),
        country: form.country.trim(),

        address: form.address.trim(),
        pincode: form.pincode.trim(),

        message: form.message.trim(),

        payment_method: 'other',

        whatsapp_opt_in: form.whatsappOptIn,

        /*
         * Your existing API has pan_number.
         */
        pan_number:
          form.identityType === 'pan'
            ? form.identityNumber.trim().toUpperCase()
            : '',

        /*
         * Keep only if your backend supports it.
         */
        aadhaar_number:
          form.identityType === 'aadhaar'
            ? form.identityNumber.replace(/\s/g, '')
            : '',
      };

      console.log('[Donation] Creating donation:', payload);

      /*
       * STEP 3
       * Create donation.
       */
      const response = await donationServices.createDonation(
        payload,
        access_token,
      );

      console.log('[Donation] Create response:', response);

      if (response?.success === false) {
        throw new Error(
          response?.error || response?.message || 'Unable to create donation.',
        );
      }

      const result = normalizeDonationResponse(response);

      if (result?.status === false) {
        throw new Error(result?.message || 'Unable to create donation.');
      }

      /*
       * ICICI flow hook.
       *
       * Your earlier donation API returns transaction/
       * redirect information.
       *
       * Adapt these property names to your exact response.
       */
      const paymentUrl =
        result?.payment_url ||
        result?.redirect_url ||
        result?.redirectURI ||
        result?.url;

      const merchantTxnNo =
        result?.merchantTxnNo ||
        result?.merchant_txn_no ||
        result?.transaction_id;

      if (paymentUrl) {
        /*
         * You can replace this later with your
         * ICICI WebView/payment route.
         */
        Alert.alert(
          'Donation Created',
          'Your donation request has been created successfully.',
          [
            {
              text: 'Continue',
              onPress: () => {
                router.push({
                  pathname: '/home/donations/payment',
                  params: {
                    url: paymentUrl,
                    merchantTxnNo: merchantTxnNo || '',
                  },
                });
              },
            },
          ],
        );

        return;
      }

      Alert.alert(
        'Donation Created',
        'Your donation has been created successfully.',
        [
          {
            text: 'View Donations',
            onPress: () => router.replace('/home/(tabs)/donations'),
          },
        ],
      );
    } catch (err) {
      console.log('[Donation] Submit error:', err);

      setError(err?.message || 'Unable to create donation.');

      Alert.alert(
        'Donation Failed',
        err?.message || 'Unable to create donation. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | AUTH LOADING
  |--------------------------------------------------------------------------
  */

  if (authLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.center}>
          <ActivityIndicator size="small" color="#704025" />

          <Text style={styles.loadingText}>Checking your account...</Text>
        </View>
      </SafeAreaView>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | NOT LOGGED IN
  |--------------------------------------------------------------------------
  */

  if (!isAuthenticated || !access_token || !user) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loginContainer}>
          <View style={styles.loginIcon}>
            <Ionicons name="heart-outline" size={34} color="#7A4527" />
          </View>

          <Text style={styles.loginEyebrow}>GITA SEVA</Text>

          <Text style={styles.loginTitle}>Login to Donate</Text>

          <Text style={styles.loginDescription}>
            Please login to continue with your donation and securely manage your
            contribution history.
          </Text>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/login2')}
            activeOpacity={0.85}>
            <Ionicons name="log-in-outline" size={18} color="#FFFFFF" />

            <Text style={styles.loginButtonText}>Login to Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | PROFILE LOADING
  |--------------------------------------------------------------------------
  */

  if (profileLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.center}>
          <ActivityIndicator size="small" color="#704025" />

          <Text style={styles.loadingText}>Preparing donation form...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <DonationForm
        profile={profile || user}
        submitting={submitting}
        serverError={error}
        onSubmit={handleCreateDonation}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFF9F3',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 12,
    color: '#846A58',
  },

  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },

  loginIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2E3D5',
    marginBottom: 20,
  },

  loginEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: '#AC7652',
    letterSpacing: 2,
  },

  loginTitle: {
    marginTop: 7,
    fontSize: 25,
    fontWeight: '700',
    color: '#4D2D1A',
  },

  loginDescription: {
    marginTop: 9,
    maxWidth: 320,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 20,
    color: '#826855',
  },

  loginButton: {
    marginTop: 24,
    minWidth: 200,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6A3C25',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
