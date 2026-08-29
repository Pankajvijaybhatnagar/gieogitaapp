import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import EditProfileModal from './EditProfileModal';

const COLORS = {
  primary: '#6E3F1F',
  secondary: '#A8692D',
  text: '#3E2A1F',
  muted: '#867366',
};

const InfoRow = ({ icon, title, value, last = false }) => {
  if (!value) return null;

  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={19} color={COLORS.secondary} />
      </View>

      <View style={styles.rowContent}>
        <Text style={styles.rowTitle}>{title}</Text>

        <Text style={styles.rowValue} selectable>
          {value}
        </Text>
      </View>
    </View>
  );
};

export default function ProfileInfoCard({ profile, onUpdated }) {
  const [editVisible, setEditVisible] = useState(false);

  return (
    <>
      <View style={styles.card}>
        <View style={styles.headingRow}>
          <View>
            <Text style={styles.eyebrow}>MEMBER DETAILS</Text>

            <Text style={styles.heading}>Personal Information</Text>
          </View>

          <Pressable
            onPress={() => setEditVisible(true)}
            style={styles.editButton}>
            <Ionicons name="create-outline" size={17} color={COLORS.primary} />

            <Text style={styles.editText}>Edit</Text>
          </Pressable>
        </View>

        <View style={styles.divider} />

        <InfoRow icon="call-outline" title="Phone" value={profile?.phone} />

        <InfoRow icon="mail-outline" title="Email" value={profile?.email} />

        <InfoRow
          icon="calendar-outline"
          title="Date of Birth"
          value={profile?.dob}
        />

        <InfoRow
          icon="heart-outline"
          title="Anniversary"
          value={profile?.aniver_date}
        />

        <InfoRow
          icon="ribbon-outline"
          title="Designation"
          value={profile?.designation}
        />

        <InfoRow
          icon="people-outline"
          title="Wing"
          value={profile?.interest}
          last
        />
      </View>

      <EditProfileModal
        visible={editVisible}
        profile={profile}
        onClose={() => setEditVisible(false)}
        onUpdated={onUpdated}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 5,
    padding: 18,
    borderRadius: 24,
    backgroundColor: '#FFF',
    elevation: 2,
    shadowColor: '#5B3B28',
    shadowOpacity: 0.06,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
  },

  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  eyebrow: {
    color: COLORS.secondary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  heading: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: '800',
    marginTop: 3,
  },

  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F6E9DD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },

  editText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
  },

  divider: {
    height: 1,
    backgroundColor: '#F0E6DC',
    marginTop: 15,
  },

  row: {
    flexDirection: 'row',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F4ECE4',
  },

  rowLast: {
    borderBottomWidth: 0,
  },

  iconBox: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: '#FBF3EA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  rowContent: {
    flex: 1,
    marginLeft: 12,
  },

  rowTitle: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  rowValue: {
    marginTop: 3,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
