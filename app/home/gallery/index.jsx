// app/home/gallery/index.jsx
//
// Gallery albums — a grid of every folder from galleryServices.getGalleryFolders(),
// paginated. Tapping an album opens its photos in app/home/gallery/[folder].jsx.

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Spacer from '@/components/ui/Spacer';
import { COLORS, RGB } from '@/constants/brandColors';
import { radii, shadow, spacing, type } from '@/constants/theme';
import galleryServices from '@/lib/services/galleryServices';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 12;
const GRID_COLUMNS = 2;
const TILE_WIDTH =
  (SCREEN_WIDTH - spacing.md * 2 - GRID_GAP * (GRID_COLUMNS - 1)) /
  GRID_COLUMNS;
const PAGE_LIMIT = 10;

function formatAlbumName(name) {
  return String(name || '')
    .replace(/[_-]+/g, ' ')
    .trim();
}

function normalizeFolders(raw) {
  const list = Array.isArray(raw) ? raw : [];

  return list
    .map((item, index) => ({
      id: String(item?.name ?? index),
      name: item?.name || '',
      thumbnail: item?.thumbnail || '',
    }))
    .filter(album => !!album.name);
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
          <Ionicons name="albums" size={28} color={COLORS.saffron} />
        </View>
      </View>

      <Text style={styles.heroTitle}>Photo Gallery</Text>
      <View style={styles.heroDivider} />
      <Text style={styles.heroSubtitle}>
        {count} albums from satsangs, seva &amp; celebrations
      </Text>
    </View>
  );
}

export default function GalleryAlbumsScreen() {
  const router = useRouter();

  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchFolders = useCallback(async (targetPage, replace) => {
    if (replace) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await galleryServices.getGalleryFolders(
        targetPage,
        PAGE_LIMIT,
      );

      const fetched = response?.status
        ? normalizeFolders(response?.data?.folders)
        : [];

      setAlbums(prev => (replace ? fetched : [...prev, ...fetched]));
      setTotalPages(response?.data?.pagination?.total_pages || 1);
      setPage(targetPage);
    } catch (error) {
      console.error('Error fetching gallery albums:', error);

      if (replace) {
        setAlbums([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchFolders(1, true);
  }, [fetchFolders]);

  const handleLoadMore = () => {
    if (loading || loadingMore || page >= totalPages) {
      return;
    }

    fetchFolders(page + 1, false);
  };

  return (
    <View style={styles.root}>
      <FlatList
        data={albums}
        keyExtractor={item => item.id}
        numColumns={GRID_COLUMNS}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={<Hero count={albums.length} />}
        ListEmptyComponent={
          loading ? (
            <View style={styles.stateBox}>
              <ActivityIndicator size="small" color={COLORS.richBrown} />
              <Text style={styles.stateText}>Loading albums...</Text>
            </View>
          ) : (
            <View style={styles.stateBox}>
              <Ionicons
                name="images-outline"
                size={32}
                color={COLORS.warmBrown}
              />
              <Text style={styles.stateText}>No albums available yet.</Text>
            </View>
          )
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.4}
        onEndReached={handleLoadMore}
        ListFooterComponent={
          <>
            {loadingMore && (
              <ActivityIndicator
                size="small"
                color={COLORS.richBrown}
                style={styles.footerLoader}
              />
            )}

            {!loading && !loadingMore && albums.length > 0 && page >= totalPages && (
              <Text style={styles.endText}>— End of albums —</Text>
            )}

            <Spacer height={120} />
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.tile}
            onPress={() =>
              router.push(`/home/gallery/${encodeURIComponent(item.name)}`)
            }>
            <Image
              source={{ uri: item.thumbnail }}
              style={styles.tileImage}
              contentFit="cover"
              transition={200}
            />

            <View style={styles.tileCaptionBar}>
              <Text style={styles.tileCaptionText} numberOfLines={2}>
                {formatAlbumName(item.name)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  listContent: {
    paddingHorizontal: spacing.md,
  },
  row: {
    gap: GRID_GAP,
  },

  /* HERO */
  hero: {
    alignItems: 'center',
    paddingBottom: spacing.lg,
    marginBottom: spacing.sm,
    marginHorizontal: -spacing.md,
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
    width: TILE_WIDTH,
    aspectRatio: 0.85,
    borderRadius: radii.lg,
    overflow: 'hidden',
    marginBottom: GRID_GAP,
    backgroundColor: COLORS.creamDark,
    ...shadow.raised,
    shadowColor: COLORS.richBrown,
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  tileCaptionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  tileCaptionText: {
    ...type.subhead,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
    textTransform: 'capitalize',
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
});
