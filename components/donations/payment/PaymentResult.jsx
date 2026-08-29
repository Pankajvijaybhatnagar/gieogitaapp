import { Ionicons } from '@expo/vector-icons';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
        <View style={styles.receiptCard}>
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
        </View>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={onDone}
        activeOpacity={0.85}>
        <Text style={styles.buttonText}>View My Donations</Text>

        <Ionicons name="arrow-forward" size={17} color="#FFFFFF" />
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
        color: '#A54D41',
        background: '#FBEAE7',
      };

    default:
      return {
        title: 'Payment Verification',
        message:
          'Your payment status is being confirmed. You can check your donation history for the latest status.',
        icon: 'time',
        color: '#987027',
        background: '#FFF1D8',
      };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
    backgroundColor: '#FFF9F3',
  },

  iconCircle: {
    width: 78,
    height: 78,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  eyebrow: {
    marginTop: 20,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.8,
    color: '#AF7955',
  },

  title: {
    marginTop: 6,
    fontSize: 23,
    fontWeight: '700',
    color: '#4D3020',
    textAlign: 'center',
  },

  description: {
    marginTop: 8,
    maxWidth: 320,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 17,
    color: '#876F5C',
  },

  receiptCard: {
    width: '100%',
    marginTop: 24,
    paddingHorizontal: 14,
    paddingVertical: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#EADFD5',
  },

  detailRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },

  detailLabel: {
    fontSize: 10,
    color: '#927866',
  },

  detailValue: {
    flex: 1,
    marginLeft: 15,
    textAlign: 'right',
    fontSize: 10.5,
    fontWeight: '700',
    color: '#543621',
  },

  divider: {
    height: 1,
    backgroundColor: '#F1E8E0',
  },

  button: {
    width: '100%',
    height: 48,
    marginTop: 20,
    borderRadius: 15,
    backgroundColor: '#673A21',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  buttonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
