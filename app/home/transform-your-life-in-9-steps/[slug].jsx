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
        <ActivityIndicator size="small" color="#D8A746" />

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
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#24120D',
  },

  scrollContent: {
    paddingBottom: 45,
  },

  loader: {
    flex: 1,
    backgroundColor: '#24120D',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

  loaderText: {
    color: '#D8A746',
    fontSize: 12,
    marginTop: 10,
  },

  notFound: {
    color: '#FFF3DB',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 18,
  },

  backButton: {
    backgroundColor: '#D8A746',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },

  backButtonText: {
    color: '#321A11',
    fontWeight: '800',
  },

  hero: {
    height: 340,
    position: 'relative',
    backgroundColor: '#301A13',
  },

  heroImage: {
    width: '100%',
    height: '100%',
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(36,18,13,0.25)',
  },

  backIcon: {
    position: 'absolute',
    top: 52,
    left: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(36,18,13,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(216,167,70,0.4)',
  },

  backIconText: {
    color: '#FFF3DB',
    fontSize: 31,
    lineHeight: 31,
    marginTop: -3,
  },

  stepBadge: {
    position: 'absolute',
    bottom: 18,
    left: 20,
    backgroundColor: 'rgba(36,18,13,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(216,167,70,0.55)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },

  stepText: {
    color: '#F3CA70',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.3,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  eyebrow: {
    color: '#D8A746',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.6,
    marginBottom: 7,
  },

  title: {
    color: '#FFF3DB',
    fontSize: 29,
    lineHeight: 35,
    fontWeight: '800',
  },

  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 15,
  },

  metaBadge: {
    backgroundColor: '#3A2118',
    borderWidth: 1,
    borderColor: 'rgba(216,167,70,0.24)',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 18,
  },

  metaText: {
    color: '#EACB8D',
    fontSize: 10,
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(216,167,70,0.16)',
    marginVertical: 24,
  },

  sectionTitle: {
    color: '#FFF0D1',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 10,
  },

  description: {
    color: 'rgba(255,243,219,0.65)',
    fontSize: 12,
    lineHeight: 20,
    marginBottom: 14,
  },

  quoteBox: {
    backgroundColor: '#321B13',
    borderWidth: 1,
    borderColor: 'rgba(216,167,70,0.2)',
    borderRadius: 16,
    padding: 18,
    marginVertical: 10,
    alignItems: 'center',
  },

  quoteIcon: {
    color: '#D8A746',
    fontSize: 23,
    marginBottom: 8,
  },

  quoteText: {
    color: '#E9D5AE',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  learnBox: {
    backgroundColor: '#321B13',
    borderRadius: 16,
    padding: 16,
    gap: 11,
    borderWidth: 1,
    borderColor: 'rgba(216,167,70,0.16)',
  },

  learnItem: {
    color: '#E8D5B1',
    fontSize: 12,
    lineHeight: 18,
  },

  enrollButton: {
    marginTop: 26,
    backgroundColor: '#D8A746',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  enrollButtonText: {
    color: '#321A11',
    fontSize: 13,
    fontWeight: '900',
  },

  enrollArrow: {
    color: '#321A11',
    fontSize: 22,
    fontWeight: '800',
  },
});
