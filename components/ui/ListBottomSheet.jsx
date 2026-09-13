import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Easing,
    Keyboard,
    Modal,
    PanResponder,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { COLORS as BASE, RGB } from '@/constants/brandColors';
import { hairline, radii, spacing } from '@/constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_MIN_HEIGHT = 280;
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.78;
const DRAG_CLOSE_DISTANCE = 120;

const COLORS = {
  background: BASE.creamDark,
  card: BASE.cream,
  brown: BASE.richBrown,
  darkBrown: BASE.deepBrown,
  mediumBrown: BASE.warmBrown,
  border: hairline,
  white: BASE.white,
};

const getItemLabel = item =>
  typeof item === 'object' && item !== null ? item.label : String(item);

const getItemValue = item =>
  typeof item === 'object' && item !== null && 'value' in item
    ? item.value
    : item;

export default function ListBottomSheet({
  visible,
  title = 'Choose an option',
  options = [],
  value,
  onSelect,
  onClose,
  loading = false,
  searchPlaceholder,
}) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const searchInputRef = useRef(null);
  const [search, setSearch] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return options;
    return options.filter(item =>
      getItemLabel(item).toLowerCase().includes(query),
    );
  }, [options, search]);

  const animateClose = useCallback(
    (notify = true) => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 220,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (notify) onClose?.();
      });
    },
    [onClose, opacity, translateY],
  );

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        gesture.dy > 4 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) translateY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > DRAG_CLOSE_DISTANCE || gesture.vy > 1.2) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          animateClose();
          return;
        }
        Animated.spring(translateY, {
          toValue: 0,
          tension: 70,
          friction: 10,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  useEffect(() => {
    const handleKeyboardShow = event => {
      setKeyboardHeight(event.endCoordinates?.height || 0);
    };
    const handleKeyboardHide = () => setKeyboardHeight(0);
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSubscription = Keyboard.addListener(
      showEvent,
      handleKeyboardShow,
    );
    const hideSubscription = Keyboard.addListener(
      hideEvent,
      handleKeyboardHide,
    );

    if (!visible) {
      animateClose(false);
      setKeyboardHeight(0);
      showSubscription.remove();
      hideSubscription.remove();
      return undefined;
    }

    setSearch('');
    translateY.setValue(SCREEN_HEIGHT);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [animateClose, opacity, translateY, visible]);

  const rowsHeight =
    loading || filteredOptions.length === 0 ? 160 : filteredOptions.length * 60;
  const availableHeight = Math.max(
    SHEET_MIN_HEIGHT,
    SCREEN_HEIGHT - keyboardHeight,
  );
  const maxSheetHeight = keyboardHeight
    ? Math.max(SHEET_MIN_HEIGHT, availableHeight * 0.8)
    : SHEET_MAX_HEIGHT;
  const sheetHeight = Math.min(
    Math.max(250 + rowsHeight, SHEET_MIN_HEIGHT),
    maxSheetHeight,
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => animateClose()}>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, { opacity }]} />
        <Pressable style={styles.closeArea} onPress={animateClose} />

        <Animated.View
          style={[
            styles.sheet,
            { height: sheetHeight, transform: [{ translateY }] },
          ]}>
          <BlurView
            intensity={75}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, styles.glassOverlay]}
          />
          <View {...panResponder.panHandlers} style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.titleIcon}>
              <Ionicons name="list" size={17} color={COLORS.white} />
            </View>
            <View style={styles.titleBlock}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.count}>
                {loading ? 'Loading...' : `${filteredOptions.length} options`}
              </Text>
            </View>
            <Pressable
              onPress={animateClose}
              hitSlop={12}
              style={styles.closeButton}>
              <Ionicons name="close" size={19} color={COLORS.brown} />
            </Pressable>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons
              name="search-outline"
              size={17}
              color={COLORS.mediumBrown}
            />
            <TextInput
              ref={searchInputRef}
              value={search}
              onChangeText={setSearch}
              placeholder={searchPlaceholder || `Search ${title.toLowerCase()}`}
              placeholderTextColor={COLORS.mediumBrown}
              returnKeyType="search"
              style={styles.searchInput}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')} hitSlop={8}>
                <Ionicons
                  name="close-circle"
                  size={17}
                  color={COLORS.mediumBrown}
                />
              </Pressable>
            )}
          </View>

          {loading ? (
            <View style={styles.loadingView}>
              <ActivityIndicator size="small" color={COLORS.brown} />
              <Text style={styles.loadingText}>Loading options...</Text>
            </View>
          ) : (
            <ScrollView
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              {filteredOptions.length === 0 ? (
                <View style={styles.emptyView}>
                  <Ionicons
                    name="search-outline"
                    size={27}
                    color={COLORS.mediumBrown}
                  />
                  <Text style={styles.emptyText}>No options found</Text>
                </View>
              ) : (
                filteredOptions.map((item, index) => {
                  const itemValue = getItemValue(item);
                  const selected = itemValue === value;
                  return (
                    <View key={`${getItemLabel(item)}-${index}`}>
                      <Pressable
                        onPress={() => {
                          Haptics.selectionAsync();
                          onSelect?.(itemValue, item);
                        }}
                        style={({ pressed }) => [
                          styles.optionRow,
                          selected && styles.selectedOption,
                          pressed && styles.optionPressed,
                        ]}>
                        <View style={styles.optionContent}>
                          <Text
                            style={[
                              styles.optionText,
                              selected && styles.selectedOptionText,
                            ]}>
                            {getItemLabel(item)}
                          </Text>
                          {selected && (
                            <Ionicons
                              name="checkmark-circle"
                              size={18}
                              color={COLORS.brown}
                              style={styles.selectedIcon}
                            />
                          )}
                        </View>
                      </Pressable>
                      {index < filteredOptions.length - 1 && (
                        <View style={styles.optionSeparator} />
                      )}
                    </View>
                  );
                })
              )}
            </ScrollView>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `rgba(${RGB.deepBrown},0.55)`,
  },
  closeArea: { ...StyleSheet.absoluteFillObject },
  sheet: {
    width: '100%',
    minHeight: SHEET_MIN_HEIGHT,
    maxHeight: SHEET_MAX_HEIGHT,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingTop: spacing.sm + 2,
    paddingBottom: Platform.OS === 'ios' ? 27 : 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 18,
    overflow: 'hidden',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.9)',
  },
  glassOverlay: { backgroundColor: 'rgba(255,255,255,0.34)' },
  handle: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: `rgba(${RGB.maroon},0.3)`,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  titleIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.brown,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: { flex: 1 },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.darkBrown },
  count: { fontSize: 12, fontWeight: '600', color: COLORS.brown, marginTop: 1 },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    height: 48,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    gap: spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.darkBrown,
    paddingVertical: 0,
  },
  list: { flex: 1 },
  listContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  optionRow: {
    minHeight: 60,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    backgroundColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: `rgba(${RGB.maroon},0.10)`,
    borderWidth: 1,
    borderColor: `rgba(${RGB.maroon},0.22)`,
  },
  optionPressed: { opacity: 0.85 },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkBrown,
    textAlign: 'center',
  },
  selectedOptionText: { color: COLORS.darkBrown, fontWeight: '700' },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  selectedIcon: { marginLeft: spacing.xs },
  optionSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
  },
  loadingView: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 12, color: COLORS.mediumBrown, marginTop: 7 },
  emptyView: { alignItems: 'center', justifyContent: 'center', paddingTop: 45 },
  emptyText: { fontSize: 12, color: COLORS.mediumBrown, marginTop: 7 },
});
