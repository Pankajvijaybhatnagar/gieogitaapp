import DonationCard from '@/components/donations/DonationCard';
import DonationListFooter from '@/components/donations/DonationListFooter';
import { DESIGN } from '@/constants/design';
import { useAuth } from '@/context/AuthContext';
import donationServices from '@/lib/services/donationServices';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useCallback, useEffect, useRef, useState } from 'react';

import Spacer from '@/components/ui/Spacer';
import { COLORS, RGB } from '@/constants/brandColors';
import { hairline, radii, shadow, spacing, type } from '@/constants/theme';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const LIMIT = 10;

const DonationHistoryScreen = () => {
  const router = useRouter();

  const {
    user,
    access_token,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const [donations, setDonations] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDonations, setTotalDonations] = useState(0);

  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState('');

  const loadingMoreRef = useRef(false);

  /*
  |--------------------------------------------------------------------------
  | NORMALIZE API RESPONSE
  |--------------------------------------------------------------------------
  */

  const normalizeResponse = response => {
    if (
      response?.data &&
      !Array.isArray(response.data) &&
      typeof response.data === 'object' &&
      'status' in response.data
    ) {
      return response.data;
    }

    return response;
  };

  /*
  |--------------------------------------------------------------------------
  | REMOVE DUPLICATE DONATIONS
  |--------------------------------------------------------------------------
  */

  const removeDuplicates = items => {
    const map = new Map();

    items.forEach(item => {
      map.set(String(item.id), item);
    });

    return Array.from(map.values());
  };

  /*
  |--------------------------------------------------------------------------
  | FETCH DONATIONS
  |--------------------------------------------------------------------------
  */

  const fetchDonations = useCallback(
    async (targetPage = 1, replace = false) => {
      if (!isAuthenticated || !access_token) {
        return;
      }

      try {
        setError('');

        const response = await donationServices.getMyDonations(
          {
            page: targetPage,
            limit: LIMIT,
          },
          access_token,
        );

        const result = normalizeResponse(response);

        if (!result?.status) {
          throw new Error(result?.message || 'Unable to load donations');
        }

        const newDonations = Array.isArray(result?.data) ? result.data : [];

        if (replace) {
          setDonations(removeDuplicates(newDonations));
        } else {
          setDonations(previous =>
            removeDuplicates([...previous, ...newDonations]),
          );
        }

        setPage(Number(result?.page || targetPage));

        setTotalPages(Number(result?.total_pages || 1));

        setTotalDonations(Number(result?.total || 0));
      } catch (err) {
        console.log('Donation history error:', err);

        setError(
          err?.message || 'Something went wrong while loading your donations.',
        );
      } finally {
        setInitialLoading(false);
        setLoadingMore(false);
        setRefreshing(false);

        loadingMoreRef.current = false;
      }
    },
    [access_token, isAuthenticated],
  );

  /*
  |--------------------------------------------------------------------------
  | FIRST LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    /*
     * User is not logged in.
     * Do not call donation API.
     */
    if (!isAuthenticated || !access_token) {
      setInitialLoading(false);
      setDonations([]);
      setPage(1);
      setTotalPages(1);
      setTotalDonations(0);

      return;
    }

    /*
     * Logged-in user.
     */
    setInitialLoading(true);

    fetchDonations(1, true);
  }, [authLoading, isAuthenticated, access_token, fetchDonations]);

  /*
  |--------------------------------------------------------------------------
  | LOAD NEXT PAGE
  |--------------------------------------------------------------------------
  */

  const handleLoadMore = () => {
    if (!isAuthenticated) return;

    if (loadingMoreRef.current) return;

    if (initialLoading) return;

    if (refreshing) return;

    if (page >= totalPages) return;

    loadingMoreRef.current = true;

    setLoadingMore(true);

    fetchDonations(page + 1, false);
  };

  /*
  |--------------------------------------------------------------------------
  | REFRESH
  |--------------------------------------------------------------------------
  */

  const handleRefresh = () => {
    if (!isAuthenticated) return;

    if (refreshing) return;

    setRefreshing(true);

    loadingMoreRef.current = false;

    fetchDonations(1, true);
  };

  /*
  |--------------------------------------------------------------------------
  | RETRY
  |--------------------------------------------------------------------------
  */

  const handleRetry = () => {
    if (!isAuthenticated) return;

    setInitialLoading(true);

    fetchDonations(1, true);
  };

  /*
  |--------------------------------------------------------------------------
  | LOGIN
  |--------------------------------------------------------------------------
  */

  const handleLogin = () => {
    router.push('/login2');
  };

  /*
  |--------------------------------------------------------------------------
  | AUTH SESSION LOADING
  |--------------------------------------------------------------------------
  */

  if (authLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingIcon}>
            <Ionicons
              name="person-circle-outline"
              size={34}
              color={COLORS.saffron}
            />
          </View>

          <ActivityIndicator size="small" color={COLORS.saffron} />

          <Text style={styles.loadingText}>Checking your account...</Text>
        </View>
      </SafeAreaView>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | NOT LOGGED IN
  |--------------------------------------------------------------------------
  */

  if (!isAuthenticated || !access_token || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.guestContainer}>
          <View style={styles.guestIconWrapper}>
            <View style={styles.guestIcon}>
              <Ionicons
                name="receipt-outline"
                size={38}
                color={COLORS.saffron}
              />
            </View>
          </View>

          <Text style={styles.guestEyebrow}>YOUR SEVA</Text>

          <Text style={styles.guestTitle}>View Your Donations</Text>

          {/* <Text style={styles.guestDescription}>
            Login to view your donation history, payment status and download
            your donation receipts.
          </Text> */}

          <View style={styles.guestFeatures}>
            <View style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={COLORS.saffron}
                />
              </View>

              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Donation History</Text>

                <Text style={styles.featureDescription}>
                  View all your previous contributions.
                </Text>
              </View>
            </View>

            <View style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Ionicons
                  name="document-text-outline"
                  size={18}
                  color={COLORS.saffron}
                />
              </View>

              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Donation Receipts</Text>

                <Text style={styles.featureDescription}>
                  Download receipts for completed donations.
                </Text>
              </View>
            </View>

            <View style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={18}
                  color={COLORS.saffron}
                />
              </View>

              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Payment Status</Text>

                <Text style={styles.featureDescription}>
                  Check completed, pending or failed transactions.
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.85}>
            <Ionicons name="log-in-outline" size={20} color="#FFFFFF" />

            <Text style={styles.loginButtonText}>Login to Continue</Text>
          </TouchableOpacity>

          <Text style={styles.loginHint}>
            Login securely to access your donation history
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | DONATION INITIAL LOADING
  |--------------------------------------------------------------------------
  */

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingIcon}>
            <Ionicons name="receipt-outline" size={32} color={COLORS.saffron} />
          </View>

          <ActivityIndicator size="small" color={COLORS.saffron} />

          <Text style={styles.loadingText}>Loading your donations...</Text>
        </View>
      </SafeAreaView>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | DONATION LIST
  |--------------------------------------------------------------------------
  */

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={donations}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => <DonationCard donation={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,

          donations.length === 0 && styles.emptyListContent,
        ]}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.35}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.saffron}
            colors={[COLORS.saffron]}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerText}>
                <Text style={styles.title}>My Donations</Text>
              </View>

              <TouchableOpacity
                style={styles.addDonationButton}
                activeOpacity={0.8}
                onPress={() => router.push('/home/(tabs)/donations/new')}>
                <Ionicons name="add" size={17} color={COLORS.white} />

                <Text style={styles.addDonationText}>New Donation</Text>
              </TouchableOpacity>
            </View>

            {totalDonations > 0 && (
              <View style={styles.summaryCard}>
                {/* <Ionicons name="receipt-outline" size={12} color="#7A4527" /> */}
                <Text style={styles.summaryLabel}>
                  Total Donations :{' '}
                  <Text style={styles.summaryValue}>{totalDonations}</Text>
                </Text>
              </View>
            )}

            {error && donations.length > 0 && (
              <View style={styles.inlineError}>
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color={COLORS.dangerRed}
                />

                <Text style={styles.inlineErrorText}>{error}</Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {error ? (
              <>
                <View style={styles.emptyIcon}>
                  <Ionicons
                    name="cloud-offline-outline"
                    size={34}
                    color={COLORS.warmBrown}
                  />
                </View>

                <Text style={styles.emptyTitle}>Unable to load donations</Text>

                <Text style={styles.emptyDescription}>{error}</Text>

                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={handleRetry}
                  activeOpacity={0.85}>
                  <Ionicons
                    name="refresh-outline"
                    size={18}
                    color={COLORS.white}
                  />

                  <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.emptyIcon}>
                  <Ionicons
                    name="heart-outline"
                    size={36}
                    color={COLORS.warmBrown}
                  />
                </View>

                <Text style={styles.emptyTitle}>No donations yet</Text>

                <Text style={styles.emptyDescription}>
                  Your donation history will appear here once you make a
                  contribution.
                </Text>
              </>
            )}
          </View>
        }
        ListFooterComponent={
          <>
            <DonationListFooter
              loading={loadingMore}
              hasDonations={donations.length > 0}
              hasMore={page < totalPages}
            />
            <Spacer height={120} />
          </>
        }
      />
    </SafeAreaView>
  );
};

export default DonationHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.creamDark,
  },
  /*
  |--------------------------------------------------------------------------
  | LIST
  |--------------------------------------------------------------------------
  */

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  /*
  |--------------------------------------------------------------------------
  | HEADER
  |--------------------------------------------------------------------------
  */

  header: {
    paddingTop: 10,
    paddingBottom: 5,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    ...type.caption,
    color: COLORS.saffron,
    marginBottom: 5,
  },
  title: {
    ...type.title,
    color: COLORS.deepBrown,
  },
  description: {
    fontSize: 12,
    color: COLORS.warmBrown,
    marginTop: 0,
    maxWidth: '55%',
  },
  headerIcon: {
    width: 30,
    height: 30,
    borderRadius: 18,
    backgroundColor: COLORS.saffron,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /*
  |--------------------------------------------------------------------------
  | SUMMARY
  |--------------------------------------------------------------------------
  */

  summaryCard: {
    marginTop: 15,
    borderRadius: 18,
    paddingVertical: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  summaryTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  summaryLabel: {
    color: COLORS.warmBrown,
    fontSize: 12,
    fontWeight: '500',
  },
  summaryValue: {
    color: COLORS.deepBrown,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  summaryHeart: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: COLORS.creamDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  loadingIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loadingText: {
    color: COLORS.warmBrown,
    fontSize: 14,
    marginTop: 12,
  },
  /*
  |--------------------------------------------------------------------------
  | NOT LOGGED IN
  |--------------------------------------------------------------------------
  */

  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 26,
    paddingBottom: 35,
  },
  guestIconWrapper: {
    alignItems: 'center',
    marginBottom: 25,
  },
  guestIcon: {
    width: 82,
    height: 82,
    borderRadius: 28,
    backgroundColor: COLORS.creamDark,
    borderWidth: 1,
    borderColor: hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestEyebrow: {
    textAlign: 'center',
    ...type.caption,
    color: COLORS.saffron,
    marginBottom: 8,
  },
  guestTitle: {
    textAlign: 'center',
    ...type.title,
    color: COLORS.deepBrown,
  },
  guestDescription: {
    textAlign: 'center',
    color: COLORS.warmBrown,
    fontSize: 13,
    lineHeight: 21,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  guestFeatures: {
    backgroundColor: COLORS.cream,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: hairline,
    padding: spacing.md,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
  },
  featureIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: COLORS.creamDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
    marginLeft: 12,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.deepBrown,
  },
  featureDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.warmBrown,
    marginTop: 2,
  },
  loginButton: {
    width: 200,
    borderRadius: 16,
    backgroundColor: COLORS.richBrown,
    paddingHorizontal: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 'auto',
    minHeight: 52,
  },
  loginButtonText: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  loginHint: {
    fontSize: 12,
    color: COLORS.warmBrown,
    textAlign: 'center',
    marginTop: 12,
  },
  /*
  |--------------------------------------------------------------------------
  | EMPTY
  |--------------------------------------------------------------------------
  */

  emptyContainer: {
    flex: 1,
    minHeight: 360,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 25,
    backgroundColor: COLORS.creamDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: '400',
    color: COLORS.deepBrown,
    textAlign: 'center',
    fontFamily: DESIGN.fonts.editorial,
    letterSpacing: -0.4,
  },
  emptyDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.warmBrown,
    textAlign: 'center',
    marginTop: 7,
    maxWidth: 300,
  },
  /*
  |--------------------------------------------------------------------------
  | RETRY
  |--------------------------------------------------------------------------
  */

  retryButton: {
    backgroundColor: COLORS.richBrown,
    paddingHorizontal: 18,
    height: 44,
    borderRadius: radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 18,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
  /*
  |--------------------------------------------------------------------------
  | INLINE ERROR
  |--------------------------------------------------------------------------
  */

  inlineError: {
    marginTop: 14,
    padding: 12,
    borderRadius: radii.sm,
    backgroundColor: `rgba(${RGB.dangerRed},0.08)`,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inlineErrorText: {
    color: COLORS.dangerRed,
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },
  addDonationButton: {
    height: 34,
    paddingHorizontal: 11,
    borderRadius: radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: COLORS.richBrown,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  addDonationText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },
});
