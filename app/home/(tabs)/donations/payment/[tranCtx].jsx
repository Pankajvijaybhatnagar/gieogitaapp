import PaymentResult from '@/components/donations/payment/PaymentResult';
import PaymentWebView from '@/components/donations/payment/PaymentWebView';
import { useAuth } from '@/context/AuthContext';
import donationServices from '@/lib/services/donationServices';

import { useLocalSearchParams, useRouter } from 'expo-router';

import { useCallback, useRef, useState } from 'react';

import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const PAYMENT_BASE_URL = 'https://pgpay.icici.bank.in/pg/api/v2/authRedirect';

export default function DonationPaymentScreen() {
  const router = useRouter();

  const { tranCtx, merchantTxnNo } = useLocalSearchParams();

  const { access_token, isAuthenticated, loading: authLoading } = useAuth();

  const [verifying, setVerifying] = useState(false);

  const [paymentFinished, setPaymentFinished] = useState(false);

  const [paymentResult, setPaymentResult] = useState(null);

  const [verificationError, setVerificationError] = useState('');

  const verificationStartedRef = useRef(false);

  const transactionContext = Array.isArray(tranCtx) ? tranCtx[0] : tranCtx;

  const merchantTransaction = Array.isArray(merchantTxnNo)
    ? merchantTxnNo[0]
    : merchantTxnNo;

  const paymentUrl = transactionContext
    ? `${PAYMENT_BASE_URL}?tranCtx=${encodeURIComponent(transactionContext)}`
    : null;

  /*
  |--------------------------------------------------------------------------
  | VERIFY PAYMENT
  |--------------------------------------------------------------------------
  */

  const verifyPayment = useCallback(async () => {
    if (!access_token || !merchantTransaction) {
      setVerificationError('Transaction information is missing.');

      setPaymentFinished(true);

      return;
    }

    if (verificationStartedRef.current) {
      return;
    }

    verificationStartedRef.current = true;

    try {
      setVerifying(true);
      setVerificationError('');

      /*
       * STEP 1
       *
       * Ask backend to update payment status
       * from ICICI.
       */
      await donationServices.updateMyDonationStaus(access_token);

      /*
       * STEP 2
       *
       * Fetch verified donation status
       * from your backend.
       */
      const response = await donationServices.getDonationByMerchantTxn(
        merchantTransaction,
        access_token,
      );

      console.log('[Payment] Verified donation:', response);

      let result = response;

      if (response?.data && typeof response.data === 'object') {
        result = response.data;
      }

      /*
       * Depending upon API structure:
       *
       * data could be donation itself
       * or data[0]
       */
      let donation = null;

      if (Array.isArray(result?.data)) {
        donation = result.data[0] || null;
      } else if (result?.data && typeof result.data === 'object') {
        donation = result.data;
      } else if (result?.merchantTxnNo) {
        donation = result;
      }

      setPaymentResult(donation);

      setPaymentFinished(true);
    } catch (error) {
      console.log('[Payment] Verification error:', error);

      setVerificationError(
        error?.message || 'Unable to verify payment status.',
      );

      setPaymentFinished(true);
    } finally {
      setVerifying(false);
    }
  }, [access_token, merchantTransaction]);

  /*
  |--------------------------------------------------------------------------
  | RETURN URL DETECTED
  |--------------------------------------------------------------------------
  */

  const handleGatewayReturn = useCallback(
    url => {
      console.log('[Payment] Gateway returned:', url);

      verifyPayment();
    },
    [verifyPayment],
  );

  /*
  |--------------------------------------------------------------------------
  | INVALID SESSION
  |--------------------------------------------------------------------------
  */

  if (authLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.center}>
          <ActivityIndicator size="small" color="#704025" />

          <Text style={styles.loadingText}>Preparing payment...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated || !access_token) {
    router.replace('/login2');

    return null;
  }

  if (!transactionContext) {
    return (
      <SafeAreaView style={styles.screen}>
        <PaymentResult
          status="failed"
          title="Invalid Payment"
          message="Payment transaction information is missing."
          onDone={() => router.replace('/home/(tabs)/donations')}
        />
      </SafeAreaView>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | VERIFYING
  |--------------------------------------------------------------------------
  */

  if (verifying) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.center}>
          <View style={styles.verifyIcon}>
            <ActivityIndicator size="small" color="#704025" />
          </View>

          <Text style={styles.verifyTitle}>Verifying Payment</Text>

          <Text style={styles.verifyDescription}>
            Please do not close the app while we confirm your payment.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | RESULT
  |--------------------------------------------------------------------------
  */

  if (paymentFinished) {
    const status = paymentResult?.status?.toLowerCase() || 'pending';

    return (
      <SafeAreaView style={styles.screen}>
        <PaymentResult
          status={verificationError ? 'pending' : status}
          donation={paymentResult}
          title={verificationError ? 'Payment Verification Pending' : undefined}
          message={verificationError || undefined}
          onDone={() => router.replace('/home/(tabs)/donations')}
        />
      </SafeAreaView>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | WEBVIEW
  |--------------------------------------------------------------------------
  */

  return (
    <SafeAreaView style={styles.screen}>
      <PaymentWebView
        paymentUrl={paymentUrl}
        merchantTxnNo={merchantTransaction}
        onGatewayReturn={handleGatewayReturn}
        onClose={() => router.back()}
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
    paddingHorizontal: 30,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 12,
    color: '#846B58',
  },

  verifyIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#F3E5D8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  verifyTitle: {
    marginTop: 17,
    fontSize: 19,
    fontWeight: '700',
    color: '#4E3020',
  },

  verifyDescription: {
    marginTop: 7,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 17,
    color: '#89715F',
  },
});
