import DonationCard from '@/components/donations/DonationCard';
import DonationListFooter from '@/components/donations/DonationListFooter';
import { useAuth } from '@/context/AuthContext';
import donationServices from '@/lib/services/donationServices';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useCallback, useEffect, useRef, useState } from 'react';

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
            <Ionicons name="person-circle-outline" size={34} color="#7A4527" />
          </View>

          <ActivityIndicator size="small" color="#7A4527" />

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
              <Ionicons name="receipt-outline" size={38} color="#7A4527" />
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
                <Ionicons name="time-outline" size={18} color="#7A4527" />
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
                  color="#7A4527"
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
                  color="#7A4527"
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
            <Ionicons name="receipt-outline" size={32} color="#7A4527" />
          </View>

          <ActivityIndicator size="small" color="#7A4527" />

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
            tintColor="#7A4527"
            colors={['#7A4527']}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerText}>
                <Text style={styles.title}>My Donations</Text>
              </View>

              {/* <View style={styles.headerIcon}>
                <Ionicons name="heart-outline" size={24} color="#FFF7EC" />
              </View> */}
            </View>

            <Text style={styles.description}>
              Your contribution history and donation receipts.
            </Text>

            {totalDonations > 0 && (
              <View style={styles.summaryCard}>
                <View style={styles.summaryIcon}>
                  <Ionicons name="receipt-outline" size={20} color="#7A4527" />
                </View>

                <View style={styles.summaryTextContainer}>
                  <Text style={styles.summaryLabel}>Total Donations</Text>

                  <Text style={styles.summaryValue}>{totalDonations}</Text>
                </View>

                <View style={styles.summaryHeart}>
                  <Ionicons name="heart" size={18} color="#A86B46" />
                </View>
              </View>
            )}

            {error && donations.length > 0 && (
              <View style={styles.inlineError}>
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color="#A14332"
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
                    color="#9B6A4A"
                  />
                </View>

                <Text style={styles.emptyTitle}>Unable to load donations</Text>

                <Text style={styles.emptyDescription}>{error}</Text>

                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={handleRetry}
                  activeOpacity={0.85}>
                  <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />

                  <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.emptyIcon}>
                  <Ionicons name="heart-outline" size={36} color="#9B6A4A" />
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
          <DonationListFooter
            loading={loadingMore}
            hasDonations={donations.length > 0}
            hasMore={page < totalPages}
          />
        }
      />
    </SafeAreaView>
  );
};

export default DonationHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F2',
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
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.7,
    color: '#B17A55',
    marginBottom: 5,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4D2D1A',
  },

  description: {
    fontSize: 12,
    // lineHeight: 21,
    color: '#82644F',
    marginTop: 0,
    maxWidth: '85%',
  },

  headerIcon: {
    width: 30,
    height: 30,
    borderRadius: 18,
    backgroundColor: '#6C3B24',
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
    backgroundColor: '#F2E2D2',
    borderWidth: 1,
    borderColor: '#E8D0BA',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },

  summaryIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFF9F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryTextContainer: {
    flex: 1,
    marginLeft: 12,
  },

  summaryLabel: {
    color: '#896B56',
    fontSize: 12,
    fontWeight: '500',
  },

  summaryValue: {
    color: '#4D2D1A',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 2,
  },

  summaryHeart: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#FFF9F2',
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
    backgroundColor: '#F2E2D2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  loadingText: {
    color: '#82644F',
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
    backgroundColor: '#F1DFCE',
    borderWidth: 1,
    borderColor: '#E6CDB7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  guestEyebrow: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#AE7955',
    marginBottom: 8,
  },

  guestTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#4D2D1A',
  },

  guestDescription: {
    textAlign: 'center',
    color: '#846753',
    fontSize: 13,
    lineHeight: 21,
    paddingHorizontal: 15,
    marginTop: 10,
  },

  guestFeatures: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EFE0D2',
    padding: 17,
    marginTop: 28,
    marginBottom: 22,
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
    backgroundColor: '#F6EADD',
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
    color: '#523321',
  },

  featureDescription: {
    fontSize: 11,
    lineHeight: 16,
    color: '#967B67',
    marginTop: 2,
  },

  loginButton: {
    height: 37,
    width: 200,
    borderRadius: 20,
    backgroundColor: '#693B24',
    paddingHorizontal: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#57301C',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 3,
    marginHorizontal: 'auto',
  },

  loginButtonText: {
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  loginHint: {
    fontSize: 10,
    color: '#A08876',
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
    backgroundColor: '#F4E6D8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#4D2D1A',
    textAlign: 'center',
  },

  emptyDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: '#8B6D58',
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
    backgroundColor: '#6C3B24',
    paddingHorizontal: 18,
    height: 44,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 18,
  },

  retryButtonText: {
    color: '#FFFFFF',
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
    borderRadius: 12,
    backgroundColor: '#FBEDEA',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  inlineErrorText: {
    color: '#934635',
    fontSize: 12,
    flex: 1,
    lineHeight: 17,
  },
});
