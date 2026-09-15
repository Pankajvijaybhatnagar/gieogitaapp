import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import chantServices from '@/lib/services/chantServices';

// ─────────────────────────────────────────────────────────────────────────────
// YOUR Path PROGRESS
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

import { COLORS, RGB } from '@/constants/brandColors';
import { hairline, radii, shadow } from '@/constants/theme';

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
// YOUR Path
// ─────────────────────────────────────────────────────────────────────────────

export function YourPath() {
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

      console.log('[YourPath] Fetching user Path stats...');

      const response = await chantServices.getOneMinuteStats(access_token);

      console.log('[YourPath] Stats response:', response);

      if (response?.success === false) {
        setStats(null);
        return;
      }

      setStats(response);
      console.log('[YourPath] Stats response:', response);
    } catch (error) {
      console.error('[YourPath] Stats fetch failed:', error);

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

  const totalPath = stats?.user_total ?? 0;

  const monthProgress = stats?.last_30_days ?? 0;

  const weekProgress = stats?.last_7_days ?? 0;

  // ───────────────────────────────────────────────────────────────────────────
  // UI
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <View style={styles.wrapper}>
      <SectionLabel text="YOUR Path PROGRESS" />

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* LOADING */}
      {/* ───────────────────────────────────────────────────────────────────── */}

      {statsLoading && !stats ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.saffron} />

          <Text style={styles.loadingText}>Loading your progress...</Text>
        </View>
      ) : (
        <View style={styles.row}>
          {/* ───────────────────────────────────────────────────────────────── */}
          {/* TOTAL */}
          {/* ───────────────────────────────────────────────────────────────── */}

          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total{'\n'}Path</Text>

            <View style={styles.totalDivider} />

            <Text style={styles.totalNumber}>{totalPath}</Text>

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
                <Text style={styles.progressLabel}>Month Path</Text>

                <Text style={styles.progressNumber}>{monthProgress}</Text>
              </View>
            </View>

            {/* WEEK */}
            <View style={styles.progressCard}>
              <View style={styles.progressIconBox}>
                <Text style={styles.progressIcon}>🗓️</Text>
              </View>

              <View style={styles.progressTextCol}>
                <Text style={styles.progressLabel}>Week Path</Text>

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
    backgroundColor: COLORS.cream,
    borderRadius: radii.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: hairline,
    ...shadow.card,
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
    backgroundColor: hairline,
  },
  sectionLabelText: {
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: '600',
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
    backgroundColor: COLORS.richBrown,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalLabel: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    color: COLORS.cream,
    textAlign: 'center',
  },
  totalDivider: {
    width: 32,
    height: 1,
    backgroundColor: COLORS.gold,
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
    backgroundColor: COLORS.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: hairline,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 8,
    shadowOpacity: 0.045,
    elevation: 2,
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
    backgroundColor: `rgba(${RGB.gold},0.13)`,
    borderWidth: 1,
    borderColor: `rgba(${RGB.gold},0.25)`,
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
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.warmBrown,
    marginBottom: 2,
  },
  progressNumber: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '900',
    color: COLORS.goldDark,
  },
  // ───────────────────────────────────────────────────────────────────────────
  // LOADING
  // ───────────────────────────────────────────────────────────────────────────

  loadingContainer: {
    minHeight: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.creamDark,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: hairline,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.warmBrown,
  },
});
