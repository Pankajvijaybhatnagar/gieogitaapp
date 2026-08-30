import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '@/context/AuthContext';
import masikPatrikaServices from '@/lib/services/masikPatrikaServices';

const COLORS = {
  deepBrown: '#2C1A0A',
  warmBrown: '#4A2C0D',
  gold: '#C9A227',
  goldLight: '#E8C55A',
  goldDark: '#8B6914',
  cream: '#FDF6E3',
};

export default function PatrikaReaderScreen() {
  const router = useRouter();

  const params = useLocalSearchParams();

  const { access_token } = useAuth();

  // -----------------------------------------
  // GET SLUG FROM [slug].jsx
  // -----------------------------------------

  const slug = useMemo(() => {
    const value = Array.isArray(params.slug) ? params.slug[0] : params.slug;

    return value ? String(value) : '';
  }, [params.slug]);

  // -----------------------------------------
  // TITLE
  // -----------------------------------------

  const title = useMemo(() => {
    const value = Array.isArray(params.title) ? params.title[0] : params.title;

    return value ? String(value) : 'Monthly Patrika';
  }, [params.title]);

  // -----------------------------------------
  // STATE
  // -----------------------------------------

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [patrika, setPatrika] = useState(null);
  const [openingPdf, setOpeningPdf] = useState(false);

  // -----------------------------------------
  // LOAD PATRIKA USING SLUG
  // -----------------------------------------

  useEffect(() => {
    let mounted = true;

    const loadPatrika = async () => {
      if (!slug) {
        setError('Patrika slug is missing.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        console.log('[Patrika Reader] Loading slug:', slug);

        const response = await masikPatrikaServices.getPatrikaBySlug(
          slug,
          access_token || null,
        );

        console.log('[Patrika Reader] Response:', response);

        if (!mounted) return;

        if (response?.success === false) {
          throw new Error(
            response?.error || response?.message || 'Unable to load Patrika.',
          );
        }

        const data = response?.data ?? response;

        setPatrika(data);
      } catch (err) {
        console.log('[Patrika Reader] Load error:', err);

        if (!mounted) return;

        setError(err?.message || 'Unable to load Patrika.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPatrika();

    return () => {
      mounted = false;
    };
  }, [slug, access_token]);

  // -----------------------------------------
  // FIND PDF URL
  // -----------------------------------------

  const pdfUrl = useMemo(() => {
    return (
      patrika?.pdf_url ||
      patrika?.pdfUrl ||
      patrika?.file_url ||
      patrika?.fileUrl ||
      patrika?.url ||
      ''
    );
  }, [patrika]);

  // -----------------------------------------
  // OPEN PDF
  // -----------------------------------------

  const handleOpenPdf = async () => {
    if (!pdfUrl) {
      Alert.alert(
        'PDF Not Available',
        'The PDF for this Patrika is not available yet.',
      );

      return;
    }

    try {
      setOpeningPdf(true);

      console.log('[Patrika Reader] Opening PDF:', pdfUrl);

      const supported = await Linking.canOpenURL(pdfUrl);

      if (!supported) {
        throw new Error('No application is available to open this PDF.');
      }

      await Linking.openURL(pdfUrl);
    } catch (err) {
      console.log('[Patrika Reader] PDF open error:', err);

      Alert.alert(
        'Unable to Open PDF',
        err?.message || 'Unable to open the Patrika PDF.',
      );
    } finally {
      setOpeningPdf(false);
    }
  };

  // -----------------------------------------
  // LOADING
  // -----------------------------------------

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.goldDark} />

          <Text style={styles.loadingText}>Loading Patrika...</Text>

          <Text style={styles.slugText}>{slug}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // -----------------------------------------
  // ERROR
  // -----------------------------------------

  if (error) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.center}>
          <View style={styles.errorIcon}>
            <Ionicons name="alert-circle-outline" size={34} color="#A64A3B" />
          </View>

          <Text style={styles.errorTitle}>Unable to Load Patrika</Text>

          <Text style={styles.errorText}>{error}</Text>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={17} color="#FFFFFF" />

            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // -----------------------------------------
  // MAIN
  // -----------------------------------------

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBack}
            onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={COLORS.deepBrown} />
          </TouchableOpacity>

          <Text style={styles.headerTitle} numberOfLines={1}>
            Patrika
          </Text>

          <View style={{ width: 40 }} />
        </View>

        {/* COVER / PREVIEW */}

        <View style={styles.previewCard}>
          <View style={styles.pdfIcon}>
            <Ionicons name="document-text" size={52} color={COLORS.goldLight} />
          </View>

          <Text style={styles.previewLabel}>GIEO GITA</Text>

          <Text style={styles.previewTitle}>{patrika?.title || title}</Text>

          <Text style={styles.previewSubtitle}>मासिक पत्रिका</Text>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="link-outline" size={16} color={COLORS.goldLight} />

            <Text style={styles.infoText} numberOfLines={1}>
              {slug}
            </Text>
          </View>
        </View>

        {/* DESCRIPTION */}

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="book-outline" size={20} color={COLORS.goldDark} />

            <Text style={styles.infoTitle}>{patrika?.title || title}</Text>
          </View>

          {patrika?.description ? (
            <Text style={styles.description}>{patrika.description}</Text>
          ) : (
            <Text style={styles.description}>
              Read this monthly Patrika from your GIEO Gita account.
            </Text>
          )}
        </View>

        {/* PDF STATUS */}

        <View style={styles.pdfStatus}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: pdfUrl ? '#4D8A55' : '#A64A3B',
              },
            ]}
          />

          <Text style={styles.statusText}>
            {pdfUrl ? 'PDF available' : 'PDF not available'}
          </Text>
        </View>

        {/* PREVIEW BUTTON */}

        <TouchableOpacity
          style={[styles.previewButton, !pdfUrl && styles.disabledButton]}
          activeOpacity={0.85}
          onPress={handleOpenPdf}
          disabled={!pdfUrl || openingPdf}>
          {openingPdf ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="eye-outline" size={21} color="#FFFFFF" />
          )}

          <Text style={styles.previewButtonText}>
            {openingPdf ? 'Opening PDF...' : 'Preview PDF'}
          </Text>

          {!openingPdf && pdfUrl ? (
            <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
          ) : null}
        </TouchableOpacity>

        {/* NOTE */}

        <View style={styles.note}>
          <Ionicons
            name="information-circle-outline"
            size={17}
            color={COLORS.goldDark}
          />

          <Text style={styles.noteText}>
            The PDF will open using the PDF viewer or browser available on your
            Android device.
          </Text>
        </View>

        {/* DEBUG INFO */}

        <View style={styles.debugCard}>
          <Text style={styles.debugTitle}>Patrika Details</Text>

          <Text style={styles.debugText}>Slug: {slug}</Text>

          <Text style={styles.debugText}>
            PDF: {pdfUrl ? 'Available' : 'Missing'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFF9F3',
  },

  content: {
    padding: 14,
    paddingBottom: 40,
  },

  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  headerBack: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E7DA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    flex: 1,
    marginHorizontal: 12,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.deepBrown,
  },

  previewCard: {
    minHeight: 300,
    borderRadius: 24,
    backgroundColor: COLORS.deepBrown,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },

  pdfIcon: {
    width: 100,
    height: 120,
    borderRadius: 16,
    backgroundColor: COLORS.warmBrown,
    borderWidth: 1,
    borderColor: 'rgba(232,197,90,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  previewLabel: {
    fontSize: 8,
    letterSpacing: 2,
    fontWeight: '800',
    color: COLORS.goldLight,
  },

  previewTitle: {
    marginTop: 7,
    fontSize: 21,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  previewSubtitle: {
    marginTop: 4,
    fontSize: 11,
    color: '#EBDCCB',
  },

  divider: {
    width: 80,
    height: 1,
    backgroundColor: COLORS.gold,
    marginVertical: 17,
  },

  infoRow: {
    maxWidth: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  infoText: {
    flex: 1,
    fontSize: 9,
    color: '#DCCBB8',
    textAlign: 'center',
  },

  infoCard: {
    marginTop: 15,
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDE1D4',
  },

  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  infoTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.deepBrown,
  },

  description: {
    marginTop: 10,
    fontSize: 10.5,
    lineHeight: 17,
    color: '#806B59',
  },

  pdfStatus: {
    marginTop: 13,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  statusText: {
    fontSize: 10,
    color: '#806B59',
    fontWeight: '700',
  },

  previewButton: {
    marginTop: 13,
    minHeight: 54,
    borderRadius: 27,
    backgroundColor: COLORS.warmBrown,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  previewButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  disabledButton: {
    opacity: 0.45,
  },

  note: {
    marginTop: 13,
    padding: 12,
    borderRadius: 13,
    backgroundColor: COLORS.cream,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
  },

  noteText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 15,
    color: '#806B59',
  },

  debugCard: {
    marginTop: 14,
    padding: 13,
    borderRadius: 13,
    backgroundColor: '#F4EDE5',
  },

  debugTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.deepBrown,
    marginBottom: 5,
  },

  debugText: {
    fontSize: 9,
    color: '#806B59',
    marginTop: 2,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },

  loadingText: {
    marginTop: 14,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.deepBrown,
  },

  slugText: {
    marginTop: 5,
    fontSize: 9,
    color: '#9B8877',
  },

  errorIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FBEDEA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorTitle: {
    marginTop: 14,
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.deepBrown,
    textAlign: 'center',
  },

  errorText: {
    marginTop: 8,
    fontSize: 11,
    lineHeight: 17,
    color: '#806B59',
    textAlign: 'center',
  },

  backButton: {
    marginTop: 18,
    minHeight: 46,
    paddingHorizontal: 20,
    borderRadius: 23,
    backgroundColor: COLORS.warmBrown,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  backButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
