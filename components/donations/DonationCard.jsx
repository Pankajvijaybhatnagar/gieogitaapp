import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import DonationReceiptButton from './DonationReceiptButton';

const DonationCard = ({ donation }) => {
  const formatAmount = value => {
    const amount = Number(value || 0);

    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = dateValue => {
    if (!dateValue) return '-';

    const date = new Date(dateValue.replace(' ', 'T'));

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = dateValue => {
    if (!dateValue) return '';

    const date = new Date(dateValue.replace(' ', 'T'));

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatType = value => {
    if (!value || value.toLowerCase() === 'other') {
      return 'General Seva';
    }

    return value
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  const getStatusConfig = status => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return {
          text: 'Completed',
          icon: 'checkmark-circle',
          background: '#EAF5EC',
          color: '#42724B',
        };

      case 'failed':
        return {
          text: 'Failed',
          icon: 'close-circle',
          background: '#FBECE9',
          color: '#A64D40',
        };

      case 'pending':
        return {
          text: 'Pending',
          icon: 'time',
          background: '#FFF3DD',
          color: '#98712A',
        };

      default:
        return {
          text: status || 'Processing',
          icon: 'time-outline',
          background: '#F1E8E1',
          color: '#765644',
        };
    }
  };

  const status = getStatusConfig(donation?.status);

  const location =
    [donation?.city, donation?.state].filter(Boolean).join(', ') || '-';

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconBox}>
          <Ionicons name="heart" size={17} color="#8B4F2D" />
        </View>

        <View style={styles.headingArea}>
          <Text style={styles.type} numberOfLines={1}>
            {formatType(donation?.type)}
          </Text>

          <Text style={styles.date} numberOfLines={1}>
            {formatDate(donation?.donation_date)}
            {formatTime(donation?.donation_date)
              ? ` • ${formatTime(donation?.donation_date)}`
              : ''}
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: status.background,
            },
          ]}>
          <Ionicons name={status.icon} size={11} color={status.color} />

          <Text
            style={[
              styles.statusText,
              {
                color: status.color,
              },
            ]}>
            {status.text}
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View style={styles.amountContainer}>
          <Text style={styles.currency}>₹</Text>

          <Text style={styles.amount}>{formatAmount(donation?.amount)}</Text>
        </View>
        {donation?.status?.toLowerCase() === 'completed' && (
          <DonationReceiptButton donation={donation} />
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.detailRow}>
        <View style={styles.detailItem}>
          <Ionicons name="person-outline" size={13} color="#9A765D" />

          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Donated By</Text>

            <Text style={styles.detailValue} numberOfLines={1}>
              {donation?.name || donation?.user_name || '-'}
            </Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={13} color="#9A765D" />

          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Location</Text>

            <Text style={styles.detailValue} numberOfLines={1}>
              {location}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.transactionBox}>
        <View style={styles.transactionTextContainer}>
          <Text style={styles.transactionLabel}>Transaction ID</Text>

          <Text style={styles.transactionValue} numberOfLines={1}>
            {donation?.transaction_id || donation?.merchantTxnNo || '-'}
          </Text>
        </View>

        <Ionicons name="shield-checkmark-outline" size={16} color="#8C6045" />
      </View>
    </View>
  );
};

export default DonationCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 9,

    borderWidth: 1,
    borderColor: '#EFE2D6',

    shadowColor: '#63381F',
    shadowOpacity: 0.045,
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 1,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#F5E8DC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headingArea: {
    flex: 1,
    marginLeft: 9,
    marginRight: 6,
  },

  type: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4D2D1A',
  },

  date: {
    fontSize: 9.5,
    color: '#9A7A64',
    marginTop: 2,
  },

  statusBadge: {
    minHeight: 23,
    paddingHorizontal: 7,
    borderRadius: 12,

    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  statusText: {
    fontSize: 8.5,
    fontWeight: '700',
    textTransform: 'capitalize',
  },

  amountContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 11,
  },

  currency: {
    color: '#75503A',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
    marginRight: 1,
  },

  amount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4D2D1A',
    lineHeight: 28,
  },

  divider: {
    height: 1,
    backgroundColor: '#F2E8DF',
    marginVertical: 10,
  },

  detailRow: {
    flexDirection: 'row',
    gap: 8,
  },

  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  detailContent: {
    flex: 1,
    marginLeft: 5,
  },

  detailLabel: {
    fontSize: 8.5,
    color: '#A18470',
    marginBottom: 1,
  },

  detailValue: {
    color: '#62422F',
    fontSize: 10.5,
    fontWeight: '600',
  },

  transactionBox: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: '#FAF4ED',

    paddingHorizontal: 10,
    paddingVertical: 7,

    flexDirection: 'row',
    alignItems: 'center',
  },

  transactionTextContainer: {
    flex: 1,
    paddingRight: 8,
  },

  transactionLabel: {
    fontSize: 7.5,
    color: '#A58A77',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  transactionValue: {
    fontSize: 9.5,
    color: '#674A37',
    fontWeight: '600',
    marginTop: 2,
  },
});
