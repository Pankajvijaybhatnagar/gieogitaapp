import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtpRequest, verifyOtpSuccess, verifyOtpFailure } from '../redux/authSlice';
import { router, useLocalSearchParams } from 'expo-router'; // Using Expo Router for navigation

const OtpScreen = () => {
  const { phoneNumber } = useLocalSearchParams(); // Get phone number from navigation params
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30); // Countdown timer for 30 seconds
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    // Start countdown on component mount
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer
  }, []);

  const handleOtpVerification = () => {
    if (otp.trim() === '') {
      dispatch(verifyOtpFailure('OTP cannot be empty'));
      return;
    }

    dispatch(verifyOtpRequest());

    // Simulate OTP verification logic (replace with actual API call)
    if (otp === auth.user.otp) {
      // On successful OTP verification
      dispatch(verifyOtpSuccess({ phoneNumber }));
      router.push('/home'); // Navigate to home or desired screen
    } else {
      // On OTP verification failure
      dispatch(verifyOtpFailure('Invalid OTP'));
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../../assets/logo.png')} style={styles.logo} />

      {/* Title */}
      <Text style={styles.title}>Enter OTP sent to {phoneNumber}</Text>

      {/* Input field for OTP */}
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={4} // Assuming OTP is 4 digits
      />

      {/* Countdown timer */}
      <Text style={styles.countdown}>
        {countdown > 0 ? `Resend OTP in ${countdown}s` : 'You can resend the OTP now'}
      </Text>

      {/* OTP verification button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleOtpVerification} disabled={loading }>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Verify OTP</Text>
        )}
      </TouchableOpacity>

      {/* Error message */}
      {auth.error && <Text style={styles.error}>{auth.error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8B3E2F',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  countdown: {
    marginBottom: 20,
    color: '#FF8C00',
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#FF8C00',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

// Expo Router configuration to hide the header
export const config = {
  options: {
    headerShown: false, // Hides the header on this screen
  },
};

export default OtpScreen;
