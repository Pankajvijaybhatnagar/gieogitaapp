import { useRef, useState } from 'react';

import { Alert, Linking, Platform, StyleSheet, View } from 'react-native';

import { WebView } from 'react-native-webview';

import PaymentHeader from './PaymentHeader';
import PaymentLoading from './PaymentLoading';

const CALLBACK_DOMAINS = ['gieogita.org', 'www.gieogita.org'];

export default function PaymentWebView({
  paymentUrl,
  merchantTxnNo,
  onGatewayReturn,
  onClose,
}) {
  const webViewRef = useRef(null);
  const returnedRef = useRef(false);
  const externalUrlOpeningRef = useRef(false);

  const [loading, setLoading] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | CHECK WEBSITE CALLBACK
  |--------------------------------------------------------------------------
  */

  const isReturnUrl = url => {
    if (!url) return false;

    try {
      const parsedUrl = new URL(url);

      const host = parsedUrl.hostname.toLowerCase();

      return CALLBACK_DOMAINS.some(
        domain => host === domain || host.endsWith(`.${domain}`),
      );
    } catch {
      return false;
    }
  };

  /*
  |--------------------------------------------------------------------------
  | CHECK EXTERNAL APP URL
  |--------------------------------------------------------------------------
  |
  | Examples:
  |
  | upi://pay
  | phonepe://
  | gpay://
  | paytmmp://
  | intent://
  |
  */

  const isExternalAppUrl = url => {
    if (!url) return false;

    const lowerUrl = url.toLowerCase();

    /*
     * Normal WebView URLs
     */
    if (
      lowerUrl.startsWith('http://') ||
      lowerUrl.startsWith('https://') ||
      lowerUrl.startsWith('about:')
    ) {
      return false;
    }

    /*
     * Everything else is an external scheme.
     */
    return true;
  };

  /*
  |--------------------------------------------------------------------------
  | OPEN UPI / EXTERNAL APP
  |--------------------------------------------------------------------------
  */

  const openExternalApp = async url => {
    if (externalUrlOpeningRef.current) {
      return;
    }

    try {
      externalUrlOpeningRef.current = true;

      console.log('[Payment WebView] Opening external app:', url);

      await Linking.openURL(url);
    } catch (error) {
      console.log('[Payment WebView] Unable to open external URL:', error);

      Alert.alert(
        'UPI App Not Available',
        'Unable to open a UPI payment app. Please make sure Google Pay, PhonePe, Paytm or another UPI app is installed.',
      );
    } finally {
      /*
       * Small delay prevents gateway duplicate
       * redirects from opening multiple times.
       */
      setTimeout(() => {
        externalUrlOpeningRef.current = false;
      }, 1200);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PROCESS EVERY URL
  |--------------------------------------------------------------------------
  */

  const processUrl = url => {
    if (!url) {
      return true;
    }

    console.log('[Payment WebView] URL:', url);

    /*
     * STEP 1
     * ICICI returned to our website.
     */
    if (isReturnUrl(url)) {
      if (!returnedRef.current) {
        returnedRef.current = true;

        console.log('[Payment WebView] Callback detected:', url);

        onGatewayReturn(url);
      }

      /*
       * Don't show callback website.
       */
      return false;
    }

    /*
     * STEP 2
     * UPI / external application link.
     */
    if (isExternalAppUrl(url)) {
      console.log('[Payment WebView] External scheme detected:', url);

      openExternalApp(url);

      /*
       * CRITICAL:
       *
       * Prevent WebView from loading upi://
       *
       * Otherwise:
       *
       * ERR_UNKNOWN_URL_SCHEME
       */
      return false;
    }

    /*
     * Normal HTTP/HTTPS navigation
     */
    return true;
  };

  /*
  |--------------------------------------------------------------------------
  | CLOSE PAYMENT
  |--------------------------------------------------------------------------
  */

  const handleClose = () => {
    Alert.alert(
      'Leave Payment?',
      'Your payment may still be in progress. Are you sure you want to leave?',
      [
        {
          text: 'Continue Payment',
          style: 'cancel',
        },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: onClose,
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <PaymentHeader onClose={handleClose} />

      <View style={styles.webViewContainer}>
        <WebView
          ref={webViewRef}

          source={{
            uri: paymentUrl,
          }}

          style={styles.webView}

          javaScriptEnabled
          domStorageEnabled

          sharedCookiesEnabled
          thirdPartyCookiesEnabled

          setSupportMultipleWindows={false}

          /*
          |--------------------------------------------------------------------------
          | IMPORTANT
          |--------------------------------------------------------------------------
          |
          | This runs BEFORE WebView navigates.
          |
          | So upi:// gets intercepted before
          | Android WebView throws:
          |
          | ERR_UNKNOWN_URL_SCHEME
          |
          */

          onShouldStartLoadWithRequest={request => {
            return processUrl(request.url);
          }}

          /*
           * Keep this as secondary URL monitoring.
           */
          onNavigationStateChange={navState => {
            const url = navState?.url;

            console.log('[Payment WebView] Navigation:', url);

            /*
             * Don't call processUrl for external
             * URL here because it was already
             * intercepted above.
             *
             * Only watch for callback as backup.
             */
            if (url && isReturnUrl(url) && !returnedRef.current) {
              returnedRef.current = true;

              onGatewayReturn(url);
            }
          }}

          onLoadStart={() => {
            setLoading(true);
          }}

          onLoadEnd={() => {
            setLoading(false);
          }}

          onError={event => {
            const error = event.nativeEvent;

            console.log('[Payment WebView] Error:', error);

            /*
             * Ignore unknown scheme errors
             * because external schemes are handled
             * by Linking.
             */
            if (error?.description?.includes('ERR_UNKNOWN_URL_SCHEME')) {
              return;
            }
          }}

          onHttpError={event => {
            console.log('[Payment WebView] HTTP Error:', event.nativeEvent);
          }}

          keyboardDisplayRequiresUserAction={false}

          allowsBackForwardNavigationGestures={Platform.OS === 'ios'}

          originWhitelist={['*']}
        />

        {loading && <PaymentLoading />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  webViewContainer: {
    flex: 1,
  },

  webView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
