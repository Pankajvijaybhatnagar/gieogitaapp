import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

function BhajanItem({ item, active, isPlaying, onPress }) {
  return (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [
        styles.item,
        active && styles.activeItem,
        pressed && styles.pressedItem,
      ]}
    >
      <View style={styles.coverContainer}>
        {item.cover ? (
          <Image
            source={{ uri: item.cover }}
            style={styles.cover}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Ionicons name="musical-notes" size={24} color="#FF7A00" />
          </View>
        )}

        {active && (
          <View style={styles.playingOverlay}>
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={18}
              color="#fff"
            />
          </View>
        )}
      </View>

      <View style={styles.details}>
        <Text
          style={[styles.title, active && styles.activeTitle]}
          numberOfLines={1}
        >
          {item.title}
        </Text>

        <Text style={styles.subtitle} numberOfLines={1}>
          {item.artist || "Gieogita Bhajan"}
        </Text>

        {!!item.plays && (
          <View style={styles.stats}>
            <Ionicons name="headset-outline" size={13} color="#888" />
            <Text style={styles.statsText}>
              {Number(item.plays).toLocaleString()} plays
            </Text>
          </View>
        )}
      </View>

      <View style={styles.right}>
        {item.durationText ? (
          <Text style={styles.duration}>{item.durationText}</Text>
        ) : null}

        <Ionicons
          name={active ? "musical-notes" : "play-circle-outline"}
          size={26}
          color={active ? "#FF7A00" : "#999"}
        />
      </View>
    </Pressable>
  );
}

export default function BhajanList({
  data,
  loading,
  refreshing,
  onRefresh,
  activeId,
  isPlaying,
  onSelect,
}) {
  if (loading && !data.length) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF7A00" />
        <Text style={styles.loadingText}>Loading bhajans...</Text>
      </View>
    );
  }

  if (!loading && !data.length) {
    return (
      <View style={styles.center}>
        <Ionicons name="musical-notes-outline" size={48} color="#bbb" />

        <Text style={styles.emptyTitle}>No bhajans found</Text>

        <Text style={styles.emptyText}>
          Bhajans will appear here when available.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <BhajanItem
          item={item}
          active={String(activeId) === String(item.id)}
          isPlaying={isPlaying}
          onPress={onSelect}
        />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 180,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginBottom: 5,
  },

  activeItem: {
    backgroundColor: "#FFF5EA",
  },

  pressedItem: {
    opacity: 0.75,
  },

  coverContainer: {
    width: 58,
    height: 58,
    borderRadius: 13,
    overflow: "hidden",
  },

  cover: {
    width: "100%",
    height: "100%",
  },

  coverPlaceholder: {
    flex: 1,
    backgroundColor: "#FFF1E3",
    alignItems: "center",
    justifyContent: "center",
  },

  playingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.38)",
    alignItems: "center",
    justifyContent: "center",
  },

  details: {
    flex: 1,
    marginLeft: 12,
    minWidth: 0,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222",
  },

  activeTitle: {
    color: "#FF7A00",
  },

  subtitle: {
    fontSize: 13,
    color: "#777",
    marginTop: 3,
  },

  stats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },

  statsText: {
    fontSize: 11,
    color: "#999",
  },

  right: {
    alignItems: "flex-end",
    gap: 6,
    marginLeft: 8,
  },

  duration: {
    fontSize: 11,
    color: "#888",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  loadingText: {
    marginTop: 12,
    color: "#777",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginTop: 14,
  },

  emptyText: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
    textAlign: "center",
  },
});