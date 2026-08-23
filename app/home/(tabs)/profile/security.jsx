import { useCallback, useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';

import { useAuth } from '@/context/AuthContext';

import userServices from '@/lib/services/userServices';

const COLORS = {
  primary: '#A55A12',
  primaryDark: '#713907',
  primaryLight: '#FBF1E5',

  background: '#F8F7F5',
  white: '#FFFFFF',

  text: '#181818',
  secondary: '#737373',
  light: '#999999',

  border: '#EAE7E3',

  success: '#188044',
  successLight: '#EAF7EF',

  danger: '#C93434',
  dangerLight: '#FFF0F0',
};

const PAGE_LIMIT = 10;

export default function SecurityScreen() {
  const router = useRouter();

  const { access_token, isAuthenticated, loading: authLoading } = useAuth();

  /*
  |--------------------------------------------------------------------------
  | DATA
  |--------------------------------------------------------------------------
  */

  const [sessions, setSessions] = useState([]);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  /*
  |--------------------------------------------------------------------------
  | UI STATE
  |--------------------------------------------------------------------------
  */

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState('');

  /*
  |--------------------------------------------------------------------------
  | ANIMATION
  |--------------------------------------------------------------------------
  */

  const screenOpacity = useRef(new Animated.Value(0)).current;

  const screenTranslate = useRef(new Animated.Value(20)).current;

  /*
  |--------------------------------------------------------------------------
  | AUTH CHECK
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated || !access_token) {
      console.log('[Security] Not authenticated');

      router.replace('/login2');
    }
  }, [authLoading, isAuthenticated, access_token, router]);

  /*
  |--------------------------------------------------------------------------
  | USER AGENT PARSER
  |--------------------------------------------------------------------------
  |
  | Same logic as web SessionsPage:
  |
  | Chrome
  | Firefox
  | Edge
  | Safari
  |
  | Windows
  | Mac
  | Android
  | iPhone
  |--------------------------------------------------------------------------
  */

  const parseUserAgent = useCallback((userAgent = '') => {
    const ua = String(userAgent).toLowerCase();

    let browser = 'Unknown';

    let os = 'Unknown';

    let device = 'Desktop';

    if (ua.includes('edg')) {
      browser = 'Edge';
    } else if (ua.includes('chrome')) {
      browser = 'Chrome';
    } else if (ua.includes('firefox')) {
      browser = 'Firefox';
    } else if (ua.includes('safari')) {
      browser = 'Safari';
    }

    if (ua.includes('windows')) {
      os = 'Windows';
    } else if (ua.includes('mac')) {
      os = 'Mac';
    } else if (ua.includes('android')) {
      os = 'Android';

      device = 'Mobile';
    } else if (ua.includes('iphone')) {
      os = 'iPhone';

      device = 'Mobile';
    } else if (ua.includes('ipad')) {
      os = 'iPad';

      device = 'Tablet';
    } else if (ua.includes('linux')) {
      os = 'Linux';
    }

    return {
      browser,
      os,
      device,
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | GET BROWSER ICON
  |--------------------------------------------------------------------------
  */

  const getBrowserIcon = browser => {
    switch (browser) {
      case 'Chrome':
        return 'logo-chrome';

      case 'Firefox':
        return 'logo-firefox';

      case 'Edge':
        return 'globe-outline';

      case 'Safari':
        return 'logo-apple';

      default:
        return 'laptop-outline';
    }
  };

  /*
  |--------------------------------------------------------------------------
  | GET OS ICON
  |--------------------------------------------------------------------------
  */

  const getOSIcon = os => {
    switch (os) {
      case 'Windows':
        return 'logo-windows';

      case 'Mac':
        return 'logo-apple';

      case 'Android':
        return 'logo-android';

      case 'iPhone':
      case 'iPad':
        return 'phone-portrait-outline';

      default:
        return 'laptop-outline';
    }
  };

  /*
  |--------------------------------------------------------------------------
  | ACTIVE CHECK
  |--------------------------------------------------------------------------
  |
  | Same as web:
  |
  | new Date(exp) > new Date()
  |--------------------------------------------------------------------------
  */

  const isActive = expiresAt => {
    if (!expiresAt) {
      return false;
    }

    const expiry = new Date(expiresAt).getTime();

    if (Number.isNaN(expiry)) {
      return false;
    }

    return expiry > Date.now();
  };

  /*
  |--------------------------------------------------------------------------
  | DATE FORMAT
  |--------------------------------------------------------------------------
  |
  | Similar to:
  |
  | en-GB
  | day: numeric
  | month: short
  | year: numeric
  | hour: numeric
  | minute: 2-digit
  |--------------------------------------------------------------------------
  */

  const formatDate = date => {
    if (!date) {
      return '-';
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return String(date);
    }

    return parsed.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  /*
  |--------------------------------------------------------------------------
  | FETCH SESSIONS
  |--------------------------------------------------------------------------
  */

  const fetchSessions = useCallback(
    async (requestedPage = page, showLoader = true) => {
      if (!access_token) {
        setSessions([]);
        setLoading(false);
        return;
      }

      try {
        if (showLoader) {
          setLoading(true);
        }

        setError('');

        console.log('[Security] Fetching sessions:', {
          page: requestedPage,
          limit: PAGE_LIMIT,
        });

        const res = await userServices.getSessions(
          {
            page: requestedPage,
            limit: PAGE_LIMIT,
          },
          access_token,
        );

        console.log('[Security] Sessions response:', res);

        if (!res?.success) {
          throw new Error(res?.error || 'Failed to load sessions');
        }

        const data = res?.data;

        const sessionList = Array.isArray(data?.data) ? data.data : [];

        const serverTotalPages = Number(data?.total_pages || 1);

        setSessions(sessionList);

        setTotalPages(serverTotalPages > 0 ? serverTotalPages : 1);
      } catch (requestError) {
        console.error('[Security] Fetch sessions error:', requestError);

        setError(requestError?.message || 'Failed to load sessions');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [access_token, page],
  );

  /*
  |--------------------------------------------------------------------------
  | INITIAL / PAGE FETCH
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (authLoading || !isAuthenticated || !access_token) {
      return;
    }

    fetchSessions(page, true);
  }, [authLoading, isAuthenticated, access_token, page]);

  /*
  |--------------------------------------------------------------------------
  | SCREEN ANIMATION
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (loading) {
      return;
    }

    Animated.parallel([
      Animated.timing(screenOpacity, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.spring(screenTranslate, {
        toValue: 0,
        speed: 15,
        bounciness: 3,
        useNativeDriver: true,
      }),
    ]).start();
  }, [loading]);

  /*
  |--------------------------------------------------------------------------
  | REFRESH
  |--------------------------------------------------------------------------
  */

  const handleRefresh = async () => {
    setRefreshing(true);

    await fetchSessions(page, false);
  };

  /*
  |--------------------------------------------------------------------------
  | LOGOUT SINGLE SESSION
  |--------------------------------------------------------------------------
  */

  const handleLogout = session => {
    const sessionId = session?.id ?? session?.session_id;

    if (!sessionId) {
      Alert.alert('Session Error', 'Session ID is missing.');

      return;
    }

    /*
     * Don't allow logging out
     * current device.
     */

    if (session?.is_current) {
      return;
    }

    Alert.alert('Logout Session', 'Do you want to logout this session?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },

      {
        text: 'Logout',
        style: 'destructive',

        onPress: async () => {
          try {
            setActionLoading(true);

            console.log('[Security] Logout session:', sessionId);

            const res = await userServices.logoutSession(
              sessionId,
              access_token,
            );

            console.log('[Security] Logout session response:', res);

            if (!res?.success) {
              throw new Error(res?.error || 'Failed to logout session');
            }

            Alert.alert('Success', 'Session logged out successfully.');

            await fetchSessions(page, false);
          } catch (logoutError) {
            console.error('[Security] Logout session error:', logoutError);

            Alert.alert(
              'Failed',
              logoutError?.message || 'Failed to logout session.',
            );
          } finally {
            setActionLoading(false);
          }
        },
      },
    ]);
  };

  /*
  |--------------------------------------------------------------------------
  | LOGOUT ALL
  |--------------------------------------------------------------------------
  */

  const handleLogoutAll = () => {
    Alert.alert(
      'Logout All Sessions',
      'This will logout all sessions. Continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Logout All',
          style: 'destructive',

          onPress: async () => {
            try {
              setActionLoading(true);

              console.log('[Security] Logout all sessions');

              const res = await userServices.logoutAllSessions(access_token);

              console.log('[Security] Logout all response:', res);

              if (!res?.success) {
                throw new Error(res?.error || 'Failed to logout all sessions');
              }

              /*
               * Your web version simply calls
               * fetchSessions() again after this.
               *
               * We follow the same behavior.
               */

              await fetchSessions(page, false);

              Alert.alert('Success', 'All sessions have been logged out.');
            } catch (logoutError) {
              console.error('[Security] Logout all error:', logoutError);

              Alert.alert(
                'Failed',
                logoutError?.message || 'Failed to logout all sessions.',
              );
            } finally {
              setActionLoading(false);
            }
          },
        },
      ],
    );
  };

  /*
  |--------------------------------------------------------------------------
  | PAGINATION
  |--------------------------------------------------------------------------
  */

  const goPrevious = () => {
    if (page <= 1 || actionLoading) {
      return;
    }

    setPage(previous => previous - 1);
  };

  const goNext = () => {
    if (page >= totalPages || actionLoading) {
      return;
    }

    setPage(previous => previous + 1);
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (authLoading || loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={COLORS.primary} />

        <Text style={styles.loadingText}>Loading sessions...</Text>
      </View>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <View style={styles.screen}>
      <Animated.View
        style={[
          styles.flex,
          {
            opacity: screenOpacity,

            transform: [
              {
                translateY: screenTranslate,
              },
            ],
          },
        ]}>
        {/* =====================================================
            HEADER
        ===================================================== */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace('/home/profile')}
            disabled={actionLoading}>
            <Ionicons name="arrow-back" size={20} color={COLORS.text} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Security & Sessions</Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* =====================================================
            BODY
        ===================================================== */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.primary}
            />
          }
          contentContainerStyle={styles.content}>
          {/* SECURITY BANNER */}

          <View style={styles.securityBanner}>
            <View style={styles.securityIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={24}
                color={COLORS.success}
              />
            </View>

            <View style={styles.securityText}>
              <Text style={styles.bannerTitle}>Security & Sessions</Text>

              <Text style={styles.bannerSubtitle}>
                Review devices that are currently signed in to your account.
              </Text>
            </View>
          </View>

          {/* HEADER / LOGOUT ALL */}

          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>My Sessions</Text>
            </View>

            <TouchableOpacity
              style={styles.logoutAllButton}
              onPress={handleLogoutAll}
              disabled={actionLoading || sessions.length === 0}
              activeOpacity={0.8}>
              {actionLoading ? (
                <ActivityIndicator size="small" color={COLORS.danger} />
              ) : (
                <>
                  <Ionicons
                    name="log-out-outline"
                    size={15}
                    color={COLORS.danger}
                  />

                  <Text style={styles.logoutAllText}>Logout All</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* ERROR */}

          {error ? (
            <View style={styles.errorCard}>
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color={COLORS.danger}
              />

              <Text style={styles.errorText}>{error}</Text>

              <TouchableOpacity
                onPress={() => fetchSessions(page, true)}
                disabled={actionLoading}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* EMPTY */}

          {!error && sessions.length === 0 ? (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="desktop-outline"
                  size={30}
                  color={COLORS.light}
                />
              </View>

              <Text style={styles.emptyTitle}>No sessions found</Text>

              <Text style={styles.emptySubtitle}>
                There are currently no sessions available for your account.
              </Text>
            </View>
          ) : null}

          {/* SESSION LIST */}

          {!error &&
            sessions.map((session, index) => (
              <SessionCard
                key={session.id ?? session.session_id ?? index}
                session={session}
                parseUserAgent={parseUserAgent}
                getBrowserIcon={getBrowserIcon}
                getOSIcon={getOSIcon}
                isActive={isActive}
                formatDate={formatDate}
                onLogout={handleLogout}
                disabled={actionLoading}
              />
            ))}

          {/* PAGINATION */}

          {!error && totalPages > 1 && (
            <View style={styles.pagination}>
              <TouchableOpacity
                style={[
                  styles.pageButton,
                  page === 1 && styles.disabledPageButton,
                ]}
                onPress={goPrevious}
                disabled={page === 1 || actionLoading}>
                <Ionicons
                  name="chevron-back"
                  size={16}
                  color={page === 1 ? '#B7B7B7' : COLORS.text}
                />

                <Text
                  style={[
                    styles.pageButtonText,
                    page === 1 && styles.disabledPageText,
                  ]}>
                  Prev
                </Text>
              </TouchableOpacity>

              <View style={styles.pageIndicator}>
                <Text style={styles.pageCurrent}>{page}</Text>

                <Text style={styles.pageSlash}>/</Text>

                <Text style={styles.pageTotal}>{totalPages}</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.pageButton,
                  page >= totalPages && styles.disabledPageButton,
                ]}
                onPress={goNext}
                disabled={page >= totalPages || actionLoading}>
                <Text
                  style={[
                    styles.pageButtonText,
                    page >= totalPages && styles.disabledPageText,
                  ]}>
                  Next
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={page >= totalPages ? '#B7B7B7' : COLORS.text}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* INFO */}

          <View style={styles.infoCard}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={COLORS.primary}
            />

            <Text style={styles.infoText}>
              If you see a device or session you do not recognize, logout that
              session immediately and change your password.
            </Text>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

/*
|--------------------------------------------------------------------------
| SESSION CARD
|--------------------------------------------------------------------------
*/

function SessionCard({
  session,
  parseUserAgent,
  getBrowserIcon,
  getOSIcon,
  isActive,
  formatDate,
  onLogout,
  disabled,
}) {
  const info = parseUserAgent(session?.user_agent);

  const active = isActive(session?.expires_at);

  const current = Boolean(session?.is_current);

  const browserIcon = getBrowserIcon(info.browser);

  const osIcon = getOSIcon(info.os);

  return (
    <View style={styles.sessionCard}>
      {/* DEVICE ICON */}

      <View style={[styles.deviceIcon, current && styles.deviceIconCurrent]}>
        <Ionicons
          name={browserIcon}
          size={21}
          color={current ? COLORS.primary : '#777777'}
        />
      </View>

      {/* CONTENT */}

      <View style={styles.sessionContent}>
        {/* DEVICE NAME */}

        <View style={styles.deviceTopRow}>
          <View style={styles.deviceTitleContainer}>
            <Text style={styles.deviceTitle} numberOfLines={1}>
              {info.browser}
              {' • '}
              {info.os}
            </Text>

            <Text style={styles.deviceType}>{info.device}</Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              active ? styles.activeBadge : styles.expiredBadge,
            ]}>
            <View
              style={[
                styles.statusDot,
                active ? styles.activeDot : styles.expiredDot,
              ]}
            />

            <Text
              style={[
                styles.statusText,
                active ? styles.activeText : styles.expiredText,
              ]}>
              {active ? 'Active' : 'Expired'}
            </Text>
          </View>
        </View>

        {/* IP */}

        <View style={styles.detailRow}>
          <Ionicons name="globe-outline" size={12} color={COLORS.light} />

          <Text style={styles.detailText} numberOfLines={1}>
            IP: {session?.ip_address || '-'}
          </Text>
        </View>

        {/* LOGIN DATE */}

        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={12} color={COLORS.light} />

          <Text style={styles.detailText}>
            Login At: {formatDate(session?.created_at)}
          </Text>
        </View>

        {/* OS */}

        <View style={styles.detailRow}>
          <Ionicons name={osIcon} size={12} color={COLORS.light} />

          <Text style={styles.detailText}>
            {info.os} • {info.device}
          </Text>
        </View>

        {/* ACTION */}

        {active ? (
          current ? (
            <View style={styles.currentDevice}>
              <View style={styles.currentDot} />

              <Text style={styles.currentDeviceText}>This Device</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => onLogout(session)}
              disabled={disabled}
              activeOpacity={0.8}>
              <Ionicons
                name="log-out-outline"
                size={14}
                color={COLORS.danger}
              />

              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          )
        ) : null}
      </View>
    </View>
  );
}

/*
|--------------------------------------------------------------------------
| STYLES
|--------------------------------------------------------------------------
*/

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 11,
    color: COLORS.secondary,
  },

  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  backButton: {
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: '#F8F7F5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },

  headerSpacer: {
    width: 39,
  },

  content: {
    padding: 12,
    paddingBottom: 30,
  },

  securityBanner: {
    padding: 13,
    borderRadius: 15,
    backgroundColor: COLORS.successLight,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  securityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#DFF1E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  securityText: {
    flex: 1,
  },

  bannerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.success,
  },

  bannerSubtitle: {
    marginTop: 3,
    fontSize: 9,
    lineHeight: 14,
    color: '#4F745E',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
    paddingHorizontal: 1,
  },

  sectionTitleContainer: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },

  sectionSubtitle: {
    marginTop: 1,
    fontSize: 8.5,
    color: COLORS.secondary,
  },

  logoutAllButton: {
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: COLORS.dangerLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },

  logoutAllText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.danger,
  },

  errorCard: {
    padding: 11,
    borderRadius: 12,
    backgroundColor: COLORS.dangerLight,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  errorText: {
    flex: 1,
    marginHorizontal: 7,
    fontSize: 9.5,
    color: COLORS.danger,
  },

  retryText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: COLORS.danger,
    textDecorationLine: 'underline',
  },

  sessionCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    padding: 11,
    marginBottom: 7,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  deviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F2F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  deviceIconCurrent: {
    backgroundColor: COLORS.primaryLight,
  },

  sessionContent: {
    flex: 1,
    minWidth: 0,
  },

  deviceTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  deviceTitleContainer: {
    flex: 1,
    minWidth: 0,
    paddingRight: 7,
  },

  deviceTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.text,
  },

  deviceType: {
    marginTop: 1,
    fontSize: 8.5,
    color: COLORS.secondary,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },

  activeBadge: {
    backgroundColor: COLORS.successLight,
  },

  expiredBadge: {
    backgroundColor: COLORS.dangerLight,
  },

  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 4,
  },

  activeDot: {
    backgroundColor: COLORS.success,
  },

  expiredDot: {
    backgroundColor: COLORS.danger,
  },

  statusText: {
    fontSize: 7.5,
    fontWeight: '700',
  },

  activeText: {
    color: COLORS.success,
  },

  expiredText: {
    color: COLORS.danger,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  detailText: {
    flex: 1,
    marginLeft: 4,
    fontSize: 8.5,
    color: COLORS.secondary,
  },

  currentDevice: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 9,
    backgroundColor: COLORS.successLight,
  },

  currentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
    marginRight: 5,
  },

  currentDeviceText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: COLORS.success,
  },

  logoutButton: {
    alignSelf: 'flex-start',
    marginTop: 7,
    paddingHorizontal: 8,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.dangerLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

  logoutButtonText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: COLORS.danger,
  },

  emptyCard: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
  },

  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F2F0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },

  emptySubtitle: {
    marginTop: 5,
    fontSize: 9,
    color: COLORS.secondary,
    textAlign: 'center',
  },

  pagination: {
    marginTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  pageButton: {
    minWidth: 74,
    height: 35,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingHorizontal: 8,
  },

  disabledPageButton: {
    backgroundColor: '#F3F2F0',
  },

  pageButtonText: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.text,
  },

  disabledPageText: {
    color: '#B7B7B7',
  },

  pageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pageCurrent: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },

  pageSlash: {
    marginHorizontal: 4,
    fontSize: 9,
    color: COLORS.light,
  },

  pageTotal: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.secondary,
  },

  infoCard: {
    marginTop: 13,
    padding: 11,
    borderRadius: 13,
    backgroundColor: COLORS.primaryLight,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  infoText: {
    flex: 1,
    marginLeft: 7,
    fontSize: 8.8,
    lineHeight: 14,
    color: COLORS.primaryDark,
  },
});
