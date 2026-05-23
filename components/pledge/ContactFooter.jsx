import { FontAwesome } from '@expo/vector-icons';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { C } from './constants';

export default function ContactFooter() {
  return (
    <View style={styles.contactBox}>
      <Text style={styles.contactTitle}>🙏  Need Help with Seva?</Text>
      <Text style={styles.contactDesc}>
        For large donations, custom sevas or special occasions, our seva team is happy to assist
        you personally.
      </Text>
      <View style={styles.contactRow}>
        <TouchableOpacity
          style={styles.contactBtn}
          onPress={() => Linking.openURL('tel:+919999999999')}
          activeOpacity={0.85}
        >
          <FontAwesome name="phone" size={13} color={C.deepBrown} />
          <Text style={styles.contactBtnText}>Call Us</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.contactBtn, { backgroundColor: C.saffron }]}
          onPress={() => Linking.openURL('https://wa.me/919999999999')}
          activeOpacity={0.85}
        >
          <FontAwesome name="whatsapp" size={13} color={C.white} />
          <Text style={[styles.contactBtnText, { color: C.white }]}>WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contactBox: {
    backgroundColor: C.creamDark, marginHorizontal: 16,
    borderRadius: 18, padding: 20, marginTop: 4,
    borderWidth: 1, borderColor: C.goldBorder, alignItems: 'center',
  },
  contactTitle: { fontSize: 16, fontWeight: '800', color: C.deepBrown, marginBottom: 8 },
  contactDesc:  {
    fontSize: 12, color: C.warmBrown, textAlign: 'center',
    lineHeight: 18, fontStyle: 'italic', marginBottom: 14,
  },
  contactRow:   { flexDirection: 'row', gap: 10 },
  contactBtn: {
    backgroundColor: C.gold, borderRadius: 20,
    paddingVertical: 10, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  contactBtnText: { fontSize: 13, fontWeight: '800', color: C.deepBrown },
});