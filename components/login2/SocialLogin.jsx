import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Logos } from '../../assets/images';

const BORDER_COLOR = '#E6E6E6';

export default function SocialLogin({
  onAppleLogin,
  onGoogleLogin,
  disabled = false,
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.socialButton}
        onPress={onAppleLogin}
        disabled={disabled}
        activeOpacity={0.8}>
        <FontAwesome name="apple" size={21} color="#000000" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.socialButton}
        onPress={onGoogleLogin}
        disabled={disabled}
        activeOpacity={0.8}>
        <Image source={Logos.google} style={{ width: 22, height: 22 }} />
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 7,
    elevation: 2,
  },
});
