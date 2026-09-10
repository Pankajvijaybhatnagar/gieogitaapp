import { DESIGN } from '@/constants/design';
import { Ionicons } from '@expo/vector-icons';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Card from '@/components/ui/Card';
import { COLORS } from '@/constants/brandColors';
import { hairline, radii, spacing, type } from '@/constants/theme';

export default function PaymentResult({
  status,
  donation,
  title,
  message,
  onDone,
}) {
  const config = getStatusConfig(status);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: config.background,
          },
        ]}>
        <Ionicons name={config.icon} size={38} color={config.color} />
      </View>

      <Text style={styles.eyebrow}>DONATION PAYMENT</Text>

      <Text style={styles.title}>{title || config.title}</Text>

      <Text style={styles.description}>{message || config.message}</Text>

      {donation && (
        <Card style={styles.receiptCard}>
          <Detail
            label="Amount"
            value={`₹${Number(donation?.amount || 0).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
            })}`}
          />

          <View style={styles.divider} />

          <Detail
            label="Transaction ID"
            value={donation?.transaction_id || donation?.merchantTxnNo || '-'}
          />

          <View style={styles.divider} />

          <Detail label="Status" value={donation?.status || status} />
        </Card>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={onDone}
        activeOpacity={0.85}>
        <Text style={styles.buttonText}>View My Donations</Text>

        <Ionicons name="arrow-forward" size={17} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
}

function Detail({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>

      <Text style={styles.detailValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function getStatusConfig(status) {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'success':
      return {
        title: 'Donation Successful',
        message:
          'Thank you for your contribution. Your payment has been confirmed successfully.',
        icon: 'checkmark-circle',
        color: '#43774C',
        background: '#E8F4EA',
      };

    case 'failed':
      return {
        title: 'Payment Failed',
        message:
          'We could not complete your payment. No successful payment has been confirmed.',
        icon: 'close-circle',
        color: COLORS.dangerRed,
        background: '#FBEAE7',
      };

    default:
      return {
        title: 'Payment Verification',
        message:
          'Your payment status is being confirmed. You can check your donation history for the latest status.',
        icon: 'time',
        color: COLORS.goldDark,
        background: '#FFF1D8',
      };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    backgroundColor: COLORS.cream
  },
  iconCircle: {
    width: 78,
    height: 78,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  eyebrow: {
    marginTop: spacing.lg,
    ...type.caption,
    color: COLORS.warmBrown
  },
  title: {
    marginTop: spacing.xs,
    ...type.title,
    fontSize: 23,
    color: COLORS.deepBrown,
    textAlign: 'center',
    fontFamily: DESIGN.fonts.editorial,
    fontWeight: "400",
    letterSpacing: -0.4
  },
  description: {
    marginTop: spacing.sm,
    maxWidth: 320,
    textAlign: 'center',
    ...type.footnote,
    lineHeight: 17,
    color: COLORS.warmBrown
  },
  receiptCard: {
    width: '100%',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs
  },
  detailRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center'
  },
  detailLabel: {
    ...type.footnote,
    color: COLORS.warmBrown
  },
  detailValue: {
    flex: 1,
    marginLeft: spacing.md,
    textAlign: 'right',
    ...type.subhead,
    color: COLORS.deepBrown
  },
  divider: {
    height: 1,
    backgroundColor: hairline
  },
  button: {
    width: '100%',
    height: 48,
    marginTop: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: COLORS.richBrown,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm
  },
  buttonText: {
    ...type.subhead,
    color: COLORS.white
  }
});
