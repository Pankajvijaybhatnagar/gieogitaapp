import { FontAwesome } from '@expo/vector-icons';
import {
  GoogleSignin,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { Logos } from '@/assets/images';
import AppAlertContext from '@/context/AppAlertContext';
import AuthServices from '@/lib/api/AuthServices';
import { conf } from '@/lib/conf';

const BORDER_COLOR = '#E6E6E6';

/*
|--------------------------------------------------------------------------
| GOOGLE CONFIGURATION
|--------------------------------------------------------------------------
|
| Use the OAuth client whose type is "Web application".
| Do not use the Android client ID here.
|
*/
GoogleSignin.configure({
  webClientId: conf.googleClientId,
  offlineAccess: false,
});

export default function SocialLogin({ disabled = false, onGoogleLogin }) {
  const router = useRouter();

  const [loadingProvider, setLoadingProvider] = useState(null);
  const { alert } = React.useContext(AppAlertContext);

  const isGoogleLoading = loadingProvider === 'google';
  const isAppleLoading = loadingProvider === 'apple';
  const isLoading = disabled || loadingProvider !== null;

  /*
  |--------------------------------------------------------------------------
  | GOOGLE LOGIN
  |--------------------------------------------------------------------------
  */

  const handleGoogleLogin = async () => {
    if (isLoading) {
      return;
    }

    try {
      setLoadingProvider('google');

      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
      }

      const response = await GoogleSignin.signIn();
      console.log('Google sign-in response:', response);

      if (!isSuccessResponse(response)) {
        return;
      }

      const idToken = response.data?.idToken;

      if (!idToken) {
        throw new Error('Google did not return an ID token.');
      }

      const result = await onGoogleLogin(idToken);

      if (!result.status) {
        throw new Error(result.error || 'Google login failed.');
      }

      router.back();
    } catch (error) {
      if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
        return;
      }

      if (error?.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Please wait', 'Google sign-in is already in progress.');
        return;
      }

      if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert(
          'Google Play Services',
          'Google Play Services is unavailable or needs to be updated.',
        );
        return;
      }

      console.error('Google login error:', error);

      alert(
        'Google login failed',
        error?.message || 'Unable to continue with Google.',
      );
    } finally {
      setLoadingProvider(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | APPLE LOGIN
  |--------------------------------------------------------------------------
  */

  const handleAppleLogin = async () => {
    if (isLoading) {
      return;
    }

    try {
      setLoadingProvider('apple');

      const isAvailable = await AppleAuthentication.isAvailableAsync();

      if (!isAvailable) {
        Alert.alert(
          'Apple login unavailable',
          'Sign in with Apple is not available on this device.',
        );
        return;
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const idToken = credential.identityToken;

      if (!idToken) {
        throw new Error('Apple did not return an identity token.');
      }

      /*
       * Apple normally provides the name only during the user's
       * first authorization. Your backend should preserve it.
       */
      const appleName = credential.fullName
        ? {
            firstName: credential.fullName.givenName || '',
            middleName: credential.fullName.middleName || '',
            lastName: credential.fullName.familyName || '',
          }
        : null;

      const result = await AuthServices.loginWithApple(idToken, appleName);

      if (!result.success) {
        throw new Error(result.error || 'Apple login failed.');
      }

      router.back();
    } catch (error) {
      if (error?.code === 'ERR_REQUEST_CANCELED') {
        return;
      }

      console.error('Apple login error:', error);

      Alert.alert(
        'Apple login failed',
        error?.message || 'Unable to continue with Apple.',
      );
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' && (
        <TouchableOpacity
          style={[styles.socialButton, isLoading && styles.disabledButton]}
          onPress={handleAppleLogin}
          disabled={isLoading}
          activeOpacity={0.8}>
          {isAppleLoading ? (
            <ActivityIndicator size="small" color="#000000" />
          ) : (
            <FontAwesome name="apple" size={21} color="#000000" />
          )}
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.socialButton, isLoading && styles.disabledButton]}
        onPress={handleGoogleLogin}
        disabled={isLoading}
        activeOpacity={0.8}>
        {isGoogleLoading ? (
          <ActivityIndicator size="small" color="#6E3F1F" />
        ) : (
          <Image
            source={Logos.google}
            style={styles.googleLogo}
            contentFit="contain"
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
    marginTop: 11,
  },

  socialButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 7,
    elevation: 2,
  },

  disabledButton: {
    opacity: 0.6,
  },

  googleLogo: {
    width: 22,
    height: 22,
  },
});
