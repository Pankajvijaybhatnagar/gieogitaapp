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
import { COLORS, galleryPhotos } from './constant';
import { SectionHeader } from './Sharedui';

const GALLERY_FOLDER = 'gallery';

// The gallery API can plausibly hand back a few different shapes
// (an array of URL strings, or objects with image/url/file/path/src) —
// normalize whatever comes back instead of assuming one exact shape.
function normalizeImages(raw) {
  const list = Array.isArray(raw) ? raw : [];

  return list
    .map((item, index) => {
      if (typeof item === 'string') {
        return { id: String(index), uri: item, caption: '' };
      }

      const uri = item?.image || item?.url || item?.file || item?.path || item?.src || '';

      return {
        id: String(item?.id ?? index),
        uri,
        caption: item?.title || item?.caption || item?.name || '',
      };
    })
    .filter(image => !!image.uri);
}

export default function GallerySection() {
  const router = useRouter();

  // Real photos already live on gieogita.org, shown immediately and
  // replaced automatically once the backend's own gallery has content.
  const [images, setImages] = useState(galleryPhotos);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);

        const response = await galleryServices.getPublicGallery(GALLERY_FOLDER);

        const raw = response?.data?.data || response?.data?.images || response?.data || [];

        const fetched = response?.success ? normalizeImages(raw) : [];

        if (!cancelled && fetched.length > 0) {
          setImages(fetched);
        }
      } catch (error) {
        console.error('Error fetching gallery:', error);
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
        title="Gallery"
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
          {images.slice(0, 12).map((item, index) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/home/gallery', params: { index } })}
              style={styles.card}>
              <Image source={{ uri: item.uri }} style={styles.image} contentFit="cover" transition={200} />

              {!!item.caption && (
                <View style={styles.captionBar}>
                  <Text style={styles.captionText} numberOfLines={1}>
                    {item.caption}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </>
  );
}

const CARD_WIDTH = 168;
const CARD_HEIGHT = 210;
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
  },
});
