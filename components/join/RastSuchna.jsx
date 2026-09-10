import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import Card from '@/components/ui/Card';
import { COLORS, RGB } from '@/constants/brandColors';
import { radii, spacing, type } from '@/constants/theme';

export default function RastSuchna() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.heading}>
        <View style={styles.headingIcon}>
          <Ionicons
            name="notifications-outline"
            size={19}
            color={COLORS.goldDark}
          />
        </View>

        <View>
          <Text style={styles.eyebrow}>GIEO GITA UPDATE</Text>

          <Text style={styles.title}>राष्ट्र सूचना</Text>
        </View>
      </View>

      <Card radius={radii.xl} style={styles.card}>
        <View style={styles.quoteLine} />

        <Text style={styles.text}>
          🌹 बाल संस्कार योजना आज की सबसे महत्वपूर्ण आवश्यकता है। हमारी भावी
          पीढ़ी संस्कारवान बने, अपनी परंपराओं और अपने ग्रंथों को जाने।
          {'\n\n'}
          🌺 इसी दृष्टिकोण से पूज्य गुरुदेव गीता मनीषी स्वामी श्री ज्ञानानंद जी
          महाराज के सानिध्य में जीओगीता द्वारा विशेष अभियान &quot;बाल संस्कार योजना&quot;
          प्रारंभ किया गया है।
          {'\n\n'}
          इसके अंतर्गत हर नगर में अधिक से अधिक स्थानों, गली, मोहल्ले और सेक्टर
          आदि में 5 से 15 वर्ष के बच्चों के लिए सप्ताह में एक दिन एक घंटे की
          कक्षा लगाने की योजना है।
          {'\n\n'}
          💫 इस अभियान में महिला मंडलों का विशेष योगदान है। सभी समितियों के
          संयोजक, अध्यक्ष और पदाधिकारियों से आग्रह है कि अपने महिला मंडलों के
          साथ समन्वय से इस अभियान को अपने नगर में अधिक से अधिक स्थानों पर
          प्रारंभ करें।
          {'\n\n'}
          🔔 अधिक जानकारी के लिए संपर्क करें:
          {'\n'}
          स्वामी शक्ति जी — 8700652182
          {'\n'}
          बिट्टू अग्रवाल जी — 9646954500
          {'\n'}
          सुषमा जी — 9254585312
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg - 2
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm + 3
  },
  headingIcon: {
    width: 39,
    height: 39,
    borderRadius: radii.md - 1,
    backgroundColor: `rgba(${RGB.gold}, 0.14)`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 2
  },
  eyebrow: {
    color: COLORS.goldDark,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.4
  },
  title: {
    marginTop: 1,
    ...type.title,
    fontSize: 20,
    color: COLORS.deepBrown
  },
  card: {
    padding: spacing.lg - 6,
    position: 'relative'
  },
  quoteLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: COLORS.saffron
  },
  text: {
    ...type.body,
    color: COLORS.deepBrown,
    lineHeight: 23,
    textAlign: 'left'
  }
});
