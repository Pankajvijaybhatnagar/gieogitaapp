// components/join/LatestMasikParwas.jsx

import joinGieoGitaServices from '@/lib/services/joinGieoGitaServices';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const COLORS = {
  primary: '#6E3F1F',
  secondary: '#A8692D',
};

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
            color={COLORS.secondary}
          />
        </View>

        <View>
          <Text style={styles.eyebrow}>MONTHLY JOURNEY</Text>

          <Text style={styles.title}>मासिक प्रवास</Text>
        </View>
      </View>

      <View style={styles.card}>
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        ) : (
          <Image
            source={{ uri: image }}
            style={styles.image}
            contentFit="contain"
            transition={300}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginTop: 25,
  },

  headingRow: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#F1DFCE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  eyebrow: {
    color: COLORS.secondary,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.4,
  },

  title: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },

  card: {
    minHeight: 220,
    borderRadius: 23,
    backgroundColor: '#FFF',
    overflow: 'hidden',
    padding: 8,
  },

  image: {
    width: '100%',
    height: 460,
    borderRadius: 17,
  },

  loader: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LatestMasikParwas;
