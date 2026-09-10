// components/join/LatestMasikParwas.jsx

import joinGieoGitaServices from '@/lib/services/joinGieoGitaServices';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import Card from '@/components/ui/Card';
import { COLORS, RGB } from '@/constants/brandColors';
import { radii, spacing, type } from '@/constants/theme';

const LatestMasikParwas = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImage();
  }, []);

  const loadImage = async () => {
    try {
      const response = await joinGieoGitaServices.getLatestMasikParwas();

      console.log('MASIK PARWAS RESPONSE:', response);

      const imageUrl =
        response?.data?.data?.pic_url ?? response?.data?.pic_url ?? null;

      setImage(imageUrl);
    } catch (error) {
      console.log('Masik Parwas error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!loading && !image) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.headingRow}>
        <View style={styles.icon}>
          <Ionicons
            name="calendar-outline"
            size={20}
            color={COLORS.goldDark}
          />
        </View>

        <View>
          <Text style={styles.eyebrow}>MONTHLY JOURNEY</Text>

          <Text style={styles.title}>मासिक प्रवास</Text>
        </View>
      </View>

      <Card radius={radii.xl} style={styles.card}>
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="small" color={COLORS.saffron} />
          </View>
        ) : (
          <Image
            source={{ uri: image }}
            style={styles.image}
            contentFit="contain"
            transition={300}
          />
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg + 1
  },
  headingRow: {
    marginBottom: spacing.sm + 4,
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radii.md - 1,
    backgroundColor: `rgba(${RGB.gold}, 0.14)`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 2
  },
  eyebrow: {
    color: COLORS.goldDark,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.4
  },
  title: {
    ...type.title,
    fontSize: 20,
    color: COLORS.deepBrown,
    marginTop: 2
  },
  card: {
    minHeight: 220,
    padding: spacing.sm
  },
  image: {
    width: '100%',
    height: 460,
    borderRadius: radii.lg - 1
  },
  loader: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default LatestMasikParwas;
