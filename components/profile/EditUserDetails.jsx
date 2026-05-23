import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, Easing, ToastAndroid, StatusBar, Keyboard, Button, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { updateUserDetails } from '../redux/authSlice'; // Assuming updateUserDetails action exists

const EditUserDetails = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // Assuming user data is stored in auth slice

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [address, setAddress] = useState(user?.address || '');

  const [fadeAnim] = useState(new Animated.Value(0));
  const [showDatePicker, setShowDatePicker] = useState(false); // To control date picker visibility
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    // Animation on mount
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleUpdate = () => {
    // Close the keyboard
    Keyboard.dismiss();

    // Dispatch the update action
    dispatch(updateUserDetails({ name, phone, dob, address }));

    // Show success toast using ToastAndroid
    ToastAndroid.showWithGravity(
      'Profile updated successfully!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios'); // For iOS, keep picker open until user selects
    setDate(currentDate);
    setDob(currentDate.toLocaleDateString()); // Format date as needed
  };

  return (
    <Animated.View style={{ opacity: fadeAnim, flex: 1, justifyContent: 'center', padding: 20 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
      <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
        Edit User Details
      </Text>

      <View style={{ marginBottom: 10 }}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Name"
        />
      </View>

      <View style={{ marginBottom: 10 }}>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone"
          keyboardType="phone-pad"
        />
      </View>

      <View style={{ marginBottom: 10 }}>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            style={styles.input}
            value={dob}
            placeholder="Date of Birth (DD-MM-YYYY)"
            editable={false} // Make it readonly so users cannot manually type the date
          />
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()} // Optional: restrict to current or past dates
        />
      )}

      <View style={{ marginBottom: 10 }}>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Address"
        />
      </View>

      <TouchableOpacity
        onPress={handleUpdate}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Update Details</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = {
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    fontSize: 15,
    width: '100%',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
};

export default EditUserDetails;
