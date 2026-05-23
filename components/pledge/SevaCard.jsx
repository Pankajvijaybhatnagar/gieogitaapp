import { FontAwesome } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { C } from './constants';

export default function SevaCard({ seva, onDonate }) {
  const [expanded, setExpanded] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    Animated.timing(anim, {
      toValue: expanded ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  const maxHeight = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 160] });

  return (
    <View style={styles.sevaCard}>
      {/* Category badge */}
      <View style={styles.sevaCategoryBadge}>
        <Text style={styles.sevaCategoryText}>{seva.category}</Text>
      </View>

      {/* Main row */}
      <View style={styles.sevaMainRow}>
        <View style={styles.sevaIconBox}>
          <Text style={styles.sevaIcon}>{seva.icon}</Text>
        </View>
        <View style={styles.sevaInfo}>
          <Text style={styles.sevaName}>{seva.name}</Text>
          <Text style={styles.sevaBenefit}>✨ {seva.benefit}</Text>
          <Text style={styles.sevaAmount}>₹ {seva.amount.toLocaleString()}</Text>
        </View>
        <View style={styles.sevaActions}>
          <TouchableOpacity style={styles.expandBtn} onPress={toggle} activeOpacity={0.8}>
            <FontAwesome name={expanded ? 'chevron-up' : 'chevron-down'} size={11} color={C.goldDark} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.donateSmallBtn} onPress={() => onDonate(seva)} activeOpacity={0.85}>
            <Text style={styles.donateSmallBtnText}>Donate</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Expandable description */}
      <Animated.View style={[styles.sevaDescWrap, { maxHeight, overflow: 'hidden' }]}>
        <View style={styles.sevaDescInner}>
          <Text style={styles.sevaDesc}>{seva.desc}</Text>
          <TouchableOpacity
            style={styles.donateLargeBtn}
            onPress={() => onDonate(seva)}
            activeOpacity={0.85}
          >
            <FontAwesome name="heart" size={12} color={C.deepBrown} style={{ marginRight: 6 }} />
            <Text style={styles.donateLargeBtnText}>Donate ₹{seva.amount} — {seva.name}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  sevaCard: {
    backgroundColor: C.white, borderRadius: 18,
    borderWidth: 1, borderColor: C.goldBorder, overflow: 'hidden',
    shadowColor: C.deepBrown, shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 2,
  },
  sevaCategoryBadge: {
    backgroundColor: C.deepBrown, paddingHorizontal: 12, paddingVertical: 4,
    alignSelf: 'flex-start', borderBottomRightRadius: 12,
  },
  sevaCategoryText: { fontSize: 8, color: C.goldDark, letterSpacing: 1.5, fontWeight: '800' },
  sevaMainRow:      { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  sevaIconBox: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: C.creamDark, borderWidth: 1, borderColor: C.goldBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  sevaIcon:    { fontSize: 26 },
  sevaInfo:    { flex: 1 },
  sevaName:    { fontSize: 13, fontWeight: '800', color: C.deepBrown, marginBottom: 2 },
  sevaBenefit: { fontSize: 10, color: C.saffron, fontStyle: 'italic', marginBottom: 4 },
  sevaAmount:  { fontSize: 16, fontWeight: '800', color: C.goldDark },
  sevaActions: { alignItems: 'center', gap: 8 },
  expandBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: C.creamDark, borderWidth: 1, borderColor: C.goldBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  donateSmallBtn: {
    backgroundColor: C.gold, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6,
  },
  donateSmallBtnText: { fontSize: 11, fontWeight: '800', color: C.deepBrown },
  sevaDescInner: {
    backgroundColor: C.creamDark, borderTopWidth: 1, borderTopColor: C.goldBorder, padding: 14,
  },
  sevaDesc: { fontSize: 12, color: C.warmBrown, lineHeight: 19, fontStyle: 'italic', marginBottom: 12 },
  donateLargeBtn: {
    backgroundColor: C.gold, borderRadius: 20,
    paddingVertical: 11, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  donateLargeBtnText: { fontSize: 12, fontWeight: '800', color: C.deepBrown },
});