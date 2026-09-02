// ─────────────────────────────────────────────────────────────────────────────
// PAATH COUNTER
// One Minute Chant
// ─────────────────────────────────────────────────────────────────────────────

import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { useAppAlert } from '@/context/AppAlertContext';
import { useAuth } from '@/context/AuthContext';
import chantServices from '@/lib/services/chantServices';

// ─────────────────────────────────────────────────────────────────────────────
// COLORS
// ─────────────────────────────────────────────────────────────────────────────

const COLORS = {
  deepBrown: '#2C1A0A',
  warmBrown: '#4A2C0D',
  richBrown: '#3D2010',

  gold: '#C9A227',
  goldLight: '#E8C55A',
  goldDark: '#8B6914',

  cream: '#FDF6E3',
  creamDark: '#F5E6C8',

  saffron: '#E8721C',
  saffronLight: '#F4A44A',

  white: '#FFFFFF',

  green: '#72B44C',
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION LABEL
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
// PAATH COUNTER
// ─────────────────────────────────────────────────────────────────────────────

export function PaathCounter({ todayPaath = 0, onSubmit }) {
  const router = useRouter();

  const { alert, success, error, warning, loading, hide } = useAppAlert();
  // ───────────────────────────────────────────────────────────────────────────
  // AUTH
  // ───────────────────────────────────────────────────────────────────────────

  const { access_token, isAuthenticated, loading: authLoading } = useAuth();

  // ───────────────────────────────────────────────────────────────────────────
  // COUNTER
  // ───────────────────────────────────────────────────────────────────────────

  const [count, setCount] = useState(0);

  // ───────────────────────────────────────────────────────────────────────────
  // SUBMIT
  // ───────────────────────────────────────────────────────────────────────────

  const [submitting, setSubmitting] = useState(false);

  // ───────────────────────────────────────────────────────────────────────────
  // ANIMATION
  // ───────────────────────────────────────────────────────────────────────────

  const bounceAnim = useRef(new Animated.Value(1)).current;

  const submitScaleAnim = useRef(new Animated.Value(1)).current;

  // ───────────────────────────────────────────────────────────────────────────
  // SWIPE START POSITION
  //
  // We store the starting Y position and calculate the direction only when
  // the user releases the counter.
  //
  // This is much more reliable than changing the counter inside
  // onPanResponderMove.
  // ───────────────────────────────────────────────────────────────────────────

  const swipeStartY = useRef(0);

  // ───────────────────────────────────────────────────────────────────────────
  // BOUNCE
  // ───────────────────────────────────────────────────────────────────────────

  const bounce = () => {
    Animated.sequence([
      Animated.spring(bounceAnim, {
        toValue: 1.15,
        useNativeDriver: true,
        friction: 4,
        tension: 80,
      }),

      Animated.spring(bounceAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
        tension: 80,
      }),
    ]).start();
  };

  // ───────────────────────────────────────────────────────────────────────────
  // INCREMENT
  // ───────────────────────────────────────────────────────────────────────────

  const incrementCount = () => {
    if (submitting) {
      return;
    }

    setCount(previous => previous + 1);

    bounce();
  };

  // ───────────────────────────────────────────────────────────────────────────
  // DECREMENT
  // ───────────────────────────────────────────────────────────────────────────

  const decrementCount = () => {
    if (submitting) {
      return;
    }

    setCount(previous => {
      if (previous <= 0) {
        return 0;
      }

      return previous - 1;
    });

    bounce();
  };

  // ───────────────────────────────────────────────────────────────────────────
  // PAN RESPONDER
  //
  // UP SWIPE:
  //     dy < -30  => increase
  //
  // DOWN SWIPE:
  //     dy > 30   => decrease
  //
  // IMPORTANT:
  // We do NOT update the counter inside onPanResponderMove.
  // This prevents multiple increments/decrements during one drag.
  // ───────────────────────────────────────────────────────────────────────────

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        return !submitting;
      },

      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (submitting) {
          return false;
        }

        return (
          Math.abs(gestureState.dy) > 8 &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
        );
      },

      onPanResponderGrant: (_, gestureState) => {
        swipeStartY.current = gestureState.y0;
      },

      onPanResponderRelease: (_, gestureState) => {
        if (submitting) {
          return;
        }

        const dy = gestureState.moveY - swipeStartY.current;

        console.log('[PaathCounter] Swipe dy:', dy);

        // ─────────────────────────────────────────────────────────────────────
        // SWIPE UP = +1
        // ─────────────────────────────────────────────────────────────────────

        if (dy < -30) {
          incrementCount();
          return;
        }

        // ─────────────────────────────────────────────────────────────────────
        // SWIPE DOWN = -1
        // ─────────────────────────────────────────────────────────────────────

        if (dy > 30) {
          decrementCount();
          return;
        }
      },

      onPanResponderTerminate: () => {
        swipeStartY.current = 0;
      },
    }),
  ).current;

  // ───────────────────────────────────────────────────────────────────────────
  // LOGIN
  // ───────────────────────────────────────────────────────────────────────────

  const handleLogin = () => {
    console.log('[PaathCounter] Opening login modal');

    router.push('/login2');
  };

  // ───────────────────────────────────────────────────────────────────────────
  // SUBMIT
  // ───────────────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    // ─────────────────────────────────────────────────────────────────────────

    // ─────────────────────────────────────────────────────────────────────────
    // PREVENT DOUBLE SUBMIT
    // ─────────────────────────────────────────────────────────────────────────

    if (submitting) {
      return;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // EMPTY COUNTER
    // ─────────────────────────────────────────────────────────────────────────

    if (count <= 0) {
      alert('No Paath', 'Please add at least 1 paath before submitting.');

      return;
    }

    loading('Submitting Paath', 'Please wait while we submit your paath...');

    const submittedCount = count;

    try {
      setSubmitting(true);

      // ───────────────────────────────────────────────────────────────────────
      // BUTTON ANIMATION
      // ───────────────────────────────────────────────────────────────────────

      Animated.sequence([
        Animated.spring(submitScaleAnim, {
          toValue: 0.93,
          useNativeDriver: true,
          friction: 4,
        }),

        Animated.spring(submitScaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 4,
        }),
      ]).start();

      // ───────────────────────────────────────────────────────────────────────
      // PAYLOAD
      // ───────────────────────────────────────────────────────────────────────

      const payload = {
        chant_count: submittedCount,
      };

      console.log('[PaathCounter] Submitting paath:', payload);

      // ───────────────────────────────────────────────────────────────────────
      // API
      // ───────────────────────────────────────────────────────────────────────

      const response = await chantServices.createOneMinuteChant(
        payload,
        access_token,
      );

      console.log('[PaathCounter] Submit response:', response);

      // ───────────────────────────────────────────────────────────────────────
      // RESET
      // ───────────────────────────────────────────────────────────────────────

      setCount(0);

      // ───────────────────────────────────────────────────────────────────────
      // PARENT CALLBACK
      // ───────────────────────────────────────────────────────────────────────

      if (typeof onSubmit === 'function') {
        onSubmit(submittedCount, response);
      }

      // ───────────────────────────────────────────────────────────────────────
      // SUCCESS
      // ───────────────────────────────────────────────────────────────────────

      success(
        'Paath Submitted',
        `${submittedCount} paath submitted successfully.`,
      );
    } catch (error) {
      console.error('[PaathCounter] Submission failed:', error);

      let message = 'Unable to submit your paath. Please try again.';

      if (error?.response?.data) {
        const data = error.response.data;

        if (typeof data === 'string') {
          message = data;
        } else if (data?.detail) {
          message = data.detail;
        } else if (data?.message) {
          message = data.message;
        } else if (data?.error) {
          message = data.error;
        }
      } else if (error?.message) {
        message = error.message;
      }

      alert('❌ Submission Failed', message);
    } finally {
      setSubmitting(false);
      // hide();
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // AUTH LOADING
  // ───────────────────────────────────────────────────────────────────────────

  if (authLoading) {
    return null;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // NOT LOGGED IN
  //
  // Show login button so user can open the existing /login modal.
  // ───────────────────────────────────────────────────────────────────────────

  if (!isAuthenticated || !access_token) {
    return (
      <View style={styles.wrapper}>
        <SectionLabel text="SUBMIT TODAY'S PAATH" />

        <View style={styles.loginContainer}>
          <Text style={styles.loginIcon}>🔐</Text>

          <Text style={styles.loginTitle}>Login to Submit Paath</Text>

          <Text style={styles.loginDescription}>
            Please login to record your daily paath and track your progress.
          </Text>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.85}>
            <FontAwesome
              name="sign-in"
              size={16}
              color={COLORS.deepBrown}
              style={styles.loginButtonIcon}
            />

            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // LOGGED IN UI
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <View style={styles.wrapper}>
      <SectionLabel text="SUBMIT TODAY'S PAATH" />

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* TODAY'S SUBMITTED */}
      {/* ───────────────────────────────────────────────────────────────────── */}

      <View style={styles.todayBadge}>
        <Text style={styles.todayBadgeText}>Today's submitted:</Text>

        <Text style={styles.todayBadgeNumber}>{todayPaath}</Text>
      </View>

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* MAIN ROW */}
      {/* ───────────────────────────────────────────────────────────────────── */}

      <View style={styles.mainRow}>
        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* COUNTER */}
        {/* ─────────────────────────────────────────────────────────────────── */}

        <View style={styles.counterCol}>
          {/* PLUS */}
          <TouchableOpacity
            style={[styles.arrowBtn, submitting && styles.disabledButton]}
            onPress={incrementCount}
            activeOpacity={0.8}
            disabled={submitting}>
            <Text style={styles.arrowText}>▲</Text>
          </TouchableOpacity>

          {/* COUNTER BOX */}
          <Animated.View
            style={[
              styles.counterBox,
              {
                transform: [
                  {
                    scale: bounceAnim,
                  },
                ],
              },
            ]}
            {...panResponder.panHandlers}>
            <Text style={styles.bookIcon}>📖</Text>

            <Text style={styles.counterText}>{count}</Text>

            <Text style={styles.swipeHint}>swipe ↕</Text>
          </Animated.View>

          {/* MINUS */}
          <TouchableOpacity
            style={[styles.arrowBtn, submitting && styles.disabledButton]}
            onPress={decrementCount}
            activeOpacity={0.8}
            disabled={submitting}>
            <Text style={styles.arrowText}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* RIGHT COLUMN */}
        {/* ─────────────────────────────────────────────────────────────────── */}

        <View style={styles.rightCol}>
          {/* INSTRUCTIONS */}
          <View style={styles.instructionsBox}>
            <Text style={styles.instrTitle}>How to Submit Paath</Text>

            <View style={styles.instrRow}>
              <View style={styles.instrDot} />

              <Text style={styles.instrText}>
                Set number of verses recited today.
              </Text>
            </View>

            <View style={styles.instrRow}>
              <View style={styles.instrDot} />

              <Text style={styles.instrText}>
                Swipe up to add and down to reduce.
              </Text>
            </View>

            <View style={styles.instrRow}>
              <View style={styles.instrDot} />

              <Text style={styles.instrText}>
                Press Submit to record your paath.
              </Text>
            </View>
          </View>

          {/* SUBMIT */}
          <Animated.View
            style={{
              transform: [
                {
                  scale: submitScaleAnim,
                },
              ],
            }}>
            <TouchableOpacity
              style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              activeOpacity={0.85}
              disabled={submitting}>
              {submitting ? (
                <Text style={styles.submitBtnText}>Submitting...</Text>
              ) : (
                <>
                  <FontAwesome
                    name="check-circle"
                    size={16}
                    color={COLORS.deepBrown}
                    style={styles.submitIcon}
                  />

                  <Text style={styles.submitBtnText}>Submit Paath</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
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
  // TODAY
  // ───────────────────────────────────────────────────────────────────────────

  todayBadge: {
    flexDirection: 'row',

    alignItems: 'center',

    alignSelf: 'center',

    backgroundColor: 'rgba(201,162,39,0.12)',

    borderWidth: 1,

    borderColor: 'rgba(201,162,39,0.3)',

    borderRadius: 20,

    paddingHorizontal: 16,

    paddingVertical: 5,

    marginBottom: 16,
  },

  todayBadgeText: {
    fontSize: 12,

    color: COLORS.creamDark,
  },

  todayBadgeNumber: {
    fontSize: 14,

    fontWeight: '800',

    color: COLORS.goldLight,

    marginLeft: 4,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // MAIN ROW
  // ───────────────────────────────────────────────────────────────────────────

  mainRow: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // COUNTER
  // ───────────────────────────────────────────────────────────────────────────

  counterCol: {
    width: 90,

    alignItems: 'center',
  },

  arrowBtn: {
    width: 44,

    height: 44,

    borderRadius: 22,

    backgroundColor: 'rgba(201,162,39,0.15)',

    borderWidth: 1.5,

    borderColor: COLORS.gold,

    alignItems: 'center',

    justifyContent: 'center',

    marginVertical: 4,
  },

  arrowText: {
    fontSize: 16,

    color: COLORS.goldLight,

    fontWeight: '800',
  },

  counterBox: {
    width: 90,

    height: 130,

    backgroundColor: COLORS.deepBrown,

    borderRadius: 16,

    borderWidth: 2.5,

    borderColor: COLORS.gold,

    alignItems: 'center',

    justifyContent: 'center',

    marginVertical: 4,
  },

  bookIcon: {
    fontSize: 22,

    marginBottom: 4,
  },

  counterText: {
    fontSize: 44,

    fontWeight: '800',

    color: COLORS.goldLight,

    lineHeight: 50,
  },

  swipeHint: {
    fontSize: 9,

    color: COLORS.goldDark,

    letterSpacing: 0.5,

    marginTop: 3,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // RIGHT COLUMN
  // ───────────────────────────────────────────────────────────────────────────

  rightCol: {
    flex: 1,

    marginLeft: 16,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // INSTRUCTIONS
  // ───────────────────────────────────────────────────────────────────────────

  instructionsBox: {
    backgroundColor: 'rgba(201,162,39,0.08)',

    borderRadius: 14,

    padding: 14,

    borderWidth: 1,

    borderColor: 'rgba(201,162,39,0.2)',

    marginBottom: 14,
  },

  instrTitle: {
    fontSize: 12,

    fontWeight: '800',

    color: COLORS.goldLight,

    marginBottom: 8,

    letterSpacing: 0.3,
  },

  instrRow: {
    flexDirection: 'row',

    alignItems: 'flex-start',

    marginBottom: 7,
  },

  instrDot: {
    width: 5,

    height: 5,

    borderRadius: 3,

    backgroundColor: COLORS.saffron,

    marginTop: 5,

    marginRight: 7,
  },

  instrText: {
    flex: 1,

    fontSize: 11,

    color: COLORS.creamDark,

    lineHeight: 16,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // SUBMIT BUTTON
  // ───────────────────────────────────────────────────────────────────────────

  submitBtn: {
    backgroundColor: COLORS.gold,

    borderRadius: 22,

    paddingVertical: 13,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',
  },

  submitBtnDisabled: {
    opacity: 0.65,
  },

  submitIcon: {
    marginRight: 6,
  },

  submitBtnText: {
    color: COLORS.deepBrown,

    fontSize: 15,

    fontWeight: '800',

    letterSpacing: 0.3,
  },

  disabledButton: {
    opacity: 0.5,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // LOGIN
  // ───────────────────────────────────────────────────────────────────────────

  loginContainer: {
    alignItems: 'center',

    backgroundColor: 'rgba(201,162,39,0.08)',

    borderRadius: 16,

    borderWidth: 1,

    borderColor: 'rgba(201,162,39,0.22)',

    paddingVertical: 24,

    paddingHorizontal: 18,
  },

  loginIcon: {
    fontSize: 30,

    marginBottom: 8,
  },

  loginTitle: {
    fontSize: 16,

    fontWeight: '800',

    color: COLORS.goldLight,

    textAlign: 'center',

    marginBottom: 5,
  },

  loginDescription: {
    fontSize: 11,

    lineHeight: 17,

    color: COLORS.creamDark,

    textAlign: 'center',

    marginBottom: 16,
  },

  loginButton: {
    backgroundColor: COLORS.gold,

    borderRadius: 22,

    paddingVertical: 12,

    paddingHorizontal: 28,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',
  },

  loginButtonIcon: {
    marginRight: 7,
  },

  loginButtonText: {
    color: COLORS.deepBrown,

    fontSize: 14,

    fontWeight: '800',

    letterSpacing: 0.3,
  },
});
