import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import TransformInNineStepsCard from './TransformInNineStepsCard';
import { transformInNineStepsData } from './TransformInNineStepsData';
import { styles } from './TransformInNineStepsStyles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CARD_WIDTH = SCREEN_WIDTH * 0.74;
const CARD_GAP = 14;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;
const SIDE_SPACING = (SCREEN_WIDTH - CARD_WIDTH) / 2;

export default function TransformInNineSteps() {
  const flatListRef = useRef(null);

  const scrollX = useRef(new Animated.Value(0)).current;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const fetchCourses = async () => {
    try {
      setLoading(true);

      /*
      LATER API INTEGRATION:

      const response = await courseServices.getPaidCourses({
        type: 'paid',
        limit: 9,
      });

      const data = response?.data?.data;

      if (
        response?.success &&
        response?.data?.status &&
        Array.isArray(data)
      ) {
        setCourses(data);
      } else {
        setCourses([]);
      }
      */

      setCourses(transformInNineStepsData);
    } catch (error) {
      console.error('Error fetching Transform In Nine Steps:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleMomentumScrollEnd = event => {
    const offsetX = event.nativeEvent.contentOffset.x;

    const index = Math.round(offsetX / SNAP_INTERVAL);

    if (index >= 0 && index < courses.length) {
      setActiveIndex(index);
    }
  };

  const goToSlide = index => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
    });

    setActiveIndex(index);
  };

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transform Your Life</Text>

        <Text style={styles.headerSubtitle}>
          with <Text style={styles.headerHighlight}>9 Steps</Text> with Gita
          Manishi
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading journey...</Text>
        </View>
      ) : courses.length > 0 ? (
        <>
          <View style={styles.sliderArea}>
            <View pointerEvents="none" style={styles.backgroundCardThree} />

            <View pointerEvents="none" style={styles.backgroundCardTwo} />

            <View pointerEvents="none" style={styles.backgroundCardOne} />

            <Animated.FlatList
              ref={flatListRef}
              data={courses}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => String(item.id)}
              renderItem={({ item, index }) => (
                <TransformInNineStepsCard
                  item={item}
                  index={index}
                  scrollX={scrollX}
                  snapInterval={SNAP_INTERVAL}
                  cardWidth={CARD_WIDTH}
                />
              )}
              contentContainerStyle={{
                paddingHorizontal: SIDE_SPACING,
                paddingVertical: 24,
              }}
              ItemSeparatorComponent={() => (
                <View style={{ width: CARD_GAP }} />
              )}
              snapToInterval={SNAP_INTERVAL}
              snapToAlignment="start"
              decelerationRate="fast"
              disableIntervalMomentum
              bounces={false}
              onMomentumScrollEnd={handleMomentumScrollEnd}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        x: scrollX,
                      },
                    },
                  },
                ],
                {
                  useNativeDriver: true,
                },
              )}
              scrollEventThrottle={16}
              getItemLayout={(_, index) => ({
                length: SNAP_INTERVAL,
                offset: SNAP_INTERVAL * index,
                index,
              })}
            />
          </View>

          <View style={styles.pagination}>
            {courses.map((_, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => goToSlide(index)}>
                <View
                  style={[
                    styles.paginationDot,
                    activeIndex === index && styles.paginationDotActive,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.pageNumberContainer}>
            <Text style={styles.currentPage}>
              {String(activeIndex + 1).padStart(2, '0')}
            </Text>

            <Text style={styles.pageSlash}>/</Text>

            <Text style={styles.totalPage}>
              {String(courses.length).padStart(2, '0')}
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Courses are coming soon.</Text>
        </View>
      )}
    </View>
  );
}
