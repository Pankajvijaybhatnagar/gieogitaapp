import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import chantServices from '@/lib/services/chantServices';

// ─────────────────────────────────────────────────────────────────────────────
// YOUR PAATH PROGRESS
// Personal user statistics
//
// API:
// GET /chants/one-minute/stats
//
// Response:
// {
//   status: true,
//   year: 2026,
//   global_total: 0,
//   user_total: 0,
//   today: 0,
//   last_7_days: 0,
//   last_30_days: 0,
//   weekly: [],
//   monthly: [],
//   yearly: [],
//   streak: {
//     status: true,
//     current_streak: 0,
//     longest_streak: 0
//   }
// }
// ─────────────────────────────────────────────────────────────────────────────

const COLORS = {
  deepBrown: '#2C1A0A',
  warmBrown: '#4A2C0D',

  gold: '#C9A227',
  goldLight: '#E8C55A',
  goldDark: '#8B6914',

  cream: '#FDF6E3',
  creamDark: '#F5E6C8',

  saffron: '#E8721C',
  white: '#FFFFFF',
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION LABEL
// Kept local so this component does not depend on chants.jsx
// ─────────────────────────────────────────────────────────────────────────────

function SectionLabel({ text }) {
  return (
    <View style={styles.sectionLabelRow}>
      <View style={styles.sectionLabelLine} />

      <Text style={styles.sectionLabelText}>{text}</Text>

      <View style={styles.sectionLabelLine} />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// YOUR PAATH
// ─────────────────────────────────────────────────────────────────────────────

export function YourPaath() {
  // ───────────────────────────────────────────────────────────────────────────
  // AUTH
  // ───────────────────────────────────────────────────────────────────────────

  const { access_token, isAuthenticated, loading: authLoading } = useAuth();

  // ───────────────────────────────────────────────────────────────────────────
  // STATS
  // ───────────────────────────────────────────────────────────────────────────

  const [stats, setStats] = useState(null);

  const [statsLoading, setStatsLoading] = useState(false);

  // ───────────────────────────────────────────────────────────────────────────
  // FETCH USER STATS
  // ───────────────────────────────────────────────────────────────────────────

  const fetchStats = async () => {
    if (!access_token || !isAuthenticated) {
      return;
    }

    try {
      setStatsLoading(true);

      console.log('[YourPaath] Fetching user paath stats...');

      const response = await chantServices.getOneMinuteStats(access_token);

      console.log('[YourPaath] Stats response:', response);

      if (response?.success === false) {
        setStats(null);
        return;
      }

      setStats(response);
      console.log('[YourPaath] Stats response:', response);
    } catch (error) {
      console.error('[YourPaath] Stats fetch failed:', error);

      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // LOAD STATS WHEN USER IS LOGGED IN
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!authLoading && isAuthenticated && access_token) {
      fetchStats();
    }
  }, [authLoading, isAuthenticated, access_token]);

  // ───────────────────────────────────────────────────────────────────────────
  // IMPORTANT
  //
  // User requested:
  // "show nothing if user is not logged in"
  //
  // Therefore we return null.
  // ───────────────────────────────────────────────────────────────────────────

  if (authLoading) {
    return null;
  }

  if (!isAuthenticated || !access_token) {
    return null;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // API VALUES
  // ───────────────────────────────────────────────────────────────────────────

  const totalPaath = stats?.user_total ?? 0;

  const monthProgress = stats?.last_30_days ?? 0;

  const weekProgress = stats?.last_7_days ?? 0;

  // ───────────────────────────────────────────────────────────────────────────
  // UI
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <View style={styles.wrapper}>
      <SectionLabel text="YOUR PAATH PROGRESS" />

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* LOADING */}
      {/* ───────────────────────────────────────────────────────────────────── */}

      {statsLoading && !stats ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.goldLight} />

          <Text style={styles.loadingText}>Loading your progress...</Text>
        </View>
      ) : (
        <View style={styles.row}>
          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TOTAL */}
          {/* ───────────────────────────────────────────────────────────────── */}

          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total{'\n'}Paath</Text>

            <View style={styles.totalDivider} />

            <Text style={styles.totalNumber}>{totalPaath}</Text>

            <Text style={styles.totalIcon}>📖</Text>
          </View>

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* MONTH + WEEK */}
          {/* ───────────────────────────────────────────────────────────────── */}

          <View style={styles.progressCol}>
            {/* MONTH */}
            <View style={styles.progressCard}>
              <View style={styles.progressIconBox}>
                <Text style={styles.progressIcon}>📅</Text>
              </View>

              <View style={styles.progressTextCol}>
                <Text style={styles.progressLabel}>Month Paath</Text>

                <Text style={styles.progressNumber}>{monthProgress}</Text>
              </View>
            </View>

            {/* WEEK */}
            <View style={styles.progressCard}>
              <View style={styles.progressIconBox}>
                <Text style={styles.progressIcon}>🗓️</Text>
              </View>

              <View style={styles.progressTextCol}>
                <Text style={styles.progressLabel}>Week Paath</Text>

                <Text style={styles.progressNumber}>{weekProgress}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // ───────────────────────────────────────────────────────────────────────────
  // WRAPPER
  // ───────────────────────────────────────────────────────────────────────────

  wrapper: {
    marginHorizontal: 16,

    backgroundColor: COLORS.warmBrown,

    borderRadius: 20,

    padding: 18,

    borderWidth: 1,
    borderColor: 'rgba(201,162,39,0.35)',

    overflow: 'hidden',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // SECTION LABEL
  // ───────────────────────────────────────────────────────────────────────────

  sectionLabelRow: {
    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 14,
  },

  sectionLabelLine: {
    flex: 1,

    height: 1,

    backgroundColor: COLORS.goldDark,

    opacity: 0.3,
  },

  sectionLabelText: {
    fontSize: 9,

    letterSpacing: 2,

    fontWeight: '800',

    color: COLORS.goldDark,

    marginHorizontal: 10,

    textAlign: 'center',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // MAIN ROW
  // ───────────────────────────────────────────────────────────────────────────

  row: {
    flexDirection: 'row',

    alignItems: 'stretch',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // TOTAL BOX
  // ───────────────────────────────────────────────────────────────────────────

  totalBox: {
    width: 105,

    minHeight: 150,

    backgroundColor: COLORS.deepBrown,

    borderRadius: 16,

    borderWidth: 1.5,

    borderColor: COLORS.gold,

    paddingVertical: 14,
    paddingHorizontal: 10,

    alignItems: 'center',

    justifyContent: 'center',
  },

  totalLabel: {
    fontSize: 12,

    lineHeight: 16,

    fontWeight: '800',

    color: COLORS.creamDark,

    textAlign: 'center',
  },

  totalDivider: {
    width: 32,

    height: 1,

    backgroundColor: COLORS.goldDark,

    marginVertical: 8,

    opacity: 0.8,
  },

  totalNumber: {
    fontSize: 34,

    lineHeight: 40,

    fontWeight: '900',

    color: COLORS.goldLight,

    textAlign: 'center',
  },

  totalIcon: {
    fontSize: 22,

    marginTop: 6,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // MONTH / WEEK COLUMN
  // ───────────────────────────────────────────────────────────────────────────

  progressCol: {
    flex: 1,

    marginLeft: 12,

    justifyContent: 'space-between',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // PROGRESS CARD
  // ───────────────────────────────────────────────────────────────────────────

  progressCard: {
    flex: 1,

    minHeight: 70,

    backgroundColor: 'rgba(201,162,39,0.08)',

    borderRadius: 14,

    borderWidth: 1,

    borderColor: 'rgba(201,162,39,0.22)',

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 10,

    marginBottom: 8,
  },

  progressCardLast: {
    marginBottom: 0,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // ICON BOX
  // ───────────────────────────────────────────────────────────────────────────

  progressIconBox: {
    width: 42,

    height: 42,

    borderRadius: 12,

    backgroundColor: 'rgba(201,162,39,0.13)',

    borderWidth: 1,

    borderColor: 'rgba(201,162,39,0.25)',

    alignItems: 'center',

    justifyContent: 'center',

    marginRight: 10,
  },

  progressIcon: {
    fontSize: 20,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // TEXT
  // ───────────────────────────────────────────────────────────────────────────

  progressTextCol: {
    flex: 1,
  },

  progressLabel: {
    fontSize: 11,

    fontWeight: '700',

    color: COLORS.creamDark,

    marginBottom: 2,
  },

  progressNumber: {
    fontSize: 24,

    lineHeight: 28,

    fontWeight: '900',

    color: COLORS.goldLight,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // LOADING
  // ───────────────────────────────────────────────────────────────────────────

  loadingContainer: {
    minHeight: 150,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: 'rgba(201,162,39,0.06)',

    borderRadius: 14,

    borderWidth: 1,

    borderColor: 'rgba(201,162,39,0.15)',
  },

  loadingText: {
    marginTop: 8,

    fontSize: 11,

    color: COLORS.creamDark,
  },
});
