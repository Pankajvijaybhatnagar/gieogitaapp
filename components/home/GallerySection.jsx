import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import galleryServices from '@/lib/services/galleryServices';
import { radii, shadow, spacing, type } from '@/constants/theme';
import { COLORS } from './constant';
import { SectionHeader } from './Sharedui';

const FOLDERS_PREVIEW_LIMIT = 10;

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

export default function GallerySection() {
  const router = useRouter();

  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);

        const response = await galleryServices.getGalleryFolders(
          1,
          FOLDERS_PREVIEW_LIMIT,
        );

        const fetched = response?.status
          ? normalizeFolders(response?.data?.folders)
          : [];

        if (!cancelled) {
          setAlbums(fetched);
        }
      } catch (error) {
        console.error('Error fetching gallery albums:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <SectionHeader
        title="Our"
        accent="Gallery"
        icon="images-outline"
        onSeeAll={() => router.push('/home/gallery')}
        seeAllLabel="View All"
      />

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color={COLORS.richBrown} />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + CARD_GAP}
          snapToAlignment="start"
          contentContainerStyle={styles.hScrollContent}>
          {albums.map(item => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              onPress={() =>
                router.push(`/home/gallery/${encodeURIComponent(item.name)}`)
              }
              style={styles.card}>
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.image}
                contentFit="cover"
                transition={200}
              />

              <View style={styles.captionBar}>
                <Text style={styles.captionText} numberOfLines={1}>
                  {formatAlbumName(item.name)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </>
  );
}

const CARD_WIDTH = 188;
const CARD_HEIGHT = 235;
const CARD_GAP = 12;

const styles = StyleSheet.create({
  loadingBox: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hScrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
    gap: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: radii.xl,
    overflow: 'hidden',
    backgroundColor: COLORS.creamDark,
    ...shadow.raised,
    shadowColor: COLORS.richBrown,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  captionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  captionText: {
    ...type.subhead,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
    textTransform: 'capitalize',
  },
});
