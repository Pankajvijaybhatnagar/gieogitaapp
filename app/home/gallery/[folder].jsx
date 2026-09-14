// app/home/gallery/[folder].jsx
//
// One album's photos — a Pinterest-style masonry grid, sized from the
// width/height the backend already sends per file so tiles match each
// photo's real aspect ratio instead of cropping it into a square. Paginated,
// with a tap-to-open, swipe-between full-screen viewer.

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Spacer from '@/components/ui/Spacer';
import { COLORS } from '@/constants/brandColors';
import { hairline, radii, spacing, type } from '@/constants/theme';
import galleryServices from '@/lib/services/galleryServices';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PAGE_LIMIT = 30;

const COLUMN_COUNT = 2;
const COLUMN_GAP = 10;
const GRID_PADDING = spacing.sm + 2;
const COLUMN_WIDTH =
  (SCREEN_WIDTH - GRID_PADDING * 2 - COLUMN_GAP * (COLUMN_COUNT - 1)) /
  COLUMN_COUNT;

// How close to the bottom (px) before the next page is requested.
const LOAD_MORE_THRESHOLD = 500;

function formatAlbumName(name) {
  return String(name || '')
    .replace(/[_-]+/g, ' ')
    .trim();
}

function normalizeFiles(raw) {
  const list = Array.isArray(raw) ? raw : [];

  return list
    .map((item, index) => ({
      id: `${item?.filename || index}-${index}`,
      uri: item?.url || '',
      caption: item?.filename || '',
      width: Number(item?.width) || 1,
      height: Number(item?.height) || 1,
    }))
    .filter(image => !!image.uri);
}

export default function GalleryFolderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const folder = Array.isArray(params.folder) ? params.folder[0] : params.folder;
  const decodedFolder = folder ? decodeURIComponent(folder) : '';

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [viewerIndex, setViewerIndex] = useState(null);

  const viewerListRef = useRef(null);

  const fetchImages = useCallback(
    async (targetPage, replace) => {
      if (!decodedFolder) {
        setLoading(false);
        return;
      }

      if (replace) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const response = await galleryServices.getGalleryFolderImages(
          decodedFolder,
          targetPage,
          PAGE_LIMIT,
        );

        const fetched = response?.status
          ? normalizeFiles(response?.data?.files)
          : [];

        setImages(prev => (replace ? fetched : [...prev, ...fetched]));
        setTotalPages(response?.data?.pagination?.total_pages || 1);
        setTotalItems(response?.data?.pagination?.total_items || 0);
        setPage(targetPage);
      } catch (error) {
        console.error('Error fetching gallery folder images:', error);

        if (replace) {
          setImages([]);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [decodedFolder],
  );

  useEffect(() => {
    fetchImages(1, true);
  }, [fetchImages]);

  const handleLoadMore = useCallback(() => {
    if (loading || loadingMore || page >= totalPages) {
      return;
    }

    fetchImages(page + 1, false);
  }, [loading, loadingMore, page, totalPages, fetchImages]);

  const handleScroll = ({ nativeEvent }) => {
    const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;

    const distanceFromBottom =
      contentSize.height - contentOffset.y - layoutMeasurement.height;

    if (distanceFromBottom < LOAD_MORE_THRESHOLD) {
      handleLoadMore();
    }
  };

  // ===========================================================
  // MASONRY LAYOUT
  // ===========================================================
  // Each photo keeps its true aspect ratio (from the backend's width/height),
  // so tiles are never cropped into a square. Items are greedily placed into
  // whichever column is currently shortest, Pinterest-style.

  const columns = useMemo(() => {
    const cols = Array.from({ length: COLUMN_COUNT }, () => ({
      items: [],
      height: 0,
    }));

    images.forEach((item, index) => {
      const ratio = item.width / item.height || 1;
      const tileHeight = COLUMN_WIDTH / ratio;

      let shortest = 0;

      for (let i = 1; i < cols.length; i++) {
        if (cols[i].height < cols[shortest].height) {
          shortest = i;
        }
      }

      cols[shortest].items.push({ ...item, index, ratio });
      cols[shortest].height += tileHeight + COLUMN_GAP;
    });

    return cols.map(col => col.items);
  }, [images]);

  const closeViewer = useCallback(() => setViewerIndex(null), []);

  const viewerInitialIndex = useMemo(
    () => (viewerIndex != null ? viewerIndex : 0),
    [viewerIndex],
  );

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={200}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => router.back()}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>

          <View style={styles.headerTextArea}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {formatAlbumName(decodedFolder)}
            </Text>
            <Text style={styles.headerSubtitle}>
              {totalItems} photo{totalItems === 1 ? '' : 's'}
            </Text>
          </View>
        </View>

        {images.length === 0 ? (
          loading ? (
            <View style={styles.stateBox}>
              <ActivityIndicator size="small" color={COLORS.richBrown} />
              <Text style={styles.stateText}>Loading photos...</Text>
            </View>
          ) : (
            <View style={styles.stateBox}>
              <Ionicons
                name="images-outline"
                size={32}
                color={COLORS.warmBrown}
              />
              <Text style={styles.stateText}>No photos in this album yet.</Text>
            </View>
          )
        ) : (
          <View style={styles.masonryRow}>
            {columns.map((column, columnIndex) => (
              <View key={columnIndex} style={styles.masonryColumn}>
                {column.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.85}
                    style={[styles.tile, { aspectRatio: item.ratio }]}
                    onPress={() => setViewerIndex(item.index)}>
                    <Image
                      source={{ uri: item.uri }}
                      style={styles.tileImage}
                      contentFit="cover"
                      transition={200}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        )}

        {loadingMore && (
          <ActivityIndicator
            size="small"
            color={COLORS.richBrown}
            style={styles.footerLoader}
          />
        )}

        {!loading && !loadingMore && images.length > 0 && page >= totalPages && (
          <Text style={styles.endText}>— End of photos —</Text>
        )}

        <Spacer height={120} />
      </ScrollView>

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
            onEndReachedThreshold={0.5}
            onEndReached={handleLoadMore}
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
                {(viewerIndex ?? 0) + 1} / {totalItems || images.length}
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

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.creamDark,
    borderWidth: 1,
    borderColor: hairline,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 2,
    flexShrink: 0,
  },
  backArrow: {
    color: COLORS.saffron,
    fontSize: 32,
    lineHeight: 35,
    marginTop: -4,
  },
  headerTextArea: {
    flex: 1,
  },
  headerTitle: {
    ...type.title,
    fontSize: 20,
    color: COLORS.deepBrown,
    textTransform: 'capitalize',
  },
  headerSubtitle: {
    ...type.subhead,
    color: COLORS.warmBrown,
    marginTop: 2,
  },

  /* MASONRY GRID */
  masonryRow: {
    flexDirection: 'row',
    paddingHorizontal: GRID_PADDING,
    gap: COLUMN_GAP,
  },
  masonryColumn: {
    flex: 1,
    gap: COLUMN_GAP,
  },
  tile: {
    width: '100%',
    borderRadius: radii.md,
    overflow: 'hidden',
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
  footerLoader: {
    marginVertical: spacing.lg,
  },
  endText: {
    ...type.footnote,
    color: COLORS.warmBrown,
    textAlign: 'center',
    marginTop: spacing.lg,
    letterSpacing: 0.5,
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
