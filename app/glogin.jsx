import { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '824552052631-ri9pgjodl6c3jmq8tikr77obk10keeg5.apps.googleusercontent.com',
});

export default function GoogleSignInScreen2() {
  const [userInfo, setUserInfo] = useState(null);

  const handleGoogleSignIn = async () => {
    console.log('====================================');
    console.log('[GoogleSignIn] Sign in started');
    console.log('====================================');

    try {
      console.log('[GoogleSignIn] Checking Google Play Services...');

      const playServices = await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      console.log('[GoogleSignIn] Play Services result:', playServices);

      console.log('[GoogleSignIn] Opening Google Sign-In...');

      const response = await GoogleSignin.signIn();

      console.log('====================================');
      console.log('[GoogleSignIn] RAW RESPONSE');
      console.log(response);
      console.log('====================================');

      console.log(
        '[GoogleSignIn] JSON RESPONSE:',
        JSON.stringify(response, null, 2),
      );

      if (response) {
        console.log('[GoogleSignIn] Sign in successful');

        if (response?.data) {
          console.log('[GoogleSignIn] Response data:', response.data);

          console.log('[GoogleSignIn] User:', response.data?.user);

          console.log('[GoogleSignIn] ID Token:', response.data?.idToken);

          console.log(
            '[GoogleSignIn] Server Auth Code:',
            response.data?.serverAuthCode,
          );
        }

        setUserInfo(JSON.stringify(response, null, 2));
      } else {
        console.warn('[GoogleSignIn] Sign in returned empty response');

        setUserInfo('Sign in was cancelled by user');
      }
    } catch (error) {
      console.log('====================================');
      console.error('[GoogleSignIn] SIGN IN ERROR');
      console.error(error);
      console.log('====================================');

      console.error('[GoogleSignIn] Error message:', error?.message);

      console.error('[GoogleSignIn] Error code:', error?.code);

      console.error(
        '[GoogleSignIn] Full error JSON:',
        JSON.stringify(error, null, 2),
      );

      if (error?.code) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            console.warn('[GoogleSignIn] Sign in already in progress');

            setUserInfo('Sign in already in progress...');
            break;

          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.warn('[GoogleSignIn] Google Play Services not available');

            setUserInfo('Play services not available or outdated');
            break;

          case statusCodes.SIGN_IN_CANCELLED:
            console.warn('[GoogleSignIn] User cancelled Google Sign-In');

            setUserInfo('Google Sign-In cancelled');
            break;

          default:
            console.error(
              '[GoogleSignIn] Unknown Google error code:',
              error.code,
            );

            setUserInfo(
              `Google Sign-In Error

Code: ${error.code}

Message: ${error?.message || 'Unknown error'}`,
            );
        }
      } else {
        console.error('[GoogleSignIn] Error does not contain error.code');

        setUserInfo(
          `Unknown Error

${error?.message || JSON.stringify(error)}`,
        );
      }
    } finally {
      console.log('[GoogleSignIn] Sign in process finished');
    }
  };

  const handleGoogleLogout = async () => {
    console.log('====================================');
    console.log('[GoogleSignIn] Logout started');
    console.log('====================================');

    try {
      const currentUser = GoogleSignin.getCurrentUser();

      console.log('[GoogleSignIn] Current user before logout:', currentUser);

      await GoogleSignin.signOut();

      console.log('[GoogleSignIn] Logout successful');

      setUserInfo(null);
    } catch (error) {
      console.log('====================================');
      console.error('[GoogleSignIn] LOGOUT ERROR');
      console.error(error);
      console.log('====================================');

      console.error('[GoogleSignIn] Logout error message:', error?.message);

      console.error('[GoogleSignIn] Logout error code:', error?.code);

      setUserInfo(
        `Error during logout

${error?.message || 'Unknown error'}`,
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Google Sign In</Text>

      {!userInfo ? (
        <View style={styles.buttonWrapper}>
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={handleGoogleSignIn}
          />
        </View>
      ) : (
        <View style={styles.buttonWrapper}>
          <Button title="Logout" color="red" onPress={handleGoogleLogout} />
        </View>
      )}

      <ScrollView style={styles.responseBox}>
        <Text style={styles.responseText}>
          {userInfo ? userInfo : 'No user info yet...'}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },

  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },

  buttonWrapper: {
    marginTop: 10,
    marginBottom: 20,
  },

  responseBox: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
  },

  responseText: {
    fontSize: 14,
    color: '#333',
  },
});
