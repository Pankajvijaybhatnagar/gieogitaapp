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
    backgroundColor: '#f5f5f5',
  },

  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    color: '#222',
  },

  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },

  key: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },

  value: {
    fontSize: 17,
    color: '#111',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
    color: '#222',
  },

  jsonContainer: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 15,
  },

  jsonText: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'monospace',
  },
});
