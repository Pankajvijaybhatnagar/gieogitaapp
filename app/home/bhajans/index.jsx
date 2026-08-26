import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import BhajanList from "@/components/bhajans/BhajanList";
import MusicPlayer from "@/components/bhajans/MusicPlayer";
import bhajanServices from "@/lib/services/bhajanServices";

function normalizeBhajan(item) {
  return {
    ...item,

    id: item.id,

    title:
      item.title ||
      item.name ||
      item.bhajan_name ||
      "Untitled Bhajan",

    artist:
      item.artist ||
      item.singer ||
      item.author ||
      item.artist_name ||
      "",

    audioUrl:
      item.audio_full_url ||
      item.audio_url ||
      item.file_full_url ||
      item.file_url ||
      item.audio ||
      "",

    cover:
      item.cover_image_full_url ||
      item.cover_image_url ||
      item.thumbnail_full_url ||
      item.thumbnail_url ||
      item.image_full_url ||
      item.image_url ||
      "",

    plays:
      item.play_count ||
      item.plays ||
      item.views ||
      0,

    durationText:
      item.duration_formatted ||
      item.duration_text ||
      "",
  };
}

export default function BhajansPage() {
  const [bhajans, setBhajans] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");

  const countedTracks = useRef(new Set());

  const activeTrack = useMemo(() => {
    if (selectedIndex < 0) {
      return null;
    }

    return bhajans[selectedIndex] || null;
  }, [bhajans, selectedIndex]);

  const fetchBhajans = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await bhajanServices.getPublicBhajans({
        page: 1,
        limit: 100,
      });

      const rawData =
        response?.data?.data ||
        response?.data ||
        response?.bhajans ||
        [];

      const list = Array.isArray(rawData)
        ? rawData.map(normalizeBhajan)
        : [];

      setBhajans(list);
    } catch (err) {
      console.log("Fetch bhajans error:", err);

      setError(
        err?.message ||
          "Unable to load bhajans. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBhajans();
  }, [fetchBhajans]);

  const handleSelectTrack = useCallback(
    (track) => {
      const index = bhajans.findIndex(
        (item) => String(item.id) === String(track.id)
      );

      if (index === -1) {
        return;
      }

      setSelectedIndex(index);
    },
    [bhajans]
  );

  const handlePrevious = useCallback(() => {
    setSelectedIndex((current) => {
      if (current <= 0) {
        return current;
      }

      return current - 1;
    });
  }, []);

  const handleNext = useCallback(() => {
    setSelectedIndex((current) => {
      if (current < 0 || current >= bhajans.length - 1) {
        return current;
      }

      return current + 1;
    });
  }, [bhajans.length]);

  const handleTrackStarted = useCallback(async (track) => {
    if (!track?.id) {
      return;
    }

    const key = String(track.id);

    if (countedTracks.current.has(key)) {
      return;
    }

    countedTracks.current.add(key);

    try {
      await bhajanServices.playBhajan(track.id);

      setBhajans((current) =>
        current.map((item) =>
          String(item.id) === key
            ? {
                ...item,
                plays: Number(item.plays || 0) + 1,
              }
            : item
        )
      );
    } catch (err) {
      console.log("Play count error:", err);

      countedTracks.current.delete(key);
    }
  }, []);

  const closePlayer = useCallback(() => {
    setSelectedIndex(-1);
    setIsPlaying(false);
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <Ionicons name="chevron-back" size={25} color="#222" />
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.heading}>Bhajans</Text>
          <Text style={styles.subheading}>
            Listen. Remember. Connect.
          </Text>
        </View>

        <Pressable
          onPress={() => fetchBhajans(true)}
          style={styles.headerButton}
        >
          <Ionicons name="refresh" size={22} color="#222" />
        </Pressable>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Ionicons
            name="alert-circle-outline"
            size={20}
            color="#B42318"
          />

          <Text style={styles.errorText}>{error}</Text>

          <Pressable onPress={() => fetchBhajans()}>
            <Text style={styles.retry}>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>All Bhajans</Text>

        {!!bhajans.length && (
          <Text style={styles.count}>
            {bhajans.length} tracks
          </Text>
        )}
      </View>

      <View style={styles.listContainer}>
        <BhajanList
          data={bhajans}
          loading={loading}
          refreshing={refreshing}
          onRefresh={() => fetchBhajans(true)}
          activeId={activeTrack?.id}
          isPlaying={isPlaying}
          onSelect={handleSelectTrack}
        />
      </View>

      {activeTrack && (
        <MusicPlayer
          track={activeTrack}
          isFirst={selectedIndex === 0}
          isLast={selectedIndex === bhajans.length - 1}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onClose={closePlayer}
          onPlayingChange={setIsPlaying}
          onTrackStarted={handleTrackStarted}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  header: {
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ECECEC",
  },

  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  headerText: {
    flex: 1,
    alignItems: "center",
  },

  heading: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1D1D1D",
  },

  subheading: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },

  sectionHeader: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#222",
  },

  count: {
    fontSize: 12,
    color: "#888",
  },

  listContainer: {
    flex: 1,
  },

  errorBox: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FEF3F2",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  errorText: {
    flex: 1,
    color: "#B42318",
    fontSize: 13,
  },

  retry: {
    color: "#FF7A00",
    fontWeight: "700",
    fontSize: 13,
  },
});