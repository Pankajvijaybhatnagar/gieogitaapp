import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { C, OCCASIONS, UPI_ID, UPI_NAME } from './constants';

const { width } = Dimensions.get('window');

export default function PaymentModal({ visible, seva, onClose }) {
  const [name,      setName]      = useState('');
  const [phone,     setPhone]     = useState('');
  const [occasion,  setOccasion]  = useState('General Donation');
  const [customAmt, setCustomAmt] = useState('');

  const amount = customAmt ? parseInt(customAmt, 10) : seva?.amount || 0;

  const openUPI = (app) => {
    if (!name.trim()) {
      Alert.alert('🙏 Required', 'Please enter your name before proceeding.');
      return;
    }
    const note   = `${seva?.name} - ${occasion} - ${name}`;
    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

    let intentUrl = upiUrl;
    if (app === 'gpay')  intentUrl = `gpay://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    if (app === 'bhim')  intentUrl = `bhim://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    if (app === 'phone') intentUrl = `phonepe://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    if (app === 'paytm') intentUrl = `paytmmp://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

    Linking.canOpenURL(intentUrl).then((supported) => {
      if (supported) {
        Linking.openURL(intentUrl);
      } else {
        Linking.openURL(upiUrl).catch(() =>
          Alert.alert('🙏 App not found', `Please install the app or use UPI ID: ${UPI_ID}`)
        );
      }
    });
  };

  if (!seva) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={PM.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={PM.sheet}>
          <View style={PM.handle} />

          {/* Header */}
          <View style={PM.header}>
            <View style={PM.headerBlob} />
            <Text style={PM.headerEmoji}>{seva.icon}</Text>
            <Text style={PM.headerTitle}>{seva.name}</Text>
            <Text style={PM.headerDesc}>{seva.benefit}</Text>
            <TouchableOpacity style={PM.closeBtn} onPress={onClose}>
              <FontAwesome name="times" size={14} color={C.goldLight} />
            </TouchableOpacity>
          </View>

          <ScrollView style={PM.body} showsVerticalScrollIndicator={false}>

            {/* Amount row */}
            <View style={PM.amountRow}>
              <View style={PM.amountBox}>
                <Text style={PM.amountLabel}>Suggested Amount</Text>
                <Text style={PM.amountValue}>₹ {seva.amount.toLocaleString()}</Text>
              </View>
              <View style={PM.amountInput}>
                <Text style={PM.amountLabel}>Custom Amount</Text>
                <TextInput
                  style={PM.amountTextInput}
                  placeholder="Enter ₹"
                  placeholderTextColor={C.goldDark}
                  keyboardType="numeric"
                  value={customAmt}
                  onChangeText={setCustomAmt}
                />
              </View>
            </View>

            {/* Name */}
            <Text style={PM.fieldLabel}>Your Name *</Text>
            <TextInput
              style={PM.textInput}
              placeholder="Enter your name"
              placeholderTextColor={C.goldDark}
              value={name}
              onChangeText={setName}
            />

            {/* Phone */}
            <Text style={PM.fieldLabel}>Phone (optional)</Text>
            <TextInput
              style={PM.textInput}
              placeholder="For donation receipt"
              placeholderTextColor={C.goldDark}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            {/* Occasion */}
            <Text style={PM.fieldLabel}>Occasion</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={PM.occasionScroll}>
              {OCCASIONS.map((o) => (
                <TouchableOpacity
                  key={o.label}
                  style={[PM.occasionChip, occasion === o.label && PM.occasionChipActive]}
                  onPress={() => setOccasion(o.label)}
                  activeOpacity={0.8}
                >
                  <Text style={PM.occasionIcon}>{o.icon}</Text>
                  <Text style={[PM.occasionLabel, occasion === o.label && PM.occasionLabelActive]}>
                    {o.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Occasion note */}
            {occasion !== 'General Donation' && (
              <View style={PM.occasionNote}>
                <Text style={PM.occasionNoteText}>
                  🪷 This seva will be performed on behalf of{' '}
                  <Text style={{ fontWeight: '800' }}>{name || 'you'}</Text> for{' '}
                  <Text style={{ fontWeight: '800' }}>{occasion}</Text>. A divine ritual will be
                  conducted at Gita Gyan Sansthanam, Kurukshetra in your honour.
                </Text>
              </View>
            )}

            {/* Total */}
            <View style={PM.totalRow}>
              <Text style={PM.totalLabel}>Total Donation</Text>
              <Text style={PM.totalAmount}>₹ {amount.toLocaleString()}</Text>
            </View>

            {/* Pay buttons */}
            <Text style={PM.payLabel}>Choose Payment App</Text>
            <View style={PM.payGrid}>
              <TouchableOpacity style={[PM.payBtn, { backgroundColor: '#1A73E8' }]} onPress={() => openUPI('gpay')} activeOpacity={0.85}>
                <Text style={PM.payBtnEmoji}>G</Text>
                <Text style={PM.payBtnText}>Google Pay</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[PM.payBtn, { backgroundColor: '#00BAF2' }]} onPress={() => openUPI('bhim')} activeOpacity={0.85}>
                <Text style={PM.payBtnEmoji}>₹</Text>
                <Text style={PM.payBtnText}>BHIM UPI</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[PM.payBtn, { backgroundColor: '#5F259F' }]} onPress={() => openUPI('phone')} activeOpacity={0.85}>
                <Text style={PM.payBtnEmoji}>Pe</Text>
                <Text style={PM.payBtnText}>PhonePe</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[PM.payBtn, { backgroundColor: '#00B9F1' }]} onPress={() => openUPI('paytm')} activeOpacity={0.85}>
                <Text style={PM.payBtnEmoji}>P</Text>
                <Text style={PM.payBtnText}>Paytm</Text>
              </TouchableOpacity>
            </View>

            {/* Any UPI */}
            <TouchableOpacity style={PM.anyUpiBtn} onPress={() => openUPI('any')} activeOpacity={0.85}>
              <FontAwesome name="mobile" size={16} color={C.deepBrown} style={{ marginRight: 8 }} />
              <Text style={PM.anyUpiBtnText}>Pay with Any UPI App</Text>
            </TouchableOpacity>

            {/* UPI ID */}
            <View style={PM.upiIdRow}>
              <Text style={PM.upiIdLabel}>UPI ID: </Text>
              <Text style={PM.upiIdValue}>{UPI_ID}</Text>
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const PM = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    backgroundColor: C.cream, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    borderTopWidth: 2, borderTopColor: C.gold, maxHeight: '90%',
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: C.goldDark, alignSelf: 'center', marginTop: 10, marginBottom: 4 },

  header: {
    backgroundColor: C.deepBrown, padding: 20, alignItems: 'center',
    position: 'relative', overflow: 'hidden',
    borderBottomWidth: 1, borderBottomColor: C.gold,
  },
  headerBlob:  { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(201,162,39,0.07)', top: -60, right: -50 },
  headerEmoji: { fontSize: 36, marginBottom: 6 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: C.cream },
  headerDesc:  { fontSize: 11, color: C.goldDark, fontStyle: 'italic', marginTop: 3 },
  closeBtn: {
    position: 'absolute', top: 12, right: 14,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(201,162,39,0.15)', borderWidth: 1, borderColor: C.goldBorder,
    alignItems: 'center', justifyContent: 'center',
  },

  body:         { paddingHorizontal: 20 },
  amountRow:    { flexDirection: 'row', gap: 12, marginTop: 16, marginBottom: 6 },
  amountBox: {
    flex: 1, backgroundColor: C.deepBrown, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: C.goldBorder, alignItems: 'center',
  },
  amountLabel:     { fontSize: 10, color: C.goldDark, fontWeight: '700', marginBottom: 4 },
  amountValue:     { fontSize: 22, fontWeight: '800', color: C.goldLight },
  amountInput: {
    flex: 1, backgroundColor: C.creamDark, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: C.goldBorder,
  },
  amountTextInput: { fontSize: 20, fontWeight: '800', color: C.deepBrown, borderBottomWidth: 1, borderBottomColor: C.goldBorder, paddingVertical: 2 },

  fieldLabel: { fontSize: 11, fontWeight: '700', color: C.goldDark, marginTop: 12, marginBottom: 6, letterSpacing: 0.5 },
  textInput: {
    backgroundColor: C.white, borderRadius: 12, borderWidth: 1, borderColor: C.goldBorder,
    paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: C.deepBrown,
  },

  occasionScroll:      { marginTop: 2, marginBottom: 4 },
  occasionChip: {
    alignItems: 'center', backgroundColor: C.creamDark, borderWidth: 1, borderColor: C.goldBorder,
    borderRadius: 14, padding: 10, marginRight: 8, minWidth: 80,
  },
  occasionChipActive:  { backgroundColor: C.deepBrown, borderColor: C.gold },
  occasionIcon:        { fontSize: 18, marginBottom: 4 },
  occasionLabel:       { fontSize: 10, color: C.warmBrown, fontWeight: '600', textAlign: 'center' },
  occasionLabelActive: { color: C.goldLight },

  occasionNote: {
    backgroundColor: 'rgba(201,162,39,0.08)', borderRadius: 12, padding: 12, marginTop: 10,
    borderWidth: 1, borderColor: C.goldBorder, borderLeftWidth: 3, borderLeftColor: C.gold,
  },
  occasionNoteText: { fontSize: 12, color: C.warmBrown, lineHeight: 18, fontStyle: 'italic' },

  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: C.deepBrown, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12,
    marginTop: 14, marginBottom: 4, borderWidth: 1, borderColor: C.goldBorder,
  },
  totalLabel:  { fontSize: 13, color: C.goldDark, fontWeight: '700' },
  totalAmount: { fontSize: 22, fontWeight: '800', color: C.goldLight },

  payLabel: { fontSize: 11, fontWeight: '800', color: C.goldDark, letterSpacing: 1, marginTop: 14, marginBottom: 10 },
  payGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  payBtn: {
    width: (width - 60) / 2, borderRadius: 14, paddingVertical: 13,
    alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8,
  },
  payBtnEmoji: { fontSize: 16, fontWeight: '900', color: C.white },
  payBtnText:  { fontSize: 13, fontWeight: '800', color: C.white },

  anyUpiBtn: {
    backgroundColor: C.gold, borderRadius: 22, paddingVertical: 13, marginTop: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  anyUpiBtnText: { fontSize: 14, fontWeight: '800', color: C.deepBrown },

  upiIdRow:  { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  upiIdLabel:{ fontSize: 11, color: C.goldDark },
  upiIdValue:{ fontSize: 12, fontWeight: '800', color: C.deepBrown },
});