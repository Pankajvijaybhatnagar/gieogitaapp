import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COLORS = {
  deepBrown: '#2C1A0A',
  warmBrown: '#4A2C0D',
  gold: '#C9A227',
  goldLight: '#E8C55A',
  goldDark: '#8B6914',
  cream: '#FDF6E3',
  creamDark: '#F5E6C8',
  green: '#2F7D4A',
  greenLight: '#E8F5EC',
  orange: '#B86A17',
  orangeLight: '#FFF3E1',
  red: '#B44635',
  redLight: '#FBECEA',
};

function normalizeSubscription(response) {
  const root = response?.data ?? response ?? {};
  const data = root?.data ?? root;

  const subscription =
    data?.subscription ??
    data?.current_subscription ??
    data?.active_subscription ??
    null;

  const rawStatus =
    subscription?.status ??
    data?.subscription_status ??
    data?.status ??
    response?.status ??
    null;

  const status = String(rawStatus || '').toLowerCase();

  const subscribed =
    Boolean(data?.is_subscribed) ||
    Boolean(data?.subscribed) ||
    Boolean(subscription) ||
    ['active', 'subscribed', 'paid'].includes(status);

  return {
    subscribed,
    status: status || (subscribed ? 'active' : 'not_subscribed'),
    subscription: subscription || data,
  };
}

function getStatusMeta(status) {
  switch (status) {
    case 'active':
    case 'subscribed':
    case 'paid':
      return {
        icon: 'checkmark-circle',
        color: COLORS.green,
        bg: COLORS.greenLight,
        title: 'Subscription Active',
        text: 'Your Monthly Patrika subscription is active.',
      };

    case 'pending':
      return {
        icon: 'time',
        color: COLORS.orange,
        bg: COLORS.orangeLight,
        title: 'Subscription Pending',
        text: 'Your subscription is waiting for confirmation.',
      };

    case 'expired':
      return {
        icon: 'alert-circle',
        color: COLORS.red,
        bg: COLORS.redLight,
        title: 'Subscription Expired',
        text: 'Your subscription has expired.',
      };

    case 'cancelled':
    case 'canceled':
      return {
        icon: 'close-circle',
        color: COLORS.red,
        bg: COLORS.redLight,
        title: 'Subscription Cancelled',
        text: 'Your subscription is currently cancelled.',
      };

    default:
      return {
        icon: 'book-outline',
        color: COLORS.goldDark,
        bg: COLORS.creamDark,
        title: 'Monthly Patrika',
        text: 'Subscribe to access the paid Patrika collection.',
      };
  }
}

export default function PatrikaStatusCard({
  subscriptionResponse,
  loading = false,
  onSubscribe,
  onRefresh,
}) {
  if (loading) {
    return (
      <View style={styles.loadingCard}>
        <View style={styles.loadingIcon}>
          <Ionicons name="book-outline" size={22} color={COLORS.goldDark} />
        </View>
        <View style={styles.loadingTextArea}>
          <View style={styles.skeletonTitle} />
          <View style={styles.skeletonLine} />
        </View>
      </View>
    );
  }

  const normalized = normalizeSubscription(subscriptionResponse);
  const meta = getStatusMeta(normalized.status);

  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: meta.bg }]}>
        <Ionicons name={meta.icon} size={24} color={meta.color} />
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{meta.title}</Text>

          {normalized.subscribed && (
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>ACTIVE</Text>
            </View>
          )}
        </View>

        <Text style={styles.description}>{meta.text}</Text>

        {normalized.subscribed ? (
          <View style={styles.infoRow}>
            <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.green} />
            <Text style={styles.infoText}>Paid access is enabled for your account.</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.subscribeButton}
            activeOpacity={0.85}
            onPress={onSubscribe}
          >
            <Ionicons name="lock-open-outline" size={16} color="#FFFFFF" />
            <Text style={styles.subscribeButtonText}>Subscribe to Read</Text>
          </TouchableOpacity>
        )}
      </View>

      {onRefresh ? (
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Ionicons name="refresh-outline" size={18} color={COLORS.goldDark} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export { normalizeSubscription };

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 15,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDE1D4',
    shadowColor: '#4E321D',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.deepBrown,
  },
  description: {
    marginTop: 4,
    fontSize: 11.5,
    lineHeight: 17,
    color: '#7E6857',
  },
  activeBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: COLORS.greenLight,
  },
  activeBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
    color: COLORS.green,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
  },
  infoText: {
    fontSize: 9.5,
    color: COLORS.green,
    fontWeight: '600',
  },
  subscribeButton: {
    marginTop: 11,
    alignSelf: 'flex-start',
    minHeight: 38,
    paddingHorizontal: 15,
    borderRadius: 19,
    backgroundColor: COLORS.deepBrown,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  refreshButton: {
    padding: 5,
  },
  loadingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 15,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDE1D4',
  },
  loadingIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingTextArea: {
    flex: 1,
  },
  skeletonTitle: {
    width: '52%',
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EEE5DA',
  },
  skeletonLine: {
    width: '82%',
    height: 9,
    borderRadius: 5,
    backgroundColor: '#F3ECE5',
    marginTop: 8,
  },
});
