import chantServices from '@/lib/services/chantServices';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
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
};

const AUTO_REFRESH_INTERVAL = 30000;

export function TotalPaath() {
  const [stats, setStats] = useState(null);
  const [displayed, setDisplayed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const displayedRef = useRef(0);
  const animationTimerRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const animateCount = useCallback(
    target => {
      const targetValue = Number(target) || 0;
      const startValue = displayedRef.current;
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
      if (startValue === targetValue) {
        setDisplayed(targetValue);
        displayedRef.current = targetValue;
        return;
      }
      const difference = targetValue - startValue;
      const duration = targetValue > startValue ? 1200 : 600;
      const stepTime = 5;
      const totalSteps = Math.ceil(duration / stepTime);
      const increment = difference / totalSteps;
      let step = 0;
      animationTimerRef.current = setInterval(() => {
        step++;
        let nextValue = Math.round(startValue + increment * step);
        if (step >= totalSteps) {
          nextValue = targetValue;
          clearInterval(animationTimerRef.current);
          animationTimerRef.current = null;
        }
        displayedRef.current = nextValue;
        setDisplayed(nextValue);
      }, stepTime);
      if (targetValue > startValue && startValue > 0) {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.spring(pulseAnim, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
          }),
        ]).start();
      }
    },
    [pulseAnim],
  );

  const fetchStats = useCallback(
    async (initial = false) => {
      try {
        if (initial) setLoading(true);
        setError('');
        const response = await chantServices.getOneMinutePublicStats(5);
        console.log('[TotalPaath] Public stats:', response);
        const data = response?.data;
        if (data?.status) {
          setStats(data);
          animateCount(data?.overall?.total_chants);
          return;
        }
        if (initial)
          setError(response?.error || 'Unable to load chant statistics.');
      } catch (err) {
        console.error('[TotalPaath] Error:', err);
        if (initial)
          setError(err?.message || 'Unable to load chant statistics.');
      } finally {
        if (initial) setLoading(false);
      }
    },
    [animateCount],
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  useEffect(() => {
    fetchStats(true);
    const interval = setInterval(() => {
      fetchStats(false);
    }, AUTO_REFRESH_INTERVAL);
    return () => {
      clearInterval(interval);
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    };
  }, [fetchStats]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading global chants...</Text>
      </View>
    );
  }

  if (error && !stats) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons
          name="alert-circle-outline"
          size={25}
          color={COLORS.primary}
        />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const currentYear = Number(stats?.current_year) || new Date().getFullYear();
  const yearly = Array.isArray(stats?.yearly) ? stats.yearly : [];
  const currentYearData = yearly.find(
    item => Number(item.year) === currentYear,
  );
  const lastYearData = yearly.find(
    item => Number(item.year) === currentYear - 1,
  );
  const overallUsers = Number(stats?.overall?.total_users) || 0;
  const currentYearChants = Number(currentYearData?.total_chants) || 0;
  const currentYearUsers = Number(currentYearData?.total_users) || 0;
  const lastYearChants = Number(lastYearData?.total_chants) || 0;
  const lastYearUsers = Number(lastYearData?.total_users) || 0;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}>
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.topRow}>
        <View>
          <Text style={styles.eyebrow}>🕉️ EK MIN EK SAATH</Text>
          <Text style={styles.label}>Global Gita Paath</Text>
        </View>
        <View style={styles.liveCapsule}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      <View style={styles.countBox}>
        <Text style={styles.countLabel}>TOTAL CHANTS</Text>
        <Animated.Text
          style={[styles.countText, { transform: [{ scale: pulseAnim }] }]}>
          {displayed.toLocaleString()}
        </Animated.Text>
        <Text style={styles.subText}>Verses recited together worldwide 🙏</Text>
      </View>

      <View style={styles.peopleRow}>
        <View style={styles.peopleIcon}>
          <Ionicons name="people" size={20} color={COLORS.goldLight} />
        </View>
        <View style={styles.peopleContent}>
          <Text style={styles.peopleLabel}>Total Participants</Text>
          <Text style={styles.peopleDescription}>
            Unique devotees who joined
          </Text>
        </View>
        <Text style={styles.peopleValue}>{overallUsers.toLocaleString()}</Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionMiniTitle}>YEARLY JOURNEY</Text>

      <View style={styles.yearCards}>
        <View style={styles.yearCard}>
          <View style={styles.yearHeader}>
            <View style={styles.calendarIcon}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.year}>{currentYear}</Text>
          </View>
          <Text style={styles.yearCardLabel}>Chants</Text>
          <Text style={styles.yearChants}>
            {currentYearChants.toLocaleString()}
          </Text>
          <View style={styles.yearUserRow}>
            <Ionicons name="people-outline" size={13} color={COLORS.muted} />
            <Text style={styles.yearUsers}>
              {currentYearUsers.toLocaleString()} participants
            </Text>
          </View>
        </View>

        <View style={styles.yearCard}>
          <View style={styles.yearHeader}>
            <View style={styles.calendarIcon}>
              <Ionicons name="time-outline" size={16} color={COLORS.primary} />
            </View>
            <Text style={styles.year}>{currentYear - 1}</Text>
          </View>
          <Text style={styles.yearCardLabel}>Chants</Text>
          <Text style={styles.yearChants}>
            {lastYearChants.toLocaleString()}
          </Text>
          <View style={styles.yearUserRow}>
            <Ionicons name="people-outline" size={13} color={COLORS.muted} />
            <Text style={styles.yearUsers}>
              {lastYearUsers.toLocaleString()} participants
            </Text>
          </View>
        </View>
      </View>

      {yearly.length > 0 && (
        <View style={styles.historyBox}>
          <View style={styles.historyTitleRow}>
            <Text style={styles.historyTitle}>
              Last {stats?.years_count || 5} Years
            </Text>
            <Ionicons
              name="stats-chart-outline"
              size={17}
              color={COLORS.goldLight}
            />
          </View>
          {yearly.map((item, index) => (
            <View
              key={item.year}
              style={[
                styles.historyRow,
                index === yearly.length - 1 && styles.historyRowLast,
              ]}>
              <Text style={styles.historyYear}>{item.year}</Text>
              <View style={styles.historyData}>
                <Text style={styles.historyChants}>
                  {Number(item.total_chants || 0).toLocaleString()} chants
                </Text>
                <Text style={styles.historyUsers}>
                  {Number(item.total_users || 0).toLocaleString()} participants
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  bgCircle1: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
    right: -75,
    top: -85,
  },
  bgCircle2: {
    position: 'absolute',
    width: 145,
    height: 145,
    borderRadius: 100,
    backgroundColor: 'rgba(255,204,130,0.05)',
    left: -50,
    bottom: -45,
  },
  loadingContainer: {
    minHeight: 190,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cream,
  },
  loadingText: { fontSize: 11, color: COLORS.muted, marginTop: 8 },
  errorContainer: {
    margin: 16,
    padding: 20,
    borderRadius: 20,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    gap: 7,
  },
  errorText: { fontSize: 12, color: COLORS.muted, textAlign: 'center' },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.1,
    color: COLORS.goldLight,
  },
  label: { fontSize: 20, fontWeight: '800', color: COLORS.white, marginTop: 3 },
  liveCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.11)',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 100,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.goldLight,
  },
  liveText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
    color: COLORS.goldLight,
  },
  countBox: { marginTop: 18 },
  countLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#D8BEAC',
  },
  countText: {
    fontSize: 43,
    lineHeight: 52,
    fontWeight: '900',
    letterSpacing: -1,
    color: COLORS.white,
  },
  subText: { fontSize: 10, color: '#D8BEAC' },
  peopleRow: {
    marginTop: 17,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 10,
    borderRadius: 17,
  },
  peopleIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  peopleContent: { flex: 1, marginLeft: 10 },
  peopleLabel: { fontSize: 11, fontWeight: '700', color: COLORS.white },
  peopleDescription: { fontSize: 9, color: '#CFB6A6', marginTop: 1 },
  peopleValue: { fontSize: 18, fontWeight: '900', color: COLORS.goldLight },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginVertical: 17,
  },
  sectionMiniTitle: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.3,
    color: COLORS.goldLight,
    marginBottom: 9,
  },
  yearCards: { flexDirection: 'row', gap: 9 },
  yearCard: {
    flex: 1,
    backgroundColor: COLORS.cream,
    borderRadius: 19,
    padding: 12,
  },
  yearHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 10,
  },
  calendarIcon: {
    width: 29,
    height: 29,
    borderRadius: 10,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  year: { fontSize: 13, fontWeight: '800', color: COLORS.primary },
  yearCardLabel: { fontSize: 9, color: COLORS.muted },
  yearChants: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
    marginTop: 1,
  },
  yearUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 7,
  },
  yearUsers: { fontSize: 9, color: COLORS.muted, flexShrink: 1 },
  historyBox: {
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 19,
    paddingHorizontal: 13,
    paddingTop: 12,
  },
  historyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 7,
  },
  historyTitle: { fontSize: 11, fontWeight: '800', color: COLORS.white },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  historyRowLast: { borderBottomWidth: 0 },
  historyYear: {
    width: 48,
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.goldLight,
  },
  historyData: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyChants: { fontSize: 10, fontWeight: '700', color: COLORS.white },
  historyUsers: { fontSize: 9, color: '#CFB6A6' },
});
