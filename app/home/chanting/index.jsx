import { DESIGN } from '@/constants/design';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import getDeviceHeaders from '@/lib/api/deviceHeaders';
import ChantCounter from '../../../components/chants/ChantCounter2';
import { COLORS } from '@/constants/brandColors';
import { hairline, radii, spacing, type } from '@/constants/theme';

const Index = () => {
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDeviceInfo = async () => {
      try {
        const info = await getDeviceHeaders();
        setDeviceInfo(info);
      } catch (error) {
        console.error('Failed to get device info:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDeviceInfo();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading device information...</Text>
      </View>
    );
  }

  if (!deviceInfo) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Unable to load device information.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Device Information</Text>

      <ChantCounter/>

      {Object.entries(deviceInfo).map(([key, value]) => (
        <View key={key} style={styles.infoCard}>
          <Text style={styles.key}>{key}</Text>
          <Text style={styles.value}>
            {value !== undefined && value !== null && value !== ''
              ? String(value)
              : 'Not available'}
          </Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Full Object</Text>

      <View style={styles.jsonContainer}>
        <Text style={styles.jsonText}>
          {JSON.stringify(deviceInfo, null, 2)}
        </Text>
      </View>
    </ScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: 40
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    padding: spacing.lg
  },
  loadingText: {
    marginTop: spacing.sm,
    ...type.body,
    color: COLORS.warmBrown
  },
  title: {
    ...type.largeTitle,
    marginBottom: spacing.lg,
    color: COLORS.deepBrown
  },
  infoCard: {
    backgroundColor: DESIGN.colors.surface,
    borderRadius: 24,
    padding: 15,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    shadowOpacity: 0.045,
    elevation: 2
  },
  key: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.warmBrown,
    marginBottom: 6
  },
  value: {
    fontSize: 17,
    color: COLORS.deepBrown
  },
  sectionTitle: {
    ...type.title,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    color: COLORS.deepBrown
  },
  jsonContainer: {
    backgroundColor: COLORS.deepBrown,
    borderRadius: radii.sm,
    padding: 15
  },
  jsonText: {
    color: COLORS.cream,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'monospace'
  }
});
