import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { useAuth } from '@/context/AuthContext';
import masikPatrikaServices from '@/lib/services/masikPatrikaServices';

import PatrikaGrid from './PatrikaGrid';
import PatrikaStatusCard, { normalizeSubscription } from './PatrikaStatusCard';

const COLORS = {
  deepBrown: '#2C1A0A',
  warmBrown: '#4A2C0D',
  gold: '#C9A227',
  goldLight: '#E8C55A',
  goldDark: '#8B6914',
  cream: '#FDF6E3',
};

function normalizePatrikaResponse(response) {
  const root = response?.data ?? response ?? {};
  const list = root?.data ?? root;

  return Array.isArray(list) ? list : [];
}

export default function PatrikaLibraryScreen({
  subscribeRoute = '/home/patrika/subscribe',
  readerRoute = '/home/patrika/[slug]',
}) {
  const router = useRouter();

  const { access_token, isAuthenticated } = useAuth();

  const [patrika, setPatrika] = useState([]);
  const [subscription, setSubscription] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  const [error, setError] = useState('');

  const loadData = useCallback(
    async (refresh = false) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError('');

        // -----------------------------------------
        // LOAD PUBLIC PATRIKA LIST
        // -----------------------------------------
        const patrikaResult = await masikPatrikaServices.getPublic();

        if (patrikaResult?.success === false) {
          throw new Error(
            patrikaResult?.error ||
              patrikaResult?.message ||
              'Unable to load Patrika.',
          );
        }

        const patrikaList = normalizePatrikaResponse(patrikaResult);

        setPatrika(patrikaList);

        // -----------------------------------------
        // CHECK USER SUBSCRIPTION
        // -----------------------------------------
        if (isAuthenticated && access_token) {
          setSubscriptionLoading(true);

          const subscriptionResult =
            await masikPatrikaServices.checkSubscription(access_token);

          setSubscription(subscriptionResult);
        } else {
          setSubscription(null);
        }
      } catch (err) {
        console.log('[Patrika] Load error:', err);

        setError(err?.message || 'Unable to load Patrika.');
      } finally {
        setLoading(false);
        setRefreshing(false);
        setSubscriptionLoading(false);
      }
    },
    [access_token, isAuthenticated],
  );

  useFocusEffect(
    useCallback(() => {
      loadData();

      return undefined;
    }, [loadData]),
  );

  const subscriptionState = normalizeSubscription(subscription);

  // -----------------------------------------
  // PATRIKA CLICK
  // -----------------------------------------
  const handlePatrikaPress = item => {
    if (!item) {
      return;
    }

    const slug = item?.slug;

    if (!slug) {
      console.log('[Patrika] Missing slug:', item);

      return;
    }

    console.log('[Patrika] Opening slug:', slug);

    // -----------------------------------------
    // USER NOT SUBSCRIBED
    // GO TO SUBSCRIPTION SCREEN
    // -----------------------------------------
    if (!subscriptionState.subscribed) {
      router.push({
        pathname: subscribeRoute,
        params: {
          patrikaId: String(item?.id ?? ''),

          patrikaTitle: String(item?.title ?? ''),

          price: String(item?.price ?? ''),

          slug: String(slug),
        },
      });

      return;
    }

    // -----------------------------------------
    // USER SUBSCRIBED
    // OPEN ACTUAL SLUG ROUTE
    // -----------------------------------------
    router.push({
      pathname: readerRoute,
      params: {
        slug: String(slug),

        title: item?.title || 'Monthly Patrika',
      },
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadData(true)}
            tintColor={COLORS.goldDark}
          />
        }
        contentContainerStyle={styles.content}>
        {/* -------------------------------- */}
        {/* HERO */}
        {/* -------------------------------- */}

        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="book" size={27} color={COLORS.goldLight} />
          </View>

          <View style={styles.heroText}>
            <Text style={styles.eyebrow}>GIEO GITA</Text>

            <Text style={styles.title}>मासिक पत्रिका</Text>

            <Text style={styles.subtitle}>
              Your monthly spiritual reading collection
            </Text>
          </View>
        </View>

        {/* -------------------------------- */}
        {/* ERROR */}
        {/* -------------------------------- */}

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={17} color="#A64A3B" />

            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* -------------------------------- */}
        {/* SUBSCRIPTION SECTION */}
        {/* -------------------------------- */}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Subscription</Text>

            <Text style={styles.sectionSubtitle}>
              Paid access status for your account
            </Text>
          </View>
        </View>

        <PatrikaStatusCard
          subscriptionResponse={subscription}
          loading={subscriptionLoading}
          onSubscribe={() => router.push(subscribeRoute)}
          onRefresh={() => loadData(true)}
        />

        {/* -------------------------------- */}
        {/* PATRIKA COLLECTION */}
        {/* -------------------------------- */}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Patrika Collection</Text>

            <Text style={styles.sectionSubtitle}>Latest published issues</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="small" color={COLORS.goldDark} />
          ) : (
            <Text style={styles.count}>{patrika.length} issues</Text>
          )}
        </View>

        <PatrikaGrid
          data={patrika}
          locked={!subscriptionState.subscribed}
          onPress={handlePatrikaPress}
        />

        {/* -------------------------------- */}
        {/* SECURITY NOTE */}
        {/* -------------------------------- */}

        <View style={styles.securityNote}>
          <Ionicons
            name="shield-checkmark-outline"
            size={15}
            color={COLORS.goldDark}
          />

          <Text style={styles.securityText}>
            Paid issues are view-only inside the app.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFF9F3',
  },

  content: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 35,
  },

  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    marginBottom: 18,
  },

  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: COLORS.deepBrown,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroText: {
    flex: 1,
    marginLeft: 12,
  },

  eyebrow: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: '#AA7754',
  },

  title: {
    marginTop: 2,
    fontSize: 23,
    fontWeight: '800',
    color: COLORS.deepBrown,
  },

  subtitle: {
    marginTop: 3,
    fontSize: 10.5,
    color: '#897462',
  },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 14,
    padding: 11,
    borderRadius: 12,
    backgroundColor: '#FBEDEA',
  },

  errorText: {
    flex: 1,
    fontSize: 10.5,
    color: '#964839',
  },

  sectionHeader: {
    marginTop: 8,
    marginBottom: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#523421',
  },

  sectionSubtitle: {
    marginTop: 2,
    fontSize: 9,
    color: '#A08774',
  },

  count: {
    fontSize: 9,
    color: COLORS.goldDark,
    fontWeight: '700',
  },

  securityNote: {
    marginTop: 7,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },

  securityText: {
    fontSize: 8.5,
    color: '#927965',
  },
});
