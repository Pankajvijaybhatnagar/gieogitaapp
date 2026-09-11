import { createContext, useContext, useEffect, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Animated } from 'react-native';

const HeaderScrollContext = createContext(null);

// The Drawer's header (app/home/_layout.jsx) is a single shared component
// rendered above whichever screen is currently active — it has no direct
// access to that screen's own ScrollView. This context carries one shared
// Animated.Value for the current scroll offset so the header can fade its
// blur in as the active screen scrolls, and any screen can opt in just by
// spreading `useHeaderScrollProps()` onto its outer ScrollView.
export function HeaderScrollProvider({ children }) {
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <HeaderScrollContext.Provider value={scrollY}>
      {children}
    </HeaderScrollContext.Provider>
  );
}

export function useHeaderScrollY() {
  return useContext(HeaderScrollContext);
}

// Spread onto a screen's outer ScrollView:
//   <ScrollView {...useHeaderScrollProps()} ...>
// Resets the shared value to 0 whenever this screen gains focus, so the
// header doesn't briefly show whatever scroll position was left over from
// the previously-open screen.
export function useHeaderScrollProps() {
  const scrollY = useHeaderScrollY();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      scrollY?.setValue(0);
    }
  }, [isFocused, scrollY]);

  if (!scrollY) {
    return {};
  }

  return {
    // useNativeDriver: false — with `true`, Animated.event returns the raw
    // native-event object instead of a callable handler, which only works
    // when attached to an Animated.* component. These screens use plain
    // ScrollViews, which need a real JS function for `onScroll`.
    onScroll: Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
      { useNativeDriver: false },
    ),
    scrollEventThrottle: 16,
  };
}
