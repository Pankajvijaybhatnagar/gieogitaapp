// app/home/gallery.jsx
//
// Full gallery page — a grid of every photo from galleryServices.getPublicGallery(),
// with a tap-to-open, swipe-between full-screen viewer.

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { galleryPhotos } from '@/components/home/constant';
import Spacer from '@/components/ui/Spacer';
import { COLORS, RGB } from '@/constants/brandColors';
import { radii, shadow, spacing, type } from '@/constants/theme';
import galleryServices from '@/lib/services/galleryServices';

const GALLERY_FOLDER = 'gallery';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const GRID_GAP = 4;
const GRID_COLUMNS = 3;
const TILE_SIZE = (SCREEN_WIDTH - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

function normalizeImages(raw) {
  const list = Array.isArray(raw) ? raw : [];

  return list
    .map((item, index) => {
      if (typeof item === 'string') {
        return { id: String(index), uri: item, caption: '' };
      }

      const uri =
        item?.image || item?.url || item?.file || item?.path || item?.src || '';

      return {
        id: String(item?.id ?? index),
        uri,
        caption: item?.title || item?.caption || item?.name || '',
      };
    })
    .filter(image => !!image.uri);
}

function Hero({ count }) {
  return (
    <View style={styles.hero}>
      <View style={styles.heroBanner}>
        <View style={styles.heroPatternOne} />
        <View style={styles.heroPatternTwo} />
        <Ionicons name="images" size={72} color="rgba(255,255,255,0.14)" />
      </View>

      <View style={styles.heroIconRing}>
        <View style={styles.heroIcon}>
          <Ionicons name="camera" size={28} color={COLORS.saffron} />
        </View>
      </View>

      <Text style={styles.heroTitle}>Photo Gallery</Text>
      <View style={styles.heroDivider} />
      <Text style={styles.heroSubtitle}>
        {count} moments from satsangs, seva &amp; celebrations
      </Text>
    </View>
  );
}

export default function GalleryScreen() {
  const params = useLocalSearchParams();

  // Real photos already live on gieogita.org, shown immediately and
  // replaced automatically once the backend's own gallery has content.
  const [images, setImages] = useState(galleryPhotos);
  const [loading, setLoading] = useState(true);
  const [viewerIndex, setViewerIndex] = useState(null);

  const viewerListRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);

        const response = await galleryServices.getPublicGallery(GALLERY_FOLDER);

        const raw =
          response?.data?.data ||
          response?.data?.images ||
          response?.data ||
          [];

        const fetched = response?.success ? normalizeImages(raw) : [];

        if (!cancelled) {
          const list = fetched.length > 0 ? fetched : galleryPhotos;

          setImages(list);

          const requestedIndex = Number(params?.index);

          if (!Number.isNaN(requestedIndex) && list[requestedIndex]) {
            setViewerIndex(requestedIndex);
          }
        }
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const closeViewer = useCallback(() => setViewerIndex(null), []);

  const viewerInitialIndex = useMemo(
    () => (viewerIndex != null ? viewerIndex : 0),
    [viewerIndex],
  );

  return (
    <View style={styles.root}>
      <FlatList
        data={images}
        keyExtractor={item => item.id}
        numColumns={GRID_COLUMNS}
        ListHeaderComponent={<Hero count={images.length} />}
        ListEmptyComponent={
          loading ? (
            <View style={styles.stateBox}>
              <ActivityIndicator size="small" color={COLORS.richBrown} />
              <Text style={styles.stateText}>Loading gallery...</Text>
            </View>
          ) : (
            <View style={styles.stateBox}>
              <Ionicons
                name="images-outline"
                size={32}
                color={COLORS.warmBrown}
              />
              <Text style={styles.stateText}>No photos available yet.</Text>
            </View>
          )
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<Spacer height={120} />}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.tile}
            onPress={() => setViewerIndex(index)}>
            <Image
              source={{ uri: item.uri }}
              style={styles.tileImage}
              contentFit="cover"
              transition={200}
            />
          </TouchableOpacity>
        )}
      />

      <Modal
        visible={viewerIndex != null}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeViewer}>
        <View style={styles.viewerRoot}>
          <FlatList
            ref={viewerListRef}
            data={images}
            keyExtractor={item => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={viewerInitialIndex}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            onMomentumScrollEnd={event => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / SCREEN_WIDTH,
              );
              setViewerIndex(index);
            }}
            renderItem={({ item }) => (
              <View style={styles.viewerSlide}>
                <Image
                  source={{ uri: item.uri }}
                  style={styles.viewerImage}
                  contentFit="contain"
                  transition={150}
                />

                {!!item.caption && (
                  <Text style={styles.viewerCaption}>{item.caption}</Text>
                )}
              </View>
            )}
          />

          <Pressable
            style={styles.viewerClose}
            onPress={closeViewer}
            hitSlop={12}>
            <Ionicons name="close" size={22} color={COLORS.white} />
          </Pressable>

          {images.length > 0 && (
            <View style={styles.viewerCounter}>
              <Text style={styles.viewerCounterText}>
                {(viewerIndex ?? 0) + 1} / {images.length}
              </Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },

  /* HERO — same banner + overlapping badge pattern used across the app */
  hero: {
    alignItems: 'center',
    paddingBottom: spacing.lg,
    marginBottom: spacing.sm,
  },
  heroBanner: {
    width: '100%',
    height: 128,
    backgroundColor: COLORS.richBrown,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPatternOne: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    top: -65,
    left: -50,
  },
  heroPatternTwo: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    right: -80,
    top: -90,
  },
  heroIconRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -44,
    ...shadow.raised,
    shadowColor: COLORS.richBrown,
  },
  heroIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: `rgba(${RGB.maroon},0.1)`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.cream,
  },
  heroTitle: {
    marginTop: spacing.sm,
    ...type.title,
    fontSize: 23,
    color: COLORS.deepBrown,
    textAlign: 'center',
  },
  heroDivider: {
    width: 40,
    height: 3,
    borderRadius: radii.pill,
    backgroundColor: COLORS.gold,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    ...type.subhead,
    color: COLORS.warmBrown,
    marginTop: 2,
    paddingHorizontal: spacing.xl,
    textAlign: 'center',
  },

  /* GRID */
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    marginRight: GRID_GAP,
    marginBottom: GRID_GAP,
    backgroundColor: COLORS.creamDark,
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },

  stateBox: {
    paddingVertical: spacing.xl * 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    width: '100%',
  },
  stateText: {
    ...type.subhead,
    color: COLORS.warmBrown,
  },

  /* FULL-SCREEN VIEWER */
  viewerRoot: {
    flex: 1,
    backgroundColor: '#000',
  },
  viewerSlide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.75,
  },
  viewerCaption: {
    ...type.body,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  viewerClose: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerCounter: {
    position: 'absolute',
    top: spacing.xl + 4,
    left: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
  },
  viewerCounterText: {
    ...type.caption,
    color: COLORS.white,
    fontSize: 11,
  },
});
