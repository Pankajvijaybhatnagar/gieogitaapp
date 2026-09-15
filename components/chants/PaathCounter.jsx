// ─────────────────────────────────────────────────────────────────────────────
// Paath COUNTER
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
  View,
} from 'react-native';

import { COLORS } from '@/constants/brandColors';
import { hairline, radii } from '@/constants/theme';
import { useAppAlert } from '@/context/AppAlertContext';
import { useAuth } from '@/context/AuthContext';
import chantServices from '@/lib/services/chantServices';

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
// Paath COUNTER
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
      alert('No Paath', 'Please add at least 1 Paath before submitting.');

      return;
    }

    loading('Submitting Paath', 'Please wait while we submit your Paath...');

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

      console.log('[PaathCounter] Submitting Paath:', payload);

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
        `${submittedCount} Paath submitted successfully.`,
      );
    } catch (error) {
      console.error('[PaathCounter] Submission failed:', error);

      let message = 'Unable to submit your Paath. Please try again.';

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
        <SectionLabel text="SUBMIT TODAY'S Paath" />

        <View style={styles.loginContainer}>
          <Text style={styles.loginIcon}>🔐</Text>

          <Text style={styles.loginTitle}>Login to Submit Paath</Text>

          <Text style={styles.loginDescription}>
            Please login to record your daily Paath and track your progress.
          </Text>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.85}>
            <FontAwesome
              name="sign-in"
              size={16}
              color={COLORS.white}
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
      <SectionLabel text="SUBMIT TODAY'S Paath" />

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* TODAY'S SUBMITTED */}
      {/* ───────────────────────────────────────────────────────────────────── */}

      <View style={styles.todayBadge}>
        <Text style={styles.todayBadgeText}>Today&apos;s submitted:</Text>

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
                Press Submit to record your Paath.
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
                    color={COLORS.white}
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
    marginHorizontal: 24,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: hairline,
    overflow: 'hidden',
    shadowOpacity: 0.045,
    elevation: 2,
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
    color: COLORS.richBrown,
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
    backgroundColor: COLORS.creamDark,
    borderWidth: 0,
    borderColor: hairline,
    borderRadius: radii.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  todayBadgeText: {
    fontSize: 12,
    color: COLORS.warmBrown,
  },
  todayBadgeNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.saffron,
    marginLeft: 4,
  },
  // ───────────────────────────────────────────────────────────────────────────
  // MAIN ROW
  // ───────────────────────────────────────────────────────────────────────────

  mainRow: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
  },
  // ───────────────────────────────────────────────────────────────────────────
  // COUNTER
  // ───────────────────────────────────────────────────────────────────────────

  counterCol: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
  },
  arrowBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.creamDark,
    borderWidth: 0,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  arrowText: {
    fontSize: 16,
    color: COLORS.richBrown,
    fontWeight: '600',
  },
  counterBox: {
    width: 148,
    height: 148,
    backgroundColor: COLORS.richBrown,
    borderRadius: 74,
    borderWidth: 1,
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
    fontSize: 52,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 62,
  },
  swipeHint: {
    fontSize: 12,
    color: COLORS.goldLight,
    letterSpacing: 0.5,
    marginTop: 3,
  },
  // ───────────────────────────────────────────────────────────────────────────
  // RIGHT COLUMN
  // ───────────────────────────────────────────────────────────────────────────

  rightCol: {
    flex: 0,
    marginLeft: 0,
    width: '100%',
  },
  // ───────────────────────────────────────────────────────────────────────────
  // INSTRUCTIONS
  // ───────────────────────────────────────────────────────────────────────────

  instructionsBox: {
    backgroundColor: '#FCFAF7',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: hairline,
    marginBottom: 14,
  },
  instrTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.deepBrown,
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
    fontSize: 13,
    color: COLORS.warmBrown,
    lineHeight: 21,
  },
  // ───────────────────────────────────────────────────────────────────────────
  // SUBMIT BUTTON
  // ───────────────────────────────────────────────────────────────────────────

  submitBtn: {
    backgroundColor: COLORS.richBrown,
    borderRadius: 16,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  submitBtnDisabled: {
    opacity: 0.65,
  },
  submitIcon: {
    marginRight: 6,
  },
  submitBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
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
    backgroundColor: COLORS.creamDark,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: hairline,
    paddingVertical: 24,
    paddingHorizontal: 18,
  },
  loginIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  loginTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.deepBrown,
    textAlign: 'center',
    marginBottom: 5,
  },
  loginDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.warmBrown,
    textAlign: 'center',
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: COLORS.richBrown,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  loginButtonIcon: {
    marginRight: 7,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
