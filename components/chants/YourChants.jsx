import { useAuth } from '@/context/AuthContext';
import chantServices from '@/lib/services/chantServices';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const COLORS = {
  primary: '#6E3F1F',
  primaryDark: '#432412',
  secondary: '#A8692D',

  cream: '#FFF8EF',
  creamDark: '#F4E6D5',

  gold: '#D9A35D',
  goldLight: '#F2D19D',

  white: '#FFFFFF',

  text: '#382418',
  muted: '#866F61',

  border: '#EBDCCD',

  red: '#B34D3C',
  green: '#62835A',
};

const YourChants = () => {
  /*
  |--------------------------------------------------------------------------
  | AUTH CONTEXT
  |--------------------------------------------------------------------------
  */

  const { access_token, isAuthenticated, loading: authLoading } = useAuth();

  /*
  |--------------------------------------------------------------------------
  | LOCAL STATE
  |--------------------------------------------------------------------------
  */

  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState('');

  /*
  |--------------------------------------------------------------------------
  | FETCH STATS
  |--------------------------------------------------------------------------
  */

  const fetchStats = useCallback(
    async (isRefreshing = false) => {
      if (!access_token) {
        setLoading(false);
        return;
      }

      try {
        if (isRefreshing) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError('');

        const response = await chantServices.getOneMinuteStats(access_token);

        console.log('[YourChants] Stats response:', response);

        /*
        Expected response:

        {
          success: true,
          status: 200,
          data: {
            status: true,
            year: 2026,

            global_total: 1,
            user_total: 1,

            today: 1,
            last_7_days: 1,
            last_30_days: 1,

            weekly: [],
            monthly: [],
            yearly: [],

            streak: {
              status: true,
              current_streak: 1,
              longest_streak: 1
            }
          }
        }
        */

        const data = response?.data;

        if (response?.success && data?.status) {
          setStats(data);
          return;
        }

        /*
        Sometimes apiRequest may still contain
        response.data correctly even if wrapper
        structure differs.
        */

        if (data?.status) {
          setStats(data);
          return;
        }

        setError(response?.error || 'Unable to load chanting statistics.');
      } catch (err) {
        console.error('[YourChants] Stats error:', err);

        setError(err?.message || 'Unable to load chanting statistics.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [access_token],
  );

  /*
  |--------------------------------------------------------------------------
  | INITIAL FETCH
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (access_token) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [authLoading, access_token, fetchStats]);

  /*
  |--------------------------------------------------------------------------
  | AUTH LOADING
  |--------------------------------------------------------------------------
  */

  if (authLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />

        <Text style={styles.loadingText}>Checking your account...</Text>
      </View>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | NOT LOGGED IN
  |--------------------------------------------------------------------------
  */

  if (!isAuthenticated || !access_token) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.loginCard}>
          <View style={styles.loginIcon}>
            <Ionicons name="person-outline" size={25} color={COLORS.primary} />
          </View>

          <Text style={styles.loginTitle}>Your Chant Journey</Text>

          <Text style={styles.loginDescription}>
            Sign in to view your chanting progress, activity and streak.
          </Text>
        </View>
      </View>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | DATA LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.loaderIcon}>
          <Text style={styles.loaderOm}>ॐ</Text>
        </View>

        <ActivityIndicator size="small" color={COLORS.primary} />

        <Text style={styles.loadingText}>Loading your chants...</Text>
      </View>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  if (error && !stats) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.errorCard}>
          <View style={styles.errorIcon}>
            <Ionicons
              name="alert-circle-outline"
              size={27}
              color={COLORS.red}
            />
          </View>

          <Text style={styles.errorTitle}>Unable to load chants</Text>

          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | VALUES
  |--------------------------------------------------------------------------
  */

  const year = stats?.year || new Date().getFullYear();

  const userTotal = Number(stats?.user_total) || 0;

  const globalTotal = Number(stats?.global_total) || 0;

  const today = Number(stats?.today) || 0;

  const last7Days = Number(stats?.last_7_days) || 0;

  const last30Days = Number(stats?.last_30_days) || 0;

  const currentStreak = Number(stats?.streak?.current_streak) || 0;

  const longestStreak = Number(stats?.streak?.longest_streak) || 0;

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => fetchStats(true)}
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
        />
      }>
      {/* HEADER */}

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Your Chants</Text>

            <Text style={styles.subtitle}>One minute chant journey</Text>
          </View>
        </View>

        <View style={styles.yearCapsule}>
          <Ionicons
            name="calendar-outline"
            size={12}
            color={COLORS.goldLight}
          />

          <Text style={styles.yearText}>{year}</Text>
        </View>
      </View>

      {/* HERO */}

      <View style={styles.heroCard}>
        <View style={styles.heroCircleOne} />

        <View style={styles.heroCircleTwo} />

        <View style={styles.heroTop}>
          <View style={styles.heroLabelCapsule}>
            <Ionicons
              name="sparkles-outline"
              size={13}
              color={COLORS.goldLight}
            />

            <Text style={styles.heroLabel}>YOUR TOTAL CHANTS</Text>
          </View>
        </View>

        <Text style={styles.heroNumber}>{userTotal.toLocaleString()}</Text>

        <Text style={styles.heroDescription}>One Minute Chants Completed</Text>

        <View style={styles.heroDivider} />

        <View style={styles.communityRow}>
          <View style={styles.communityIcon}>
            <Ionicons
              name="people-outline"
              size={19}
              color={COLORS.goldLight}
            />
          </View>

          <View style={styles.communityContent}>
            <Text style={styles.communityTitle}>Global Community</Text>

            <Text style={styles.communitySubtitle}>Total chants together</Text>
          </View>

          <View style={styles.globalCapsule}>
            <Text style={styles.globalNumber}>
              {globalTotal.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* ACTIVITY */}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionMiniTitle}>YOUR ACTIVITY</Text>

        <Text style={styles.sectionTitle}>Chant Progress</Text>
      </View>

      <View style={styles.statsContainer}>
        <StatCapsule
          icon="sunny-outline"
          label="Today"
          description="Chants completed today"
          value={today}
          iconBackground="#FFF0D5"
          iconColor="#B87316"
        />

        <StatCapsule
          icon="calendar-outline"
          label="Last 7 Days"
          description="Your weekly chanting"
          value={last7Days}
          iconBackground="#F2E5D7"
          iconColor={COLORS.primary}
        />

        <StatCapsule
          icon="calendar-number-outline"
          label="Last 30 Days"
          description="Your monthly chanting"
          value={last30Days}
          iconBackground="#F8E3DA"
          iconColor="#A75838"
        />
      </View>

      {/* STREAK HEADER */}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionMiniTitle}>CONSISTENCY</Text>

        <Text style={styles.sectionTitle}>Chanting Streak</Text>
      </View>

      {/* STREAK CAPSULE */}

      <View style={styles.streakCapsule}>
        <View style={styles.streakSection}>
          <View style={styles.streakIcon}>
            <Text style={styles.fireEmoji}>🔥</Text>
          </View>

          <View>
            <Text style={styles.streakLabel}>Current Streak</Text>

            <View style={styles.streakValueRow}>
              <Text style={styles.streakNumber}>{currentStreak}</Text>

              <Text style={styles.streakUnit}>
                {currentStreak === 1 ? 'day' : 'days'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.streakVerticalLine} />

        <View style={[styles.streakSection, styles.streakSectionRight]}>
          <View style={styles.streakIcon}>
            <Ionicons name="trophy-outline" size={22} color={COLORS.gold} />
          </View>

          <View>
            <Text style={styles.streakLabel}>Best Streak</Text>

            <View style={styles.streakValueRow}>
              <Text style={styles.streakNumber}>{longestStreak}</Text>

              <Text style={styles.streakUnit}>
                {longestStreak === 1 ? 'day' : 'days'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* SUMMARY CAPSULE */}

      <View style={styles.summaryCapsule}>
        <View style={styles.summaryIcon}>
          <Text style={styles.summaryEmoji}>🪷</Text>
        </View>

        <View style={styles.summaryContent}>
          <Text style={styles.summaryTitle}>Keep chanting every day</Text>

          <Text style={styles.summaryText}>
            A little consistency every day creates a beautiful spiritual
            journey.
          </Text>
        </View>

        <Ionicons name="sparkles" size={18} color={COLORS.gold} />
      </View>
    </ScrollView>
  );
};

/*
|--------------------------------------------------------------------------
| STAT CAPSULE
|--------------------------------------------------------------------------
*/

const StatCapsule = ({
  icon,
  label,
  description,
  value,
  iconBackground,
  iconColor,
}) => {
  return (
    <View style={styles.statCapsule}>
      <View
        style={[
          styles.statIcon,
          {
            backgroundColor: iconBackground,
          },
        ]}>
        <Ionicons name={icon} size={21} color={iconColor} />
      </View>

      <View style={styles.statContent}>
        <Text style={styles.statLabel}>{label}</Text>

        <Text style={styles.statDescription}>{description}</Text>
      </View>

      <View style={styles.statValueCapsule}>
        <Text style={styles.statValue}>
          {Number(value || 0).toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

/*
|--------------------------------------------------------------------------
| STYLES
|--------------------------------------------------------------------------
*/

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: COLORS.cream,
  },

  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 35,
  },

  wrapper: {
    backgroundColor: COLORS.cream,
    padding: 16,
  },

  centerContainer: {
    minHeight: 250,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cream,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 12,
    color: COLORS.muted,
  },

  loaderIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.creamDark,
    marginBottom: 12,
  },

  loaderOm: {
    fontSize: 27,
    color: COLORS.primary,
  },

  /*
  |--------------------------------------------------------------------------
  | HEADER
  |--------------------------------------------------------------------------
  */

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.creamDark,
    marginRight: 10,
  },

  headerOm: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.primary,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primaryDark,
    letterSpacing: -0.4,
  },

  subtitle: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
  },

  yearCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,

    paddingHorizontal: 12,
    paddingVertical: 8,

    borderRadius: 100,

    backgroundColor: COLORS.primary,
  },

  yearText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
  },

  /*
  |--------------------------------------------------------------------------
  | HERO
  |--------------------------------------------------------------------------
  */

  heroCard: {
    position: 'relative',

    overflow: 'hidden',

    borderRadius: 28,

    backgroundColor: COLORS.primary,

    paddingHorizontal: 20,
    paddingVertical: 20,

    marginBottom: 27,

    shadowColor: COLORS.primaryDark,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,

    elevation: 6,
    alignItems: 'center',
  },

  heroCircleOne: {
    position: 'absolute',

    width: 180,
    height: 180,

    borderRadius: 100,

    backgroundColor: 'rgba(255,255,255,0.05)',

    top: -80,
    right: -65,
  },

  heroCircleTwo: {
    position: 'absolute',

    width: 130,
    height: 130,

    borderRadius: 100,

    backgroundColor: 'rgba(255,204,130,0.05)',

    bottom: -55,
    left: -40,
  },

  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  heroLabelCapsule: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 5,

    paddingHorizontal: 11,
    paddingVertical: 7,

    borderRadius: 100,

    backgroundColor: 'rgba(255,255,255,0.12)',
  },

  heroLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,

    color: COLORS.goldLight,
  },

  heroOm: {
    width: 39,
    height: 39,

    borderRadius: 20,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  heroOmText: {
    fontSize: 21,
    color: COLORS.goldLight,
  },

  heroNumber: {
    fontSize: 48,
    lineHeight: 57,

    fontWeight: '800',

    letterSpacing: -1,

    color: COLORS.white,

    marginTop: 13,
  },

  heroDescription: {
    fontSize: 12,
    color: '#EAD8C8',
  },

  heroDivider: {
    height: 1,

    backgroundColor: 'rgba(255,255,255,0.13)',

    marginVertical: 18,
  },

  communityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  communityIcon: {
    width: 40,
    height: 40,

    borderRadius: 14,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(255,255,255,0.10)',

    marginRight: 10,
  },

  communityContent: {
    flex: 1,
  },

  communityTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },

  communitySubtitle: {
    fontSize: 10,

    color: '#CFB6A6',

    marginTop: 2,
  },

  globalCapsule: {
    paddingHorizontal: 13,
    paddingVertical: 8,

    borderRadius: 100,

    backgroundColor: 'rgba(255,255,255,0.10)',
  },

  globalNumber: {
    fontSize: 18,
    fontWeight: '800',

    color: COLORS.goldLight,
  },

  /*
  |--------------------------------------------------------------------------
  | SECTION HEADER
  |--------------------------------------------------------------------------
  */

  sectionHeader: {
    marginBottom: 12,
  },

  sectionMiniTitle: {
    fontSize: 9,
    fontWeight: '800',

    letterSpacing: 1.4,

    color: COLORS.secondary,

    marginBottom: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',

    color: COLORS.text,
  },

  /*
  |--------------------------------------------------------------------------
  | STAT CAPSULES
  |--------------------------------------------------------------------------
  */

  statsContainer: {
    gap: 10,
    marginBottom: 27,
  },

  statCapsule: {
    minHeight: 67,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: COLORS.white,

    paddingHorizontal: 11,
    paddingVertical: 10,

    borderRadius: 22,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,

    elevation: 2,
  },

  statIcon: {
    width: 44,
    height: 44,

    borderRadius: 16,

    alignItems: 'center',
    justifyContent: 'center',
  },

  statContent: {
    flex: 1,
    marginHorizontal: 11,
  },

  statLabel: {
    fontSize: 13,
    fontWeight: '700',

    color: COLORS.text,
  },

  statDescription: {
    fontSize: 10,

    color: COLORS.muted,

    marginTop: 2,
  },

  statValueCapsule: {
    minWidth: 58,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 12,
    paddingVertical: 9,

    borderRadius: 100,

    backgroundColor: COLORS.cream,
  },

  statValue: {
    fontSize: 17,
    fontWeight: '800',

    color: COLORS.primary,
  },

  /*
  |--------------------------------------------------------------------------
  | STREAK
  |--------------------------------------------------------------------------
  */

  streakCapsule: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: COLORS.white,

    borderRadius: 24,

    padding: 13,

    marginBottom: 22,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,

    elevation: 2,
  },

  streakSection: {
    flex: 1,

    flexDirection: 'row',
    alignItems: 'center',
  },

  streakSectionRight: {
    paddingLeft: 10,
  },

  streakIcon: {
    width: 43,
    height: 43,

    borderRadius: 16,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: COLORS.creamDark,

    marginRight: 9,
  },

  fireEmoji: {
    fontSize: 22,
  },

  streakLabel: {
    fontSize: 10,

    color: COLORS.muted,
  },

  streakValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',

    gap: 3,

    marginTop: 1,
  },

  streakNumber: {
    fontSize: 22,
    fontWeight: '800',

    color: COLORS.primaryDark,
  },

  streakUnit: {
    fontSize: 10,
    color: COLORS.muted,
  },

  streakVerticalLine: {
    width: 1,
    height: 38,

    backgroundColor: COLORS.border,
  },

  /*
  |--------------------------------------------------------------------------
  | SUMMARY
  |--------------------------------------------------------------------------
  */

  summaryCapsule: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: 12,

    borderRadius: 22,

    backgroundColor: COLORS.creamDark,

    marginBottom: 10,
  },

  summaryIcon: {
    width: 43,
    height: 43,

    borderRadius: 15,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: COLORS.white,

    marginRight: 10,
  },

  summaryEmoji: {
    fontSize: 21,
  },

  summaryContent: {
    flex: 1,
    paddingRight: 8,
  },

  summaryTitle: {
    fontSize: 12,
    fontWeight: '800',

    color: COLORS.primary,
  },

  summaryText: {
    fontSize: 9.5,

    lineHeight: 14,

    color: COLORS.muted,

    marginTop: 2,
  },

  /*
  |--------------------------------------------------------------------------
  | LOGIN / ERROR
  |--------------------------------------------------------------------------
  */

  loginCard: {
    backgroundColor: COLORS.white,

    borderRadius: 24,

    padding: 25,

    alignItems: 'center',

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  loginIcon: {
    width: 52,
    height: 52,

    borderRadius: 20,

    backgroundColor: COLORS.creamDark,

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 10,
  },

  loginTitle: {
    fontSize: 16,
    fontWeight: '800',

    color: COLORS.text,
  },

  loginDescription: {
    fontSize: 11,

    lineHeight: 17,

    color: COLORS.muted,

    textAlign: 'center',

    marginTop: 5,

    maxWidth: 270,
  },

  errorCard: {
    backgroundColor: '#FFF3F0',

    borderRadius: 23,

    padding: 22,

    alignItems: 'center',
  },

  errorIcon: {
    width: 50,
    height: 50,

    borderRadius: 18,

    backgroundColor: '#FFE5DF',

    alignItems: 'center',
    justifyContent: 'center',
  },

  errorTitle: {
    fontSize: 15,
    fontWeight: '800',

    color: COLORS.red,

    marginTop: 9,
  },

  errorText: {
    fontSize: 11,

    lineHeight: 16,

    color: COLORS.muted,

    textAlign: 'center',

    marginTop: 4,
  },
});

export default YourChants;
