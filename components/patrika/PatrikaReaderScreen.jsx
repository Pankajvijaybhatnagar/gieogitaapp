import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Pdf from 'react-native-pdf';
import Reanimated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppAlert } from '@/context/AppAlertContext';
import { useAuth } from '@/context/AuthContext';
import masikPatrikaServices from '@/lib/services/masikPatrikaServices';

import { COLORS } from '@/constants/brandColors';
import { gradients } from '@/constants/theme';

// Warm "paper" tone the pages sit on — bookish, not stark white.
const PAPER = '#F1E8D6';
const FLIP_DURATION = 420;

export default function PatrikaReaderScreen() {
  const router = useRouter();

  const params = useLocalSearchParams();

  const { access_token } = useAuth();
  const { error: showErrorAlert } = useAppAlert();

  // -----------------------------------------
  // GET SLUG / TITLE FROM [slug].jsx
  // -----------------------------------------

  const slug = useMemo(() => {
    const value = Array.isArray(params.slug) ? params.slug[0] : params.slug;

    return value ? String(value) : '';
  }, [params.slug]);

  const title = useMemo(() => {
    const value = Array.isArray(params.title) ? params.title[0] : params.title;

    return value ? String(value) : 'Monthly Patrika';
  }, [params.title]);

  // -----------------------------------------
  // STATE
  // -----------------------------------------

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const [fileUri, setFileUri] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  const [pdfReady, setPdfReady] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [sharing, setSharing] = useState(false);

  // Tap anywhere on a page to hide/show the reading chrome — same pattern
  // as Kindle/Apple Books, so the page itself gets the full screen.
  const [chromeVisible, setChromeVisible] = useState(true);
  const chromeAnim = useRef(new Animated.Value(1)).current;

  const localFilePath = useRef('');

  // -----------------------------------------
  // TWO-LAYER 3D PAGE FLIP
  // -----------------------------------------
  // Two full Pdf instances ("A" and "B") are stacked on top of each other.
  // Whichever one is on top shows the current page; the other is preloaded
  // with the adjacent page and sits underneath. Flipping animates the top
  // layer's rotateY 0 → ±90° (with backfaceVisibility: hidden so it vanishes
  // past 90°), revealing the already-waiting page below — then the two
  // layers swap roles for next time.

  const pdfRefA = useRef(null);
  const pdfRefB = useRef(null);
  const stageWidthRef = useRef(0);

  const [topLayer, setTopLayer] = useState('A');
  const [flipping, setFlipping] = useState(false);

  const rotateA = useSharedValue(0);
  const rotateB = useSharedValue(0);

  const layerRefs = useMemo(() => ({ A: pdfRefA, B: pdfRefB }), []);
  const layerRotate = useMemo(
    () => ({ A: rotateA, B: rotateB }),
    [rotateA, rotateB],
  );

  const finishFlip = useCallback(
    (settledKey, newPage) => {
      layerRotate[settledKey].value = 0;
      setTopLayer(prev => (prev === 'A' ? 'B' : 'A'));
      setCurrentPage(newPage);
      setFlipping(false);
    },
    [layerRotate],
  );

  const performFlip = useCallback(
    direction => {
      if (flipping || !pdfReady) return;

      const target = currentPage + direction;

      if (target < 1 || target > numberOfPages) return;

      const topKey = topLayer;
      const bottomKey = topKey === 'A' ? 'B' : 'A';

      setFlipping(true);

      // Preload the revealed layer with the destination page before the
      // top layer starts rotating away.
      layerRefs[bottomKey].current?.setPage(target);

      const toDeg = direction > 0 ? -90 : 90;

      layerRotate[topKey].value = withTiming(
        toDeg,
        { duration: FLIP_DURATION, easing: Easing.inOut(Easing.quad) },
        finished => {
          if (finished) {
            runOnJS(finishFlip)(topKey, target);
          }
        },
      );
    },
    [
      flipping,
      pdfReady,
      currentPage,
      numberOfPages,
      topLayer,
      layerRefs,
      layerRotate,
      finishFlip,
    ],
  );

  const handlePageTap = useCallback(
    x => {
      const width = stageWidthRef.current;

      if (!width) {
        setChromeVisible(v => !v);
        return;
      }

      if (x < width * 0.32) {
        performFlip(-1);
      } else if (x > width * 0.68) {
        performFlip(1);
      } else {
        setChromeVisible(v => !v);
      }
    },
    [performFlip],
  );

  const flipStyleA = useAnimatedStyle(
    () => ({
      transform: [{ perspective: 1400 }, { rotateY: `${rotateA.value}deg` }],
      zIndex: topLayer === 'A' ? 2 : 1,
    }),
    [topLayer],
  );

  const flipStyleB = useAnimatedStyle(
    () => ({
      transform: [{ perspective: 1400 }, { rotateY: `${rotateB.value}deg` }],
      zIndex: topLayer === 'B' ? 2 : 1,
    }),
    [topLayer],
  );

  const flipShadowStyleA = useAnimatedStyle(() => ({
    opacity: Math.min(Math.abs(rotateA.value) / 90, 1) * 0.35,
  }));

  const flipShadowStyleB = useAnimatedStyle(() => ({
    opacity: Math.min(Math.abs(rotateB.value) / 90, 1) * 0.35,
  }));

  useEffect(() => {
    Animated.timing(chromeAnim, {
      toValue: chromeVisible ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [chromeVisible, chromeAnim]);

  // -----------------------------------------
  // LOAD + DOWNLOAD PATRIKA PDF USING SLUG
  // -----------------------------------------

  const loadPatrika = useCallback(async () => {
    if (!slug) {
      setError('Patrika slug is missing.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setProgress(0);
      setPdfReady(false);
      setCurrentPage(1);
      setTopLayer('A');
      rotateA.value = 0;
      rotateB.value = 0;

      const response = await masikPatrikaServices.getPatrikaBySlug(
        slug,
        access_token || null,
        setProgress,
      );

      if (response?.success === false) {
        if (response?.code === 401) {
          throw new Error('Your session has expired. Please sign in again.');
        }

        throw new Error(
          response?.error ||
            response?.message ||
            'Unable to load this Patrika right now.',
        );
      }

      localFilePath.current = response?.data?.Path || '';

      setFileUri(response?.data?.fileUri || '');
      setIsPreview(!!response?.isPreview);
    } catch (err) {
      setError(err?.message || 'Unable to load Patrika.');
    } finally {
      setLoading(false);
    }
  }, [slug, access_token, rotateA, rotateB]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (mounted) {
        await loadPatrika();
      }
    })();

    return () => {
      mounted = false;

      // Cache files aren't auto-removed — clean up the downloaded PDF once
      // the reader is left.
      if (localFilePath.current) {
        FileSystem.deleteAsync(localFilePath.current, {
          idempotent: true,
        }).catch(() => {});
      }
    };
  }, [loadPatrika]);

  // -----------------------------------------
  // SHARE PDF
  // -----------------------------------------

  const handleShare = async () => {
    if (!fileUri || sharing) return;

    try {
      setSharing(true);

      const available = await Sharing.isAvailableAsync();

      if (!available) {
        showErrorAlert(
          'Sharing Unavailable',
          'Sharing is not available on this device.',
        );
        return;
      }

      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/pdf',
        dialogTitle: title,
        UTI: 'com.adobe.pdf',
      });
    } catch (err) {
      showErrorAlert(
        'Unable to Share',
        err?.message || 'Unable to share the Patrika PDF.',
      );
    } finally {
      setSharing(false);
    }
  };

  // -----------------------------------------
  // LOADING
  // -----------------------------------------

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.center}>
          <View style={styles.loadingIconWrap}>
            <Ionicons name="book" size={30} color="#FFFFFF" />
          </View>

          <Text style={styles.loadingTitle}>{title}</Text>
          <Text style={styles.loadingText}>Preparing your Patrika...</Text>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.round(progress * 100)}%` },
              ]}
            />
          </View>

          <Text style={styles.progressLabel}>
            {Math.round(progress * 100)}%
          </Text>
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
            <Ionicons
              name="alert-circle-outline"
              size={34}
              color={COLORS.dangerRed}
            />
          </View>

          <Text style={styles.errorTitle}>Unable to Load Patrika</Text>
          <Text style={styles.errorText}>{error}</Text>

          <View style={styles.errorActions}>
            <TouchableOpacity style={styles.retryButton} onPress={loadPatrika}>
              <Ionicons name="refresh" size={16} color="#FFFFFF" />
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={16} color={COLORS.deepBrown} />
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const readProgress = numberOfPages > 0 ? currentPage / numberOfPages : 0;

  // -----------------------------------------
  // MAIN — IN-APP BOOK-STYLE PDF READER
  // -----------------------------------------

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      {/* HEADER (fades away on tap so the page owns the screen) */}
      <Animated.View
        pointerEvents={chromeVisible ? 'auto' : 'none'}
        style={[
          styles.header,
          {
            opacity: chromeAnim,
            transform: [
              {
                translateY: chromeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-16, 0],
                }),
              },
            ],
          },
        ]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.deepBrown} />
        </TouchableOpacity>

        <View style={styles.headerTextWrap}>
          <Text style={styles.headerEyebrow}>मासिक पत्रिका</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.headerButton,
            (!fileUri || sharing) && styles.headerButtonDisabled,
          ]}
          onPress={handleShare}
          disabled={!fileUri || sharing}>
          {sharing ? (
            <ActivityIndicator size="small" color={COLORS.goldDark} />
          ) : (
            <Ionicons name="share-outline" size={19} color={COLORS.goldDark} />
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* PREVIEW BANNER */}
      {isPreview ? (
        <LinearGradient
          colors={gradients.gold}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.previewBanner}>
          <Ionicons name="eye-outline" size={15} color="#FFFFFF" />
          <Text style={styles.previewBannerText}>
            You&apos;re viewing a limited preview of this issue.
          </Text>
        </LinearGradient>
      ) : null}

      {/* BOOK */}
      <View
        style={styles.bookWrap}
        onLayout={e => {
          stageWidthRef.current = e.nativeEvent.layout.width;
        }}>
        <View style={styles.book}>
          {fileUri ? (
            ['A', 'B'].map(key => (
              <Reanimated.View
                key={key}
                pointerEvents={topLayer === key ? 'auto' : 'none'}
                style={[
                  StyleSheet.absoluteFill,
                  styles.flipLayer,
                  key === 'A' ? flipStyleA : flipStyleB,
                ]}>
                <Pdf
                  ref={key === 'A' ? pdfRefA : pdfRefB}
                  source={{ uri: fileUri, cache: true }}
                  style={styles.pdf}
                  fitPolicy={2}
                  page={key === 'A' ? 1 : 2}
                  horizontal={false}
                  enablePaging={false}
                  scrollEnabled={false}
                  enableDoubleTapZoom={false}
                  trustAllCerts={Platform.OS === 'android'}
                  onLoadComplete={pages => {
                    setNumberOfPages(prev => prev || pages);
                    setPdfReady(true);
                  }}
                  onPageSingleTap={(_page, x) => handlePageTap(x)}
                  onError={err => {
                    setError(
                      (err && err.message) ||
                        'This PDF could not be displayed.',
                    );
                  }}
                  renderActivityIndicator={() => (
                    <View style={styles.pdfLoading}>
                      <ActivityIndicator size="large" color={COLORS.goldDark} />
                    </View>
                  )}
                />

                {/* Darkens as the page rotates away, like light catching a
                    turning page's fold. */}
                <Reanimated.View
                  pointerEvents="none"
                  style={[
                    StyleSheet.absoluteFill,
                    styles.flipShadow,
                    key === 'A' ? flipShadowStyleA : flipShadowStyleB,
                  ]}
                />
              </Reanimated.View>
            ))
          ) : (
            <View style={styles.pdfLoading}>
              <Ionicons
                name="document-text-outline"
                size={40}
                color={COLORS.warmBrown}
              />
              <Text style={styles.loadingText}>PDF not available yet.</Text>
            </View>
          )}

          {/* Soft inner shadows along the spine edges — gives the flat page
              a bit of "open book" depth. */}
          <LinearGradient
            pointerEvents="none"
            colors={['rgba(41,35,40,0.16)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.spineShadow, styles.spineShadowLeft]}
          />
          <LinearGradient
            pointerEvents="none"
            colors={['rgba(41,35,40,0.16)', 'transparent']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={[styles.spineShadow, styles.spineShadowRight]}
          />
        </View>

        {/* BOOKMARK — always visible page/total tag */}
        {pdfReady && numberOfPages > 0 ? (
          <View style={styles.bookmark}>
            <Ionicons name="bookmark" size={13} color="#FFFFFF" />
            <Text style={styles.bookmarkText}>
              {currentPage} / {numberOfPages}
            </Text>
          </View>
        ) : null}

        {/* PREV / NEXT — fade with chrome */}
        {pdfReady && numberOfPages > 1 ? (
          <>
            <Animated.View
              pointerEvents={chromeVisible ? 'auto' : 'none'}
              style={[
                styles.navButtonWrap,
                styles.navButtonLeft,
                { opacity: chromeAnim },
              ]}>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  currentPage <= 1 && styles.navButtonDisabled,
                ]}
                onPress={() => performFlip(-1)}
                disabled={currentPage <= 1 || flipping}>
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={COLORS.deepBrown}
                />
              </TouchableOpacity>
            </Animated.View>

            <Animated.View
              pointerEvents={chromeVisible ? 'auto' : 'none'}
              style={[
                styles.navButtonWrap,
                styles.navButtonRight,
                { opacity: chromeAnim },
              ]}>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  currentPage >= numberOfPages && styles.navButtonDisabled,
                ]}
                onPress={() => performFlip(1)}
                disabled={currentPage >= numberOfPages || flipping}>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={COLORS.deepBrown}
                />
              </TouchableOpacity>
            </Animated.View>
          </>
        ) : null}
      </View>

      {/* READING PROGRESS RIBBON */}
      {pdfReady && numberOfPages > 0 ? (
        <View style={styles.progressRibbonTrack}>
          <View
            style={[
              styles.progressRibbonFill,
              { width: `${Math.max(readProgress * 100, 4)}%` },
            ]}
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.creamDark,
  },
  header: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  headerButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonDisabled: {
    opacity: 0.4,
  },
  headerTextWrap: {
    flex: 1,
    alignItems: 'center',
  },
  headerEyebrow: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: COLORS.warmBrown,
  },
  headerTitle: {
    marginTop: 1,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.deepBrown,
    maxWidth: '100%',
  },
  previewBanner: {
    marginHorizontal: 14,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewBannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bookWrap: {
    flex: 1,
    marginHorizontal: 10,
    marginBottom: 4,
  },
  book: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: PAPER,
    borderWidth: 1,
    borderColor: 'rgba(41,35,40,0.08)',
    shadowColor: '#292328',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 6,
  },
  pdf: {
    flex: 1,
    backgroundColor: PAPER,
  },
  flipLayer: {
    backgroundColor: PAPER,
    backfaceVisibility: 'hidden',
  },
  flipShadow: {
    backgroundColor: '#000000',
  },
  pdfLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  spineShadow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 16,
  },
  spineShadowLeft: {
    left: 0,
  },
  spineShadowRight: {
    right: 0,
  },
  bookmark: {
    position: 'absolute',
    top: -2,
    right: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: COLORS.richBrown,
    ...Platform.select({
      ios: {
        shadowColor: '#292328',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: { elevation: 4 },
    }),
  },
  bookmarkText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  navButtonWrap: {
    position: 'absolute',
    top: '50%',
    marginTop: -22,
  },
  navButtonLeft: {
    left: -6,
  },
  navButtonRight: {
    right: -6,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#292328',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 4,
  },
  navButtonDisabled: {
    opacity: 0.35,
  },
  progressRibbonTrack: {
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 10,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(41,35,40,0.08)',
    overflow: 'hidden',
  },
  progressRibbonFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: COLORS.saffron,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  loadingIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.richBrown,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loadingTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.deepBrown,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 6,
    fontSize: 13,
    color: COLORS.warmBrown,
    textAlign: 'center',
  },
  progressTrack: {
    marginTop: 20,
    width: '70%',
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.cream,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: COLORS.saffron,
  },
  progressLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.goldDark,
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
    fontWeight: '600',
    color: COLORS.deepBrown,
    textAlign: 'center',
  },
  errorText: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.warmBrown,
    textAlign: 'center',
  },
  errorActions: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 10,
  },
  retryButton: {
    minHeight: 46,
    paddingHorizontal: 20,
    borderRadius: 23,
    backgroundColor: COLORS.richBrown,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  backButton: {
    minHeight: 46,
    paddingHorizontal: 20,
    borderRadius: 23,
    backgroundColor: COLORS.cream,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  backButtonText: {
    color: COLORS.deepBrown,
    fontSize: 12,
    fontWeight: '600',
  },
});
