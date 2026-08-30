// app/login2/index.jsx

import { BlurView } from 'expo-blur';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';

import CreateAccountScreen from '@/components/login2/CreateAccountScreen';
import ForgotPasswordScreen from '@/components/login2/ForgotPasswordScreen';
import LoginScreen from '@/components/login2/LoginScreen';
import VerifyCodeScreen from '@/components/login2/VerifyCodeScreen';

import { useAuth } from '@/context/AuthContext';
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

const Login2 = () => {
  const router = useRouter();

  /*
  |--------------------------------------------------------------------------
  | AUTH CONTEXT
  |--------------------------------------------------------------------------
  */

  const {
    login,
    signup,
    sendOTP,
    verifyOTP,
    forgotPassword,
    updatePassword,
    loginWithGoogle,
    isAuthenticated,
    user,
  } = useAuth();

  /*
  |--------------------------------------------------------------------------
  | SCREEN
  |--------------------------------------------------------------------------
  */

  const [screen, setScreen] = useState('login');

  /*
  |--------------------------------------------------------------------------
  | OTP MODE
  |--------------------------------------------------------------------------
  |
  | login
  | signup
  | forgot
  |
  */

  const [otpMode, setOtpMode] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | AUTH DATA
  |--------------------------------------------------------------------------
  */

  const [verificationEmail, setVerificationEmail] = useState('');

  const [loginPassword, setLoginPassword] = useState('');

  const [resetPassword, setResetPassword] = useState('');

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  const [message, setMessage] = useState('');

  const [messageType, setMessageType] = useState('error');

  const [isSubmitting, setIsSubmitting] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | AUTH DEBUG
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    console.log('LOGIN2 AUTH STATE:', {
      isAuthenticated,
      user,
    });
  }, [isAuthenticated, user]);

  /*
  |--------------------------------------------------------------------------
  | AUTH REDIRECT
  |--------------------------------------------------------------------------
  */

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     console.log('LOGIN2: AUTHENTICATED USER', user);

  //     router.back();
  //   }
  // }, [isAuthenticated, user, router]);

  /*
  |--------------------------------------------------------------------------
  | MESSAGE HELPERS
  |--------------------------------------------------------------------------
  */

  const setSuccess = text => {
    setMessageType('success');

    setMessage(text);

    console.log('LOGIN2 SUCCESS:', text);
  };

  const setError = text => {
    setMessageType('error');

    setMessage(text);

    console.log('LOGIN2 ERROR:', text);
  };

  const clearMessage = () => {
    setMessage('');
  };

  /*
  |--------------------------------------------------------------------------
  | AUTH SUCCESS
  |--------------------------------------------------------------------------
  */

  const handleAuthSuccess = result => {
    console.log('LOGIN2 AUTH SUCCESS:', result);

    router.back();
  };

  /*
  |--------------------------------------------------------------------------
  | RESET
  |--------------------------------------------------------------------------
  */

  const resetFlow = () => {
    setScreen('login');

    setOtpMode(null);

    setVerificationEmail('');

    setLoginPassword('');

    setResetPassword('');

    clearMessage();
  };

  /*
  |--------------------------------------------------------------------------
  | LOGIN
  |--------------------------------------------------------------------------
  */

  const handleSignIn = async ({ email, password }) => {
    console.log('LOGIN2: SIGN IN', {
      email,
    });

    if (!email || !password) {
      setError('Please enter email and password.');

      return;
    }

    try {
      setIsSubmitting(true);

      clearMessage();

      const result = await login(email, password);

      console.log('LOGIN2 LOGIN RESULT:', result);

      /*
       * NORMAL LOGIN
       */

      if (result?.success) {
        setSuccess('Logged in successfully!');

        handleAuthSuccess(result);

        return;
      }

      /*
       * NOT VERIFIED
       */

      if (result?.code === 403) {
        console.log('LOGIN2: EMAIL NOT VERIFIED');

        const otpResult = await sendOTP(email);

        console.log('LOGIN2 SEND OTP RESULT:', otpResult);

        if (otpResult?.success) {
          setVerificationEmail(email);

          setLoginPassword(password);

          setOtpMode('login');

          setScreen('verify');

          setSuccess('Email not verified. OTP sent.');
        } else {
          setError('Failed to send OTP. Try again.');
        }

        return;
      }

      setError(result?.error || 'Invalid email or password.');
    } catch (error) {
      console.error('LOGIN2 LOGIN ERROR:', error);

      setError(error?.message || 'Unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | OPEN SIGNUP
  |--------------------------------------------------------------------------
  */

  const handleCreateAccount = () => {
    clearMessage();

    setScreen('register');
  };

  /*
  |--------------------------------------------------------------------------
  | SIGNUP
  |--------------------------------------------------------------------------
  */

  const handleSignUp = async ({
    name,
    email,
    password,
    confirmPassword,
    agreeTerms,
  }) => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill all required fields.');

      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');

      return;
    }

    if (!agreeTerms) {
      setError('Please agree with Terms & Condition.');

      return;
    }

    try {
      setIsSubmitting(true);

      clearMessage();

      const registerResult = await signup(name, email, password);

      console.log('LOGIN2 SIGNUP RESULT:', registerResult);

      if (!registerResult?.success) {
        setError(
          registerResult?.error ||
            'Registration failed. Email may already exist.',
        );

        return;
      }

      const otpResult = await sendOTP(email);

      console.log('LOGIN2 SIGNUP OTP RESULT:', otpResult);

      setVerificationEmail(email);

      setLoginPassword(password);

      setOtpMode('signup');

      setScreen('verify');

      if (otpResult?.success) {
        setSuccess('Account created! OTP sent to verify.');
      } else {
        setError('Registered but OTP sending failed.');
      }
    } catch (error) {
      console.error('LOGIN2 SIGNUP ERROR:', error);

      setError(error?.message || 'Unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | REGISTER BACK
  |--------------------------------------------------------------------------
  */

  const handleRegisterBack = () => {
    resetFlow();
  };

  /*
  |--------------------------------------------------------------------------
  | OPEN FORGOT PASSWORD
  |--------------------------------------------------------------------------
  */

  const handleOpenForgotPassword = () => {
    clearMessage();

    setScreen('forgot');
  };

  /*
  |--------------------------------------------------------------------------
  | FORGOT PASSWORD
  |--------------------------------------------------------------------------
  */

  const handleForgotPassword = async email => {
    if (!email) {
      setError('Please enter your email address.');

      return;
    }

    try {
      setIsSubmitting(true);

      clearMessage();

      console.log('LOGIN2: FORGOT PASSWORD:', email);

      const result = await forgotPassword(email);

      console.log('LOGIN2 FORGOT RESULT:', result);

      if (result?.success) {
        setVerificationEmail(email);

        setResetPassword('');

        setOtpMode('forgot');

        setScreen('verify');

        setSuccess('OTP sent to your email.');
      } else {
        setError(result?.error || 'Failed to send OTP.');
      }
    } catch (error) {
      console.error('LOGIN2 FORGOT ERROR:', error);

      setError(error?.message || 'Failed to send OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | VERIFY CODE
  |--------------------------------------------------------------------------
  */

  const handleVerifyCode = async ({ email, code, newPassword }) => {
    console.log('================================');

    console.log('LOGIN2 VERIFY CODE:', code);

    console.log('LOGIN2 OTP LENGTH:', code?.length);

    console.log('LOGIN2 OTP MODE:', otpMode);

    /*
     * IMPORTANT:
     * OTP IS 6 DIGITS.
     */

    if (!code) {
      setError('Please enter the OTP.');

      return;
    }

    if (String(code).length !== 6) {
      setError('Please enter the complete 6-digit OTP.');

      return;
    }

    try {
      setIsSubmitting(true);

      clearMessage();

      /*
       * ======================================================
       * FORGOT PASSWORD
       * ======================================================
       */

      if (otpMode === 'forgot') {
        const passwordToUse = newPassword || resetPassword;

        if (!passwordToUse) {
          setError('Please enter your new password.');

          return;
        }

        console.log('LOGIN2: UPDATE PASSWORD');

        const updateResult = await updatePassword(
          email,
          passwordToUse,
          '',
          code,
        );

        console.log('LOGIN2 UPDATE PASSWORD RESULT:', updateResult);

        if (!updateResult?.success) {
          setError(updateResult?.error || 'Failed to update password.');

          return;
        }

        setResetPassword(passwordToUse);

        setSuccess('Password updated successfully. Logging you in...');

        /*
         * LOGIN AGAIN
         */

        const loginResult = await login(email, passwordToUse);

        console.log('LOGIN2 RESET AUTO LOGIN RESULT:', loginResult);

        if (loginResult?.success) {
          handleAuthSuccess(loginResult);
        } else {
          setError('Password updated but login failed.');
        }

        return;
      }

      /*
       * ======================================================
       * NORMAL LOGIN / SIGNUP OTP
       * ======================================================
       */

      console.log('LOGIN2: CALLING verifyOTP()');

      const verifyResult = await verifyOTP(email, String(code));

      console.log('LOGIN2 VERIFY OTP RESULT:', verifyResult);

      if (!verifyResult?.success) {
        setError(verifyResult?.error || 'Invalid OTP.');

        return;
      }

      setSuccess('OTP verified! Logging you in...');

      /*
       * LOGIN AGAIN
       */

      const loginResult = await login(email, loginPassword);

      console.log('LOGIN2 OTP AUTO LOGIN RESULT:', loginResult);

      if (loginResult?.success) {
        handleAuthSuccess(loginResult);
      } else {
        setError('OTP verified but login failed.');
      }
    } catch (error) {
      console.error('LOGIN2 VERIFY ERROR:', error);

      setError(error?.message || 'Unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | RESEND OTP
  |--------------------------------------------------------------------------
  */

  const handleResendCode = async () => {
    if (!verificationEmail) {
      setError('Email is missing.');

      return;
    }

    try {
      setIsSubmitting(true);

      clearMessage();

      const result = await sendOTP(verificationEmail);

      console.log('LOGIN2 RESEND OTP RESULT:', result);

      if (result?.success) {
        setSuccess('New OTP sent successfully.');
      } else {
        setError(result?.error || 'Failed to resend OTP.');
      }
    } catch (error) {
      console.error('LOGIN2 RESEND ERROR:', error);

      setError('Failed to resend OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | VERIFY BACK
  |--------------------------------------------------------------------------
  */

  const handleVerifyBack = () => {
    clearMessage();

    if (otpMode === 'login' || otpMode === 'signup') {
      setOtpMode(null);

      setVerificationEmail('');

      setLoginPassword('');

      setScreen('login');

      return;
    }

    if (otpMode === 'forgot') {
      setOtpMode(null);

      setScreen('forgot');
    }
  };

  /*
  |--------------------------------------------------------------------------
  | GOOGLE
  |--------------------------------------------------------------------------
  */

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);

      clearMessage();

      if (typeof loginWithGoogle !== 'function') {
        setError('Google login is not configured.');

        return;
      }

      const result = await loginWithGoogle();

      console.log('LOGIN2 GOOGLE RESULT:', result);

      if (result?.success) {
        handleAuthSuccess(result);
      } else {
        setError(result?.error || 'Google login failed.');
      }
    } catch (error) {
      console.error('LOGIN2 GOOGLE ERROR:', error);

      setError('Google login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | APPLE
  |--------------------------------------------------------------------------
  */

  const handleAppleLogin = async () => {
    console.log('LOGIN2 APPLE LOGIN');
  };

  /*
  |--------------------------------------------------------------------------
  | FACEBOOK
  |--------------------------------------------------------------------------
  */

  const handleFacebookLogin = async () => {
    console.log('LOGIN2 FACEBOOK LOGIN');
  };

  /*
  |--------------------------------------------------------------------------
  | ACTION LOADING ONLY
  |--------------------------------------------------------------------------
  */

  const screenLoading = isSubmitting;

  /*
  |--------------------------------------------------------------------------
  | IMPORTANT:
  |
  | Do not use authLoading here.
  | AuthContext's loading should never hide
  | the entire authentication UI.
  |--------------------------------------------------------------------------
  */

  /*
  |--------------------------------------------------------------------------
  | MODAL CONTENT
  |--------------------------------------------------------------------------
  */

  let modalContent = null;

  if (screen === 'login') {
    modalContent = (
      <LoginScreen
        onSignIn={handleSignIn}
        onForgotPassword={handleOpenForgotPassword}
        onCreateAccount={handleCreateAccount}
        onAppleLogin={handleAppleLogin}
        onGoogleLogin={handleGoogleLogin}
        onFacebookLogin={handleFacebookLogin}
        loading={screenLoading}
        message={message}
        messageType={messageType}
      />
    );
  } else if (screen === 'register') {
    modalContent = (
      <CreateAccountScreen
        onSignUp={handleSignUp}
        onSignIn={handleRegisterBack}
        onAppleLogin={handleAppleLogin}
        onGoogleLogin={handleGoogleLogin}
        onFacebookLogin={handleFacebookLogin}
        loading={screenLoading}
        message={message}
        messageType={messageType}
      />
    );
  } else if (screen === 'forgot') {
    modalContent = (
      <ForgotPasswordScreen
        onBack={resetFlow}
        onSubmit={handleForgotPassword}
        loading={screenLoading}
        message={message}
        messageType={messageType}
      />
    );
  } else if (screen === 'verify') {
    modalContent = (
      <VerifyCodeScreen
        email={verificationEmail}
        mode={otpMode}
        onBack={handleVerifyBack}
        onVerify={handleVerifyCode}
        onResendCode={handleResendCode}
        loading={screenLoading}
        message={message}
        messageType={messageType}
      />
    );
  }

  /*
  |--------------------------------------------------------------------------
  | BOTTOM SHEET + DRAG TO CLOSE
  |--------------------------------------------------------------------------
  */

  const screenHeight = Dimensions.get('window').height;

  const sheetTranslateY = useRef(new Animated.Value(screenHeight)).current;

  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const isClosingRef = useRef(false);
  const dragStartY = useRef(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(sheetTranslateY, {
        toValue: 0,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [backdropOpacity, sheetTranslateY]);

  const closeModal = () => {
    if (isClosingRef.current) {
      return;
    }

    isClosingRef.current = true;

    Animated.parallel([
      Animated.timing(sheetTranslateY, {
        toValue: screenHeight,
        duration: 330,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 260,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        router.back();
      }
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isClosingRef.current,

      onMoveShouldSetPanResponder: (_, gestureState) =>
        !isClosingRef.current && Math.abs(gestureState.dy) > 4,

      onPanResponderGrant: () => {
        sheetTranslateY.stopAnimation(value => {
          dragStartY.current = value;
        });
      },

      onPanResponderMove: (_, gestureState) => {
        if (isClosingRef.current) {
          return;
        }

        // Only allow the sheet to move downward.
        const nextY = Math.max(
          0,
          dragStartY.current + Math.max(0, gestureState.dy),
        );

        sheetTranslateY.setValue(nextY);

        // Fade the background naturally while dragging.
        const progress = Math.min(1, nextY / (screenHeight * 0.55));

        backdropOpacity.setValue(Math.max(0.25, 1 - progress * 0.7));
      },

      onPanResponderRelease: (_, gestureState) => {
        if (isClosingRef.current) {
          return;
        }

        const shouldClose = gestureState.dy > 120 || gestureState.vy > 1.15;

        if (shouldClose) {
          closeModal();
          return;
        }

        Animated.parallel([
          Animated.spring(sheetTranslateY, {
            toValue: 0,
            damping: 22,
            stiffness: 220,
            mass: 0.9,
            useNativeDriver: true,
          }),
          Animated.timing(backdropOpacity, {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
          }),
        ]).start();
      },

      onPanResponderTerminate: () => {
        if (isClosingRef.current) {
          return;
        }

        Animated.parallel([
          Animated.spring(sheetTranslateY, {
            toValue: 0,
            damping: 22,
            stiffness: 220,
            mass: 0.9,
            useNativeDriver: true,
          }),
          Animated.timing(backdropOpacity, {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
          }),
        ]).start();
      },
    }),
  ).current;

  return (
    <View style={styles.modalRoot}>
      <Stack.Screen
        options={{
          presentation: 'transparentModal',
          animation: 'none',
          headerShown: false,
          contentStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />

      {/* BLURRED BACKGROUND */}
      <Animated.View
        pointerEvents="box-none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            opacity: backdropOpacity,
          },
        ]}>
        <BlurView
          intensity={42}
          tint="light"
          style={StyleSheet.absoluteFillObject}
        />

        <View style={styles.glassTint} />

        <Pressable style={StyleSheet.absoluteFillObject} onPress={closeModal} />
      </Animated.View>

      {/* BOTTOM SHEET */}
      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [
              {
                translateY: sheetTranslateY,
              },
            ],
          },
        ]}>
        <View {...panResponder.panHandlers} style={styles.grabberTouchArea}>
          <View style={styles.grabber} />
        </View>

        <View style={styles.sheetGlass}>{modalContent}</View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  glassTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(248, 247, 245, 0.25)',
  },

  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '92%',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 20,
  },

  sheetGlass: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.72)',
  },

  grabberTouchArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 48,
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 100,
  },

  grabber: {
    marginTop: 10,
    width: 46,
    height: 5,
    borderRadius: 4,
    backgroundColor: 'rgba(70,70,70,0.24)',
  },
});

export default Login2;
