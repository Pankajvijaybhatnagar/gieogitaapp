import DonationForm from '@/components/donations/new/DonationForm';
import { useAuth } from '@/context/AuthContext';
import donationServices from '@/lib/services/donationServices';
import userServices from '@/lib/services/userServices';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { useAppAlert } from '@/context/AppAlertContext';
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
  const { alert, success, warning, loading, hide, confirm } = useAppAlert();

  // =========================================================
  // URL PARAMS
  // /home/donations/new?sevaType=anna%20seva&amount=500
  // =========================================================

  const params = useLocalSearchParams();

  const sevaTypeParam = Array.isArray(params.sevaType)
    ? params.sevaType[0]
    : params.sevaType;

  const amountParam = Array.isArray(params.amount)
    ? params.amount[0]
    : params.amount;

  // Keep undefined when params are not supplied.
  // This means normal donation flow remains unchanged.
  const initialSevaType =
    typeof sevaTypeParam === 'string' && sevaTypeParam.trim()
      ? sevaTypeParam.trim()
      : undefined;

  const initialAmount =
    typeof amountParam === 'string' && amountParam.trim()
      ? amountParam.trim()
      : undefined;

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

  // =========================================================
  // NORMALIZE PROFILE RESPONSE
  // =========================================================

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

  // =========================================================
  // NORMALIZE DONATION RESPONSE
  // =========================================================

  const normalizeDonationResponse = result => {
    if (result?.data && typeof result.data === 'object') {
      return result.data;
    }

    return result;
  };

  // =========================================================
  // FETCH PROFILE
  // =========================================================

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

  // =========================================================
  // LOAD PROFILE AFTER AUTH
  // =========================================================

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

  // =========================================================
  // UPDATE MISSING PROFILE FIELDS
  // =========================================================

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

  // =========================================================
  // CREATE DONATION
  // =========================================================

  const handleCreateDonation = async form => {
    if (!access_token) {
      router.push('/login2');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      // =====================================================
      // 1. UPDATE MISSING PROFILE FIELDS
      // =====================================================

      await updateProfileIfRequired(form);

      // =====================================================
      // 2. BUILD DONATION PAYLOAD
      // =====================================================

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

        whatsapp_opt_in: Boolean(form.whatsappOptIn),

        pan_number:
          form.identityType === 'pan'
            ? form.identityNumber.trim().toUpperCase()
            : '',

        aadhaar_number:
          form.identityType === 'aadhaar'
            ? form.identityNumber.replace(/\D/g, '')
            : '',
      };

      console.log('[Donation] Creating donation:', payload);

      // =====================================================
      // 3. CREATE DONATION
      // =====================================================

      const response = await donationServices.createDonation(
        payload,
        access_token,
      );

      console.log('[Donation] Create response:', response);

      if (response?.success === false) {
        throw new Error(
          response?.error ||
            response?.message ||
            response?.data?.message ||
            'Unable to create donation.',
        );
      }

      // =====================================================
      // 4. NORMALIZE RESPONSE
      // =====================================================

      const result = normalizeDonationResponse(response);

      if (!result) {
        throw new Error('Invalid donation response received.');
      }

      if (result?.status === false) {
        throw new Error(result?.message || 'Unable to create donation.');
      }

      // =====================================================
      // 5. EXTRACT PAYMENT DATA
      // =====================================================

      const tranCtx =
        result?.tranCtx || result?.data?.tranCtx || response?.data?.tranCtx;

      const merchantTxnNo =
        result?.merchantTxnNo ||
        result?.merchant_txn_no ||
        result?.transaction_id ||
        result?.data?.merchantTxnNo ||
        response?.data?.merchantTxnNo;

      const redirectURI =
        result?.redirectURI ||
        result?.redirect_url ||
        result?.payment_url ||
        result?.url ||
        result?.data?.redirectURI;

      console.log('[Donation] Payment information:', {
        tranCtx,
        merchantTxnNo,
        redirectURI,
      });

      // =====================================================
      // 6. VALIDATE PAYMENT SESSION
      // =====================================================

      if (!tranCtx) {
        throw new Error(
          'Payment gateway transaction context was not returned.',
        );
      }

      if (!merchantTxnNo) {
        throw new Error('Merchant transaction number was not returned.');
      }

      // =====================================================
      // 7. OPEN PAYMENT WEBVIEW
      // =====================================================

      router.push({
        pathname: '/home/(tabs)/donations/payment/[tranCtx]',
        params: {
          tranCtx,
          merchantTxnNo,
        },
      });
    } catch (err) {
      console.log('[Donation] Submit error:', err);

      const message =
        err?.message || 'Unable to create donation. Please try again.';

      setError(message);

      alert('Donation Failed', message);
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // AUTH LOADING
  // =========================================================

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

  // =========================================================
  // NOT LOGGED IN
  // =========================================================

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

  // =========================================================
  // PROFILE LOADING
  // =========================================================

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

  // =========================================================
  // DONATION FORM
  // =========================================================

  return (
    <SafeAreaView style={styles.screen}>
      <DonationForm
        profile={profile || user}
        submitting={submitting}
        serverError={error}
        onSubmit={handleCreateDonation}

        // ===================================================
        // OPTIONAL URL VALUES
        //
        // If URL contains:
        //
        // ?sevaType=Anna%20Seva&amount=500
        //
        // these will be available inside DonationForm.
        //
        // If URL does NOT contain them, they are undefined
        // and the normal donation form flow remains unchanged.
        // ===================================================

        initialSevaType={initialSevaType}
        initialAmount={initialAmount}
      />
    </SafeAreaView>
  );
}

// ===========================================================
// STYLES
// ===========================================================

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
