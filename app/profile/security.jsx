import { useEffect, useRef, useState } from 'react';

import {
  Alert,
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';

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

const INITIAL_SESSIONS = [
  {
    id: 1,
    device: 'Windows PC',
    browser: 'Chrome',
    location: 'Kurukshetra, India',
    lastActive: 'Active now',
    current: true,
    icon: 'desktop-outline',
  },
  {
    id: 2,
    device: 'Android Phone',
    browser: 'Expo / Android',
    location: 'Kurukshetra, India',
    lastActive: '2 hours ago',
    current: false,
    icon: 'phone-portrait-outline',
  },
  {
    id: 3,
    device: 'iPhone',
    browser: 'Safari',
    location: 'New Delhi, India',
    lastActive: 'Yesterday',
    current: false,
    icon: 'phone-portrait-outline',
  },
];

export default function SecurityScreen() {
  const router = useRouter();

  const [sessions, setSessions] = useState(INITIAL_SESSIONS);

  /*
  |--------------------------------------------------------------------------
  | ANIMATION
  |--------------------------------------------------------------------------
  */

  const opacity = useRef(new Animated.Value(0)).current;

  const translateY = useRef(new Animated.Value(25)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.spring(translateY, {
        toValue: 0,
        speed: 15,
        bounciness: 3,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | LOGOUT SESSION
  |--------------------------------------------------------------------------
  */

  const handleRemoveSession = session => {
    Alert.alert('End Session', `Sign out from ${session.device}?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          setSessions(previous =>
            previous.filter(item => item.id !== session.id),
          );
        },
      },
    ]);
  };

  /*
  |--------------------------------------------------------------------------
  | LOGOUT OTHER DEVICES
  |--------------------------------------------------------------------------
  */

  const handleLogoutOthers = () => {
    const otherSessions = sessions.filter(item => !item.current);

    if (otherSessions.length === 0) {
      Alert.alert('No Other Sessions', 'There are no other active sessions.');

      return;
    }

    Alert.alert(
      'Sign Out Other Devices',
      'This will sign out all other devices.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Continue',
          style: 'destructive',
          onPress: () => {
            setSessions(previous => previous.filter(item => item.current));

            Alert.alert('Done', 'All other sessions have been signed out.');
          },
        },
      ],
    );
  };

  return (
    <View style={styles.screen}>
      <Animated.View
        style={[
          styles.flex,
          {
            opacity,
            transform: [
              {
                translateY,
              },
            ],
          },
        ]}>
        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={COLORS.text} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Security & Sessions</Text>

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          {/* SECURITY INFO */}

          <View style={styles.securityBanner}>
            <View style={styles.securityIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={24}
                color={COLORS.success}
              />
            </View>

            <View style={styles.securityText}>
              <Text style={styles.bannerTitle}>Your account is secure</Text>

              <Text style={styles.bannerSubtitle}>
                Review where your account is currently signed in.
              </Text>
            </View>
          </View>

          {/* ACTIVE SESSION */}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Sessions</Text>

            <Text style={styles.sessionCount}>{sessions.length}</Text>
          </View>

          {/* SESSIONS */}

          {sessions.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="desktop-outline" size={35} color={COLORS.light} />

              <Text style={styles.emptyTitle}>No active sessions</Text>
            </View>
          ) : (
            sessions.map(session => (
              <SessionCard
                key={session.id}
                session={session}
                onRemove={() => handleRemoveSession(session)}
              />
            ))
          )}

          {/* LOGOUT OTHER DEVICES */}

          <TouchableOpacity
            style={styles.logoutOthers}
            onPress={handleLogoutOthers}
            activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={18} color={COLORS.danger} />

            <Text style={styles.logoutOthersText}>
              Sign out of all other devices
            </Text>
          </TouchableOpacity>

          {/* INFO */}

          <View style={styles.infoCard}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={COLORS.primary}
            />

            <Text style={styles.infoText}>
              For your security, sign out of devices you no longer recognize or
              use.
            </Text>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

function SessionCard({ session, onRemove }) {
  return (
    <View style={styles.sessionCard}>
      <View
        style={[
          styles.deviceIcon,
          session.current && styles.deviceIconCurrent,
        ]}>
        <Ionicons
          name={session.icon}
          size={22}
          color={session.current ? COLORS.primary : '#777777'}
        />
      </View>

      <View style={styles.sessionContent}>
        <View style={styles.deviceRow}>
          <Text style={styles.deviceName}>{session.device}</Text>

          {session.current && (
            <View style={styles.currentBadge}>
              <View style={styles.currentDot} />

              <Text style={styles.currentText}>Current</Text>
            </View>
          )}
        </View>

        <Text style={styles.browser}>{session.browser}</Text>

        <View style={styles.sessionMeta}>
          <Ionicons name="location-outline" size={12} color={COLORS.light} />

          <Text style={styles.metaText}>{session.location}</Text>
        </View>

        <View style={styles.sessionMeta}>
          <Ionicons
            name="time-outline"
            size={12}
            color={session.current ? COLORS.success : COLORS.light}
          />

          <Text
            style={[
              styles.metaText,
              session.current && {
                color: COLORS.success,
              },
            ]}>
            {session.lastActive}
          </Text>
        </View>
      </View>

      {!session.current && (
        <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
          <Ionicons name="log-out-outline" size={17} color={COLORS.danger} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 15,
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
    padding: 18,
    paddingBottom: 35,
  },

  securityBanner: {
    padding: 15,
    borderRadius: 16,
    backgroundColor: COLORS.successLight,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  securityIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#DFF1E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  securityText: {
    flex: 1,
  },

  bannerTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.success,
  },

  bannerSubtitle: {
    marginTop: 3,
    fontSize: 9.5,
    lineHeight: 14,
    color: '#4F745E',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
  },

  sectionTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },

  sessionCount: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 6,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 9.5,
    fontWeight: '700',
    color: COLORS.primary,
    overflow: 'hidden',
  },

  sessionCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 13,
    marginBottom: 9,
    flexDirection: 'row',
    alignItems: 'center',
  },

  deviceIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: '#F5F4F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  deviceIconCurrent: {
    backgroundColor: COLORS.primaryLight,
  },

  sessionContent: {
    flex: 1,
  },

  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  deviceName: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.text,
  },

  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 7,
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 8,
    backgroundColor: COLORS.successLight,
  },

  currentDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.success,
    marginRight: 4,
  },

  currentText: {
    fontSize: 7.5,
    fontWeight: '700',
    color: COLORS.success,
  },

  browser: {
    marginTop: 2,
    fontSize: 9,
    color: COLORS.secondary,
  },

  sessionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  metaText: {
    marginLeft: 4,
    fontSize: 8.5,
    color: COLORS.light,
  },

  removeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },

  logoutOthers: {
    height: 47,
    marginTop: 7,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#F0D5D5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  logoutOthersText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.danger,
  },

  infoCard: {
    marginTop: 16,
    padding: 13,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 9.5,
    lineHeight: 15,
    color: COLORS.primaryDark,
  },

  emptyCard: {
    padding: 35,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  emptyTitle: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
});
