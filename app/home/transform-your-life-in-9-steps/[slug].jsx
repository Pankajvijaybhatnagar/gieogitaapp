import { DESIGN } from '@/constants/design';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { transformInNineStepsData } from '@/components/dhyanShivir/TransformInNineStepsData';
import Spacer from '@/components/ui/Spacer';
import { COLORS } from '@/constants/brandColors';
import { hairline, radii, shadow, spacing, type } from '@/constants/theme';

export default function ProgrammeDetails() {
  const { slug } = useLocalSearchParams();

  const [programme, setProgramme] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProgramme = async () => {
    try {
      setLoading(true);

      /*
      LATER BACKEND API:

      const response =
        await programmeServices.getProgrammeBySlug(slug);

      const data = response?.data?.data;

      if (
        response?.success &&
        response?.data?.status &&
        data
      ) {
        setProgramme(data);
      } else {
        setProgramme(null);
      }
      */

      const foundProgramme = transformInNineStepsData.find(
        item => item.slug === slug,
      );

      setProgramme(foundProgramme || null);
    } catch (error) {
      console.error('Error fetching programme:', error);

      setProgramme(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchProgramme();
    }
  }, [slug]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="small" color={COLORS.saffron} />

        <Text style={styles.loaderText}>Loading programme...</Text>
      </View>
    );
  }

  if (!programme) {
    return (
      <View style={styles.loader}>
        <Text style={styles.notFound}>Programme not found.</Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <Image
            source={{
              uri: programme.image,
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          <View style={styles.heroOverlay} />

          <TouchableOpacity
            style={styles.backIcon}
            activeOpacity={0.8}
            onPress={() => router.back()}>
            <Text style={styles.backIconText}>‹</Text>
          </TouchableOpacity>

          <View style={styles.stepBadge}>
            <Text style={styles.stepText}>{programme.step}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.eyebrow}>TRANSFORM IN NINE STEPS</Text>

          <Text style={styles.title}>{programme.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaBadge}>
              <Text style={styles.metaText}>🕉 {programme.duration}</Text>
            </View>

            <View style={styles.metaBadge}>
              <Text style={styles.metaText}>Guided by Gita Manishi</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>About this programme</Text>

          <Text style={styles.description}>{programme.description}</Text>

          <Text style={styles.description}>
            This programme is designed to help you understand the wisdom of the
            Bhagavad Gita in a simple and practical way. Each step focuses on
            inner growth, clarity, discipline, peace and spiritual
            transformation.
          </Text>

          <View style={styles.quoteBox}>
            <Text style={styles.quoteIcon}>ॐ</Text>

            <Text style={styles.quoteText}>
              A journey of transformation begins with one conscious step.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>What you will learn</Text>

          <View style={styles.learnBox}>
            <Text style={styles.learnItem}>✦ Understand yourself deeply</Text>

            <Text style={styles.learnItem}>
              ✦ Develop control over the mind
            </Text>

            <Text style={styles.learnItem}>
              ✦ Apply Gita wisdom in daily life
            </Text>

            <Text style={styles.learnItem}>
              ✦ Build clarity and inner strength
            </Text>

            <Text style={styles.learnItem}>✦ Experience peace and purpose</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.enrollButton}
            onPress={() => {
              console.log('Start programme:', programme.id);
            }}>
            <Text style={styles.enrollButtonText}>Start This Programme</Text>

            <Text style={styles.enrollArrow}>→</Text>
          </TouchableOpacity>
          <Spacer height={120} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scrollContent: {
    paddingBottom: 45,
  },
  loader: {
    flex: 1,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  loaderText: {
    color: COLORS.warmBrown,
    fontSize: 12,
    marginTop: 10,
  },
  notFound: {
    color: COLORS.deepBrown,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 18,
  },
  backButton: {
    backgroundColor: COLORS.richBrown,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radii.pill,
  },
  backButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  hero: {
    height: 340,
    position: 'relative',
    backgroundColor: COLORS.creamDark,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(41,35,40,0.18)',
  },
  backIcon: {
    position: 'absolute',
    top: 52,
    left: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  backIconText: {
    color: COLORS.deepBrown,
    fontSize: 31,
    lineHeight: 31,
    marginTop: -3,
  },
  stepBadge: {
    position: 'absolute',
    bottom: 18,
    left: 20,
    backgroundColor: COLORS.cream,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radii.pill,
    ...shadow.card,
  },
  stepText: {
    color: COLORS.saffron,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.3,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  eyebrow: {
    color: COLORS.saffron,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.6,
    marginBottom: 7,
  },
  title: {
    ...type.largeTitle,
    fontSize: 29,
    lineHeight: 35,
    color: COLORS.deepBrown,
    fontFamily: DESIGN.fonts.editorial,
    fontWeight: '400',
    letterSpacing: -0.4,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 15,
  },
  metaBadge: {
    backgroundColor: COLORS.creamDark,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: radii.pill,
  },
  metaText: {
    color: COLORS.warmBrown,
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: hairline,
    marginVertical: spacing.lg,
  },
  sectionTitle: {
    ...type.headline,
    color: COLORS.deepBrown,
    marginBottom: spacing.sm,
  },
  description: {
    ...type.body,
    color: COLORS.warmBrown,
    marginBottom: spacing.sm,
  },
  quoteBox: {
    backgroundColor: COLORS.creamDark,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginVertical: spacing.sm,
    alignItems: 'center',
  },
  quoteIcon: {
    color: COLORS.saffron,
    fontSize: 23,
    marginBottom: spacing.sm,
  },
  quoteText: {
    color: COLORS.deepBrown,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
  },
  learnBox: {
    backgroundColor: COLORS.creamDark,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: 11,
  },
  learnItem: {
    color: COLORS.warmBrown,
    fontSize: 12,
    lineHeight: 18,
  },
  enrollButton: {
    marginTop: spacing.lg,
    backgroundColor: COLORS.richBrown,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  enrollButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '900',
  },
  enrollArrow: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '600',
  },
});
