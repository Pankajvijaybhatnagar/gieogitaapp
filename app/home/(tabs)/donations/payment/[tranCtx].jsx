import PaymentResult from '@/components/donations/payment/PaymentResult';
import PaymentWebView from '@/components/donations/payment/PaymentWebView';
import { useAuth } from '@/context/AuthContext';
import donationServices from '@/lib/services/donationServices';

import { useLocalSearchParams, useRouter } from 'expo-router';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const PAYMENT_BASE_URL =
  'https://pgpay.icici.bank.in/pg/api/v2/authRedirect';

export default function DonationPaymentScreen() {
  const router = useRouter();

  /*
  |--------------------------------------------------------------------------
  | ROUTE PARAMS
  |--------------------------------------------------------------------------
  */

  const { tranCtx, merchantTxnNo } = useLocalSearchParams();

  /*
  |--------------------------------------------------------------------------
  | AUTH
  |--------------------------------------------------------------------------
  */

  const {
    access_token,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  /*
  |--------------------------------------------------------------------------
  | PAYMENT STATE
  |--------------------------------------------------------------------------
  */

  const [verifying, setVerifying] = useState(false);

  const [paymentFinished, setPaymentFinished] = useState(false);

  const [paymentResult, setPaymentResult] = useState(null);

  const [verificationError, setVerificationError] = useState('');

  /*
  |--------------------------------------------------------------------------
  | REFS
  |--------------------------------------------------------------------------
  */

  const verificationStartedRef = useRef(false);

  /*
  |--------------------------------------------------------------------------
  | NORMALIZE ROUTE PARAMS
  |--------------------------------------------------------------------------
  */

  const transactionContext = Array.isArray(tranCtx)
    ? tranCtx[0]
    : tranCtx;

  const merchantTransaction = Array.isArray(merchantTxnNo)
    ? merchantTxnNo[0]
    : merchantTxnNo;

  /*
  |--------------------------------------------------------------------------
  | PAYMENT URL
  |--------------------------------------------------------------------------
  */

  const paymentUrl = transactionContext
    ? `${PAYMENT_BASE_URL}?tranCtx=${encodeURIComponent(
        transactionContext,
      )}`
    : null;

  /*
  |--------------------------------------------------------------------------
  | RESET PAYMENT WHEN NEW TRANSACTION ARRIVES
  |--------------------------------------------------------------------------
  |
  | Very important:
  |
  | Expo Router may keep this screen mounted.
  |
  | Previous transaction could have:
  |
  | paymentFinished = true
  | paymentResult = old donation
  | verificationStartedRef = true
  |
  | So when a NEW transaction arrives we must completely reset
  | the screen before showing the new payment gateway.
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    console.log('[Payment] Transaction changed:', {
      transactionContext,
      merchantTransaction,
    });

    setVerifying(false);

    setPaymentFinished(false);

    setPaymentResult(null);

    setVerificationError('');

    verificationStartedRef.current = false;
  }, [transactionContext, merchantTransaction]);

  /*
  |--------------------------------------------------------------------------
  | OPEN LOGIN MODAL
  |--------------------------------------------------------------------------
  |
  | Login2 is a modal route.
  |
  | IMPORTANT:
  | We use router.push(), NOT router.replace().
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated || !access_token) {
      router.push('/login2');
    }
  }, [
    authLoading,
    isAuthenticated,
    access_token,
    router,
  ]);

  /*
  |--------------------------------------------------------------------------
  | VERIFY PAYMENT
  |--------------------------------------------------------------------------
  */

  const verifyPayment = useCallback(async () => {
    /*
    |--------------------------------------------------------------------------
    | VALIDATE REQUIRED DATA
    |--------------------------------------------------------------------------
    */

    if (!access_token || !merchantTransaction) {
      console.log(
        '[Payment] Cannot verify because transaction information is missing.',
      );

      setVerificationError(
        'Transaction information is missing.',
      );

      setPaymentFinished(true);

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | PREVENT DUPLICATE VERIFICATION
    |--------------------------------------------------------------------------
    |
    | WebView can trigger navigation events multiple times.
    |
    | Without this check the API could be called multiple times.
    |--------------------------------------------------------------------------
    */

    if (verificationStartedRef.current) {
      console.log(
        '[Payment] Verification already started. Ignoring duplicate request.',
      );

      return;
    }

    verificationStartedRef.current = true;

    try {
      setVerifying(true);

      setVerificationError('');

      console.log('[Payment] Starting verification:', {
        merchantTransaction,
      });

      /*
      |--------------------------------------------------------------------------
      | STEP 1
      |--------------------------------------------------------------------------
      |
      | Ask backend to update payment statuses from ICICI.
      |--------------------------------------------------------------------------
      */

      await donationServices.updateMyDonationStaus(
        access_token,
      );

      console.log(
        '[Payment] Donation statuses updated from gateway.',
      );

      /*
      |--------------------------------------------------------------------------
      | STEP 2
      |--------------------------------------------------------------------------
      |
      | Fetch this specific donation from backend.
      |--------------------------------------------------------------------------
      */

      const response =
        await donationServices.getDonationByMerchantTxn(
          merchantTransaction,
          access_token,
        );

      console.log(
        '[Payment] Verified donation response:',
        response,
      );

      /*
      |--------------------------------------------------------------------------
      | NORMALIZE RESPONSE
      |--------------------------------------------------------------------------
      */

      let result = response;

      if (
        response?.data &&
        typeof response.data === 'object'
      ) {
        result = response.data;
      }

      /*
      |--------------------------------------------------------------------------
      | FIND DONATION OBJECT
      |--------------------------------------------------------------------------
      |
      | Supported structures:
      |
      | response.data.data[0]
      |
      | response.data.data
      |
      | response.data
      |--------------------------------------------------------------------------
      */

      let donation = null;

      if (Array.isArray(result?.data)) {
        donation = result.data[0] || null;
      } else if (
        result?.data &&
        typeof result.data === 'object'
      ) {
        donation = result.data;
      } else if (
        result?.merchantTxnNo ||
        result?.merchant_txn_no
      ) {
        donation = result;
      }

      console.log(
        '[Payment] Final normalized donation:',
        donation,
      );

      /*
      |--------------------------------------------------------------------------
      | SAVE RESULT
      |--------------------------------------------------------------------------
      */

      setPaymentResult(donation);

      setPaymentFinished(true);
    } catch (error) {
      console.log(
        '[Payment] Verification error:',
        error,
      );

      setVerificationError(
        error?.message ||
          'Unable to verify payment status.',
      );

      setPaymentFinished(true);
    } finally {
      setVerifying(false);
    }
  }, [
    access_token,
    merchantTransaction,
  ]);

  /*
  |--------------------------------------------------------------------------
  | GATEWAY RETURN DETECTED
  |--------------------------------------------------------------------------
  */

  const handleGatewayReturn = useCallback(
    url => {
      console.log(
        '[Payment] Gateway returned:',
        url,
      );

      verifyPayment();
    },
    [verifyPayment],
  );

  /*
  |--------------------------------------------------------------------------
  | CLOSE PAYMENT
  |--------------------------------------------------------------------------
  */

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  /*
  |--------------------------------------------------------------------------
  | PAYMENT RESULT DONE
  |--------------------------------------------------------------------------
  */

  const handleResultDone = useCallback(() => {
    router.replace('/home/(tabs)/donations');
  }, [router]);

  /*
  |--------------------------------------------------------------------------
  | AUTH LOADING
  |--------------------------------------------------------------------------
  */

  if (authLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.center}>
          <ActivityIndicator
            size="small"
            color="#704025"
          />

          <Text style={styles.loadingText}>
            Preparing payment...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | NOT AUTHENTICATED
  |--------------------------------------------------------------------------
  |
  | Login modal is opened from useEffect above.
  |--------------------------------------------------------------------------
  */

  if (!isAuthenticated || !access_token) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.center}>
          <ActivityIndicator
            size="small"
            color="#704025"
          />

          <Text style={styles.loadingText}>
            Opening login...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | INVALID PAYMENT
  |--------------------------------------------------------------------------
  */

  if (!transactionContext) {
    return (
      <SafeAreaView style={styles.screen}>
        <PaymentResult
          status="failed"
          title="Invalid Payment"
          message="Payment transaction information is missing."
          onDone={handleResultDone}
        />
      </SafeAreaView>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | VERIFYING PAYMENT
  |--------------------------------------------------------------------------
  */

  if (verifying) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.center}>
          <View style={styles.verifyIcon}>
            <ActivityIndicator
              size="small"
              color="#704025"
            />
          </View>

          <Text style={styles.verifyTitle}>
            Verifying Payment
          </Text>

          <Text style={styles.verifyDescription}>
            Please do not close the app while we
            confirm your payment.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | PAYMENT RESULT
  |--------------------------------------------------------------------------
  */

  if (paymentFinished) {
    const status =
      paymentResult?.status?.toLowerCase() ||
      'pending';

    return (
      <SafeAreaView style={styles.screen}>
        <PaymentResult
          status={
            verificationError
              ? 'pending'
              : status
          }
          donation={paymentResult}
          title={
            verificationError
              ? 'Payment Verification Pending'
              : undefined
          }
          message={
            verificationError || undefined
          }
          onDone={handleResultDone}
        />
      </SafeAreaView>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | PAYMENT WEBVIEW
  |--------------------------------------------------------------------------
  */

  return (
    <SafeAreaView style={styles.screen}>
      <PaymentWebView
        paymentUrl={paymentUrl}
        merchantTxnNo={merchantTransaction}
        onGatewayReturn={
          handleGatewayReturn
        }
        onClose={handleClose}
      />
    </SafeAreaView>
  );
}

/*
|--------------------------------------------------------------------------
| STYLES
|--------------------------------------------------------------------------
*/

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