import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Card from '@/components/ui/Card';
import { COLORS, RGB } from '@/constants/brandColors';
import { hairline, radii, spacing, type } from '@/constants/theme';
import EditProfileModal from './EditProfileModal';

const InfoRow = ({ icon, title, value, last = false }) => {
  if (!value) return null;

  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={19} color={COLORS.goldDark} />
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
      <Card radius={radii.xl} style={styles.card}>
        <View style={styles.headingRow}>
          <View>
            <Text style={styles.eyebrow}>MEMBER DETAILS</Text>

            <Text style={styles.heading}>Personal Information</Text>
          </View>

          <Pressable
            onPress={() => setEditVisible(true)}
            style={styles.editButton}>
            <Ionicons
              name="create-outline"
              size={17}
              color={COLORS.deepBrown}
            />

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
      </Card>

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
    marginHorizontal: spacing.md,
    marginTop: spacing.xs + 1,
    padding: spacing.lg - 6
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  eyebrow: {
    color: COLORS.goldDark,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.5
  },
  heading: {
    ...type.headline,
    fontSize: 19,
    color: COLORS.deepBrown,
    marginTop: 3
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.creamDark,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.sm,
    borderRadius: radii.md - 2
  },
  editText: {
    color: COLORS.deepBrown,
    fontSize: 12,
    fontWeight: "600"
  },
  divider: {
    height: 1,
    backgroundColor: hairline,
    marginTop: spacing.md - 1
  },
  row: {
    flexDirection: 'row',
    paddingVertical: spacing.sm + 5,
    borderBottomWidth: 1,
    borderBottomColor: hairline
  },
  rowLast: {
    borderBottomWidth: 0
  },
  iconBox: {
    width: 39,
    height: 39,
    borderRadius: radii.md - 2,
    backgroundColor: `rgba(${RGB.gold}, 0.14)`,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rowContent: {
    flex: 1,
    marginLeft: spacing.sm + 4
  },
  rowTitle: {
    ...type.caption,
    fontSize: 12,
    color: COLORS.warmBrown,
    textTransform: 'uppercase'
  },
  rowValue: {
    marginTop: 3,
    color: COLORS.deepBrown,
    fontSize: 14,
    fontWeight: '600'
  }
});
