import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated2, { FadeInDown } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserDetails } from '../redux/authSlice';
import { C } from './constants';
import { SectionHeader } from './InfoCard';

function StyledInput({ icon, placeholder, value, onChangeText, keyboardType, editable = true, onPress }) {
  const content = (
    <View style={styles.inputRow}>
      <View style={styles.inputIconBox}>
        <FontAwesome name={icon} size={13} color={C.goldDark} />
      </View>
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor={C.goldDark}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || 'default'}
        editable={editable}
      />
      {!editable && (
        <FontAwesome name="calendar" size={13} color={C.goldDark} style={{ marginRight: 12 }} />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.inputWrap}>
        {content}
      </TouchableOpacity>
    );
  }
  return <View style={styles.inputWrap}>{content}</View>;
}

export default function EditUserDetails() {
  const dispatch = useDispatch();
  const user     = useSelector((state) => state.auth.user);

  const [name,           setName]           = useState(user?.name    || '');
  const [phone,          setPhone]          = useState(user?.phone   || '');
  const [dob,            setDob]            = useState(user?.dob     || '');
  const [address,        setAddress]        = useState(user?.address || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date,           setDate]           = useState(new Date());
  const [fadeAnim]                          = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, duration: 800,
      easing: Easing.ease, useNativeDriver: true,
    }).start();
  }, []);

  const handleUpdate = () => {
    Keyboard.dismiss();
    dispatch(updateUserDetails({ name, phone, dob, address }));
    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravity('Profile updated! 🙏', ToastAndroid.SHORT, ToastAndroid.CENTER);
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
    setDob(currentDate.toLocaleDateString('en-IN'));
  };

  return (
    <Animated2.View entering={FadeInDown.delay(320)} style={styles.editSection}>
      <SectionHeader iconName="edit" label="EDIT DETAILS" />

      <Animated.View style={[styles.editCard, { opacity: fadeAnim }]}>
        <Text style={styles.editCardTitle}>Update Your Information</Text>

        <StyledInput
          icon="user"
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
        <StyledInput
          icon="phone"
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <StyledInput
          icon="calendar"
          placeholder="Date of Birth (DD/MM/YYYY)"
          value={dob}
          editable={false}
          onPress={() => setShowDatePicker(true)}
        />
        <StyledInput
          icon="map-marker"
          placeholder="Address / City"
          value={address}
          onChangeText={setAddress}
        />

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}

        <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate} activeOpacity={0.85}>
          <FontAwesome name="check-circle" size={15} color={C.deepBrown} style={{ marginRight: 8 }} />
          <Text style={styles.updateBtnText}>Update Profile</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated2.View>
  );
}

const styles = StyleSheet.create({
  editSection: { paddingHorizontal: 20, paddingTop: 10 },

  editCard: {
    backgroundColor: C.white, borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: C.goldBorder,
    shadowColor: C.deepBrown, shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 2,
  },
  editCardTitle: {
    fontSize: 13, fontWeight: '800', color: C.deepBrown,
    letterSpacing: 0.3, marginBottom: 14,
  },

  inputWrap: {
    marginBottom: 10,
    borderRadius: 12, overflow: 'hidden',
    borderWidth: 1, borderColor: C.goldBorder,
    backgroundColor: C.creamDark,
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
  },
  inputIconBox: {
    width: 44, height: 48,
    backgroundColor: 'rgba(201,162,39,0.08)',
    borderRightWidth: 1, borderRightColor: C.goldBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  textInput: {
    flex: 1, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: C.deepBrown, fontWeight: '600',
  },

  updateBtn: {
    backgroundColor: C.gold, borderRadius: 22,
    paddingVertical: 13, marginTop: 6,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    shadowColor: C.gold, shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 3,
  },
  updateBtnText: { fontSize: 14, fontWeight: '800', color: C.deepBrown, letterSpacing: 0.3 },
});