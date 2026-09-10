// Shared layout for standalone legal pages (Privacy Policy, Terms &
// Conditions) — these live at the app root (outside the home Drawer), so
// they need their own header/footer instead of inheriting the Drawer's.

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter, usePathname } from 'expo-router';
import {
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Card from '@/components/ui/Card';
import { COLORS, RGB } from '@/constants/brandColors';
import { hairline, radii, shadow, spacing, type } from '@/constants/theme';

function Section({ number, title, body, list }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberBadgeText}>{number}</Text>
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      {!!body && <Text style={styles.sectionBody}>{body}</Text>}

      {!!list && (
        <View style={styles.list}>
          {list.map((item, index) => (
            <View key={index} style={styles.listRow}>
              <View style={styles.listDot} />
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const QUICK_LINKS = [
  { label: 'Home', route: '/home/(tabs)' },
  { label: 'Privacy Policy', route: '/privacy-policy' },
  { label: 'Terms & Conditions', route: '/terms' },
  { label: 'Help', route: '/home/help' },
];

export default function LegalPageLayout({ icon, title, tagline, intro, sections }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />

      {/* ─────────────────────────── HEADER ─────────────────────────── */}
      <SafeAreaView edges={['top']} style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={COLORS.deepBrown} />
        </TouchableOpacity>

        <View style={styles.topBarBrand}>
          <Image
            source={require('@/assets/images/logos/logo.png')}
            style={styles.topBarLogo}
            contentFit="contain"
          />
          <Text style={styles.topBarTitle} numberOfLines={1}>
            {title}
          </Text>
        </View>

        <View style={styles.backButton} />
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name={icon} size={26} color={COLORS.white} />
          </View>

          <Text style={styles.heroTitle}>{title}</Text>
          <Text style={styles.heroTagline}>{tagline}</Text>
        </View>

        <Card radius={radii.xl} style={styles.introCard}>
          <Text style={styles.introText}>{intro}</Text>
        </Card>

        {sections.map((section, index) => (
          <Section
            key={section.title}
            number={index + 1}
            title={section.title}
            body={section.body}
            list={section.list}
          />
        ))}

        {/* ─────────────────────────── FOOTER ─────────────────────────── */}
        <View style={styles.footer}>
          <View style={styles.footerPatternOne} />
          <View style={styles.footerPatternTwo} />

          <Image
            source={require('@/assets/images/logos/logo.png')}
            style={styles.footerLogo}
            contentFit="contain"
          />
          <Text style={styles.footerOrg}>GIEO GITA</Text>
          <Text style={styles.footerTagline}>
            Dedicated to spreading the wisdom of the Bhagwad Gita through
            education, seva &amp; spiritual upliftment.
          </Text>

          <View style={styles.footerDivider} />

          <View style={styles.footerLinksRow}>
            {QUICK_LINKS.map((link, index) => {
              const isCurrent = pathname === link.route;

              return (
                <TouchableOpacity
                  key={link.label}
                  disabled={isCurrent}
                  onPress={() => router.push(link.route)}
                  style={styles.footerLinkChip}>
                  <Text
                    style={[
                      styles.footerLinkText,
                      isCurrent && styles.footerLinkTextActive,
                    ]}>
                    {link.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.footerDivider} />

          <TouchableOpacity
            style={styles.footerContactRow}
            onPress={() => Linking.openURL('mailto:info@gieogita.org')}>
            <Ionicons name="mail-outline" size={14} color={COLORS.gold} />
            <Text style={styles.footerContactText}>info@gieogita.org</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerContactRow}
            onPress={() => Linking.openURL('tel:9996551615')}>
            <Ionicons name="call-outline" size={14} color={COLORS.gold} />
            <Text style={styles.footerContactText}>+91 99965 51615</Text>
          </TouchableOpacity>

          <View style={styles.footerContactRow}>
            <Ionicons name="location-outline" size={14} color={COLORS.gold} />
            <Text style={styles.footerContactText}>
              Gita Gyan Sansthanam, KDB Road, Kurukshetra, Haryana, India
            </Text>
          </View>

          <View style={styles.footerDivider} />

          <Text style={styles.footerCopyright}>
            © 2026 GIEO Gita — Global Inspiration &amp; Enlightenment
            Organization of Bhagavad Gita. All Rights Reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  /* HEADER */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    backgroundColor: COLORS.cream,
    borderBottomWidth: 1,
    borderBottomColor: hairline,
    ...shadow.card,
    shadowOpacity: 0.04,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarBrand: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  topBarLogo: {
    width: 22,
    height: 22,
  },
  topBarTitle: {
    ...type.headline,
    fontSize: 15.5,
    color: COLORS.deepBrown,
    flexShrink: 1,
  },

  scrollContent: {
    paddingBottom: spacing.xl,
  },

  hero: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.richBrown,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
    shadowColor: COLORS.richBrown,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    ...type.title,
    fontSize: 22,
    color: COLORS.deepBrown,
    textAlign: 'center',
  },
  heroTagline: {
    ...type.subhead,
    color: COLORS.warmBrown,
    marginTop: 4,
    textAlign: 'center',
  },

  introCard: {
    marginHorizontal: spacing.md,
    padding: spacing.md + 2,
    marginBottom: spacing.md,
  },
  introText: {
    ...type.body,
    fontSize: 13.5,
    lineHeight: 21,
    color: COLORS.deepBrown,
  },

  section: {
    paddingHorizontal: spacing.md + 2,
    marginBottom: spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs + 2,
  },
  numberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `rgba(${RGB.gold}, 0.16)`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberBadgeText: {
    ...type.caption,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.goldDark,
  },
  sectionTitle: {
    ...type.headline,
    fontSize: 14.5,
    color: COLORS.deepBrown,
    flex: 1,
  },
  sectionBody: {
    ...type.body,
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.warmBrown,
    paddingLeft: 32,
  },
  list: {
    paddingLeft: 32,
    marginTop: spacing.xs + 2,
    gap: 6,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs + 2,
  },
  listDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.saffron,
    marginTop: 7,
  },
  listText: {
    ...type.body,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.warmBrown,
    flex: 1,
  },

  /* FOOTER */
  footer: {
    marginTop: spacing.lg,
    backgroundColor: COLORS.richBrown,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  footerPatternOne: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    top: -80,
    left: -60,
  },
  footerPatternTwo: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    bottom: -50,
    right: -40,
  },
  footerLogo: {
    width: 40,
    height: 40,
    marginBottom: spacing.xs,
  },
  footerOrg: {
    ...type.headline,
    fontSize: 16,
    color: COLORS.white,
    letterSpacing: 1,
  },
  footerTagline: {
    ...type.footnote,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 17,
    maxWidth: 260,
  },
  footerDivider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.14)',
    marginVertical: spacing.md,
  },
  footerLinksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  footerLinkChip: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
  },
  footerLinkText: {
    ...type.footnote,
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  footerLinkTextActive: {
    color: COLORS.gold,
    fontWeight: '700',
  },
  footerContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.xs + 2,
    paddingHorizontal: spacing.lg,
  },
  footerContactText: {
    ...type.footnote,
    fontSize: 11.5,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  footerCopyright: {
    ...type.caption,
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    lineHeight: 15,
    marginTop: spacing.xs,
  },
});
