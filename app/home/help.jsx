import { useState } from 'react';

import {
    Linking,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { useAppAlert } from '@/context/AppAlertContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Spacer from '@/components/ui/Spacer';
import { COLORS } from '@/constants/brandColors';
import { hairline, radii, shadow, spacing, type } from '@/constants/theme';

// ============================================================
// FAQ DATA
// ============================================================

const FAQS = [
  {
    id: 1,
    question: 'How do I create or manage my account?',
    answer:
      'You can manage your account from the Profile section. From there, you can view your information and access available account options.',
  },
  {
    id: 2,
    question: 'How can I ask a question to Maharaj Ji?',
    answer:
      'Open the Question Seva section in the app, enter your details and question, then tap Submit Question.',
  },
  {
    id: 3,
    question: 'Where can I watch Maharaj Ji’s videos?',
    answer:
      'You can watch pravachans, satsangs and other spiritual videos from the video section available inside the app.',
  },
  {
    id: 4,
    question: 'What should I do if something is not working?',
    answer:
      'First check your internet connection and reopen the app. If the problem continues, use the Contact Support options below.',
  },
];

// ============================================================
// QUICK HELP ITEM
// ============================================================

function QuickHelpItem({ icon, title, subtitle, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.82}
      style={styles.quickHelpCard}
      onPress={onPress}>
      <View style={styles.quickIconBox}>
        <MaterialCommunityIcons name={icon} size={23} color={COLORS.saffron} />
      </View>

      <View style={styles.quickTextArea}>
        <Text style={styles.quickTitle}>{title}</Text>

        <Text style={styles.quickSubtitle} numberOfLines={2}>
          {subtitle}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color={COLORS.warmBrown} />
    </TouchableOpacity>
  );
}

// ============================================================
// FAQ ITEM
// ============================================================

function FAQItem({ item, expanded, onPress }) {
  return (
    <View style={styles.faqCard}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.faqHeader}>
        <View style={styles.faqQuestionArea}>
          <View style={styles.questionCircle}>
            <Text style={styles.questionMark}>?</Text>
          </View>

          <Text style={styles.faqQuestion}>{item.question}</Text>
        </View>

        <View
          style={[styles.expandButton, expanded && styles.expandButtonActive]}>
          <Ionicons
            name={expanded ? 'remove' : 'add'}
            size={17}
            color={expanded ? COLORS.white : COLORS.saffron}
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.answerContainer}>
          <View style={styles.answerLine} />

          <Text style={styles.answerText}>{item.answer}</Text>
        </View>
      )}
    </View>
  );
}

// ============================================================
// MAIN HELP SCREEN
// ============================================================

export default function Help() {
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const { alert, success, error, warning, loading, hide } = useAppAlert();
  // ==========================================================
  // OPEN WEBSITE
  // ==========================================================

  const openWebsite = async () => {
    const url = 'https://www.gieogita.org';

    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        error('Unable to Open', 'The website could not be opened.');
      }
    } catch (_error) {
      error('Error', 'Something went wrong while opening the website.');
    }
  };

  // ==========================================================
  // EMAIL SUPPORT
  // ==========================================================

  const emailSupport = async () => {
    const email = 'mailto:info@gieogita.org?subject=GIEO GITA App Support';

    try {
      const supported = await Linking.canOpenURL(email);

      if (supported) {
        await Linking.openURL(email);
      } else {
        error(
          'Email Not Available',
          'No email application was found on this device.',
        );
      }
    } catch (_error) {
      error('Error', 'Unable to open the email application.');
    }
  };

  // ==========================================================
  // FAQ
  // ==========================================================

  const handleFAQPress = id => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />

      <View style={styles.root}>
        {/* ==================================================
            HEADER
        ================================================== */}

        <View style={styles.header}>
          <View style={styles.headerDecoration}>
            <View style={styles.headerDecorationLine} />

            <View style={styles.headerDecorationDot} />
          </View>

          <View style={styles.headerTop}>
            <View style={styles.headerIcon}>
              <MaterialCommunityIcons
                name="lifebuoy"
                size={25}
                color={COLORS.white}
              />
            </View>

            <View style={styles.headerTextArea}>
              <Text style={styles.headerTitle}>Help & Support</Text>

              <Text style={styles.headerSubtitle}>
                How can we help you today?
              </Text>
            </View>
          </View>

          <Text style={styles.headerDescription}>
            Find quick answers or contact our team if you need assistance.
          </Text>
        </View>

        {/* ==================================================
            CONTENT
        ========================  ========================== */}

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* =================================================
              QUICK HELP
          ================================================= */}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Help</Text>

            <Text style={styles.sectionSubtitle}>
              Choose what you need help with
            </Text>
          </View>

          <View style={styles.quickHelpContainer}>
            <QuickHelpItem
              icon="account-circle-outline"
              title="Account Help"
              subtitle="Profile, login and account assistance"
              onPress={() =>
                success(
                  'Account Help',
                  'You can manage your account from the Profile section of the app.',
                )
              }
            />

            <QuickHelpItem
              icon="message-question-outline"
              title="Question Seva"
              subtitle="Ask your question and get guidance"
              onPress={() =>
                success(
                  'Question Seva',
                  'Please open Question Seva from the app to submit your question.',
                )
              }
            />

            <QuickHelpItem
              icon="play-circle-outline"
              title="Videos & Pravachan"
              subtitle="Help with spiritual videos and content"
              onPress={() =>
                success(
                  'Videos & Pravachan',
                  'Open the videos section to watch available pravachans and spiritual content.',
                )
              }
            />
          </View>

          {/* =================================================
              FAQ
          ================================================= */}

          <View style={[styles.sectionHeader, styles.faqSectionHeader]}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

            <Text style={styles.sectionSubtitle}>
              Answers to common questions
            </Text>
          </View>

          <View style={styles.faqContainer}>
            {FAQS.map(item => (
              <FAQItem
                key={item.id}
                item={item}
                expanded={expandedFAQ === item.id}
                onPress={() => handleFAQPress(item.id)}
              />
            ))}
          </View>

          {/* =================================================
              SUPPORT CTA
          ================================================= */}

          <View style={styles.supportCard}>
            <View style={styles.supportIconBox}>
              <MaterialCommunityIcons
                name="headset"
                size={28}
                color={COLORS.saffron}
              />
            </View>

            <Text style={styles.supportTitle}>Still Need Help?</Text>

            <Text style={styles.supportDescription}>
              If you could not find the answer you need, our team is here to
              assist you.
            </Text>

            <View style={styles.supportActions}>
              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.85}
                onPress={emailSupport}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={17}
                  color={COLORS.white}
                />

                <Text style={styles.primaryButtonText}>Email Support</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                activeOpacity={0.85}
                onPress={openWebsite}>
                <MaterialCommunityIcons
                  name="web"
                  size={17}
                  color={COLORS.saffron}
                />

                <Text style={styles.secondaryButtonText}>Visit Website</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* =================================================
              SMALL FOOTER
          ================================================= */}

          <View style={styles.footer}>
            <View style={styles.footerLine} />

            <Text style={styles.footerBrand}>GIEO GITA</Text>

            <Text style={styles.footerText}>We are here to help</Text>
          </View>
          <Spacer height={120} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  // ==========================================================
  // BASE
  // ==========================================================

  safeArea: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 35 : 25,
  },
  // ==========================================================
  // HEADER
  // ==========================================================

  header: {
    backgroundColor: COLORS.creamDark,
    paddingHorizontal: spacing.md,
    paddingTop: 18,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
  },
  headerDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerDecorationLine: {
    width: 37,
    height: 2,
    borderRadius: 2,
    backgroundColor: COLORS.saffron,
  },
  headerDecorationDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginLeft: 5,
    backgroundColor: COLORS.saffron,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
    backgroundColor: COLORS.saffron,
  },
  headerTextArea: {
    flex: 1,
  },
  headerTitle: {
    ...type.title,
    color: COLORS.deepBrown,
  },
  headerSubtitle: {
    color: COLORS.warmBrown,
    fontSize: 12,
    marginTop: 3,
  },
  headerDescription: {
    maxWidth: 350,
    marginTop: spacing.md,
    color: COLORS.warmBrown,
    fontSize: 12,
    lineHeight: 18,
  },
  // ==========================================================
  // SECTION HEADER
  // ==========================================================

  sectionHeader: {
    marginHorizontal: 18,
    marginTop: 22,
    marginBottom: 11,
  },
  faqSectionHeader: {
    marginTop: 25,
  },
  sectionTitle: {
    color: COLORS.deepBrown,
    fontSize: 16,
    fontWeight: '600',
  },
  sectionSubtitle: {
    color: COLORS.warmBrown,
    fontSize: 12,
    marginTop: 2,
  },
  // ==========================================================
  // QUICK HELP
  // ==========================================================

  quickHelpContainer: {
    marginHorizontal: 18,
  },
  quickHelpCard: {
    minHeight: 71,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 24,
    backgroundColor: COLORS.cream,
    ...shadow.card,
    borderColor: hairline,
    borderWidth: 1,
    shadowOpacity: 0.045,
    elevation: 2,
  },
  quickIconBox: {
    width: 42,
    height: 42,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
    backgroundColor: COLORS.creamDark,
  },
  quickTextArea: {
    flex: 1,
    paddingRight: 7,
  },
  quickTitle: {
    color: COLORS.deepBrown,
    fontSize: 12.5,
    fontWeight: '600',
    marginBottom: 3,
  },
  quickSubtitle: {
    color: COLORS.warmBrown,
    fontSize: 12,
    lineHeight: 18,
  },
  // ==========================================================
  // FAQ
  // ==========================================================

  faqContainer: {
    marginHorizontal: 18,
  },
  faqCard: {
    marginBottom: 9,
    overflow: 'hidden',
    borderRadius: 24,
    backgroundColor: COLORS.cream,
    ...shadow.card,
    borderColor: hairline,
    borderWidth: 1,
    shadowOpacity: 0.045,
    elevation: 2,
  },
  faqHeader: {
    minHeight: 57,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  faqQuestionArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  questionCircle: {
    width: 29,
    height: 29,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
    backgroundColor: COLORS.creamDark,
  },
  questionMark: {
    color: COLORS.saffron,
    fontSize: 14,
    fontWeight: '600',
  },
  faqQuestion: {
    flex: 1,
    color: COLORS.deepBrown,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
  },
  expandButton: {
    width: 27,
    height: 27,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.creamDark,
  },
  expandButtonActive: {
    backgroundColor: COLORS.richBrown,
  },
  answerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 13,
    paddingBottom: 13,
  },
  answerLine: {
    width: 3,
    borderRadius: 2,
    marginRight: 10,
    backgroundColor: COLORS.saffron,
  },
  answerText: {
    flex: 1,
    color: COLORS.warmBrown,
    fontSize: 12,
    lineHeight: 18,
  },
  // ==========================================================
  // SUPPORT CTA
  // ==========================================================

  supportCard: {
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 23,
    paddingHorizontal: 18,
    paddingVertical: 21,
    borderRadius: 24,
    backgroundColor: COLORS.cream,
    ...shadow.raised,
    borderColor: hairline,
    borderWidth: 1,
    shadowOpacity: 0.045,
    elevation: 2,
  },
  supportIconBox: {
    width: 56,
    height: 56,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 11,
    backgroundColor: COLORS.creamDark,
  },
  supportTitle: {
    color: COLORS.deepBrown,
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
  },
  supportDescription: {
    maxWidth: 290,
    color: COLORS.warmBrown,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  supportActions: {
    width: '100%',
  },
  primaryButton: {
    width: '100%',
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    marginBottom: 9,
    backgroundColor: COLORS.richBrown,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 7,
  },
  secondaryButton: {
    width: '100%',
    minHeight: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    backgroundColor: COLORS.creamDark,
    borderWidth: 1,
    borderColor: hairline,
  },
  secondaryButtonText: {
    color: COLORS.saffron,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 7,
  },
  // ==========================================================
  // FOOTER
  // ==========================================================

  footer: {
    alignItems: 'center',
    marginTop: 27,
  },
  footerLine: {
    width: 34,
    height: 1,
    marginBottom: 9,
    backgroundColor: hairline,
  },
  footerBrand: {
    color: COLORS.saffron,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
  },
  footerText: {
    color: COLORS.warmBrown,
    fontSize: 12,
    marginTop: 4,
  },
});
