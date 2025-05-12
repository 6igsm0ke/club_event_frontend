import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";

export default function CategoryEventsScreen({ route, navigation }) {
  const { category } = route.params;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const month = date.toLocaleString("default", { month: "short" });
    return {
      day: date.getDate(),
      month,
    };
  };

  useEffect(() => {
    fetch("http://172.20.10.10:8000/api/v1/events/events/")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((event) =>
          event.type?.name?.toLowerCase().includes(category.toLowerCase())
        );
        setEvents(filtered);
      })
      .catch((err) => console.error("❌ Failed to load category events:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} color="#8f52c7" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{category} Events</Text>

      {events.length === 0 ? (
        <Text style={styles.noEvents}>No events found for this category.</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const { day, month } = formatDate(item.date);
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate("EventDetail", { eventId: item.id })
                }
              >
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.image} />
                ) : (
                  <View style={[styles.image, styles.noImage]}>
                    <Text style={{ color: "#555" }}>No image</Text>
                  </View>
                )}

                <View style={styles.textContainer}>
                  <Text style={styles.dateText}>{month}</Text>
                  <Text style={styles.dayText}>{day}</Text>
                </View>

                <View style={styles.info}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <Text style={styles.location}>📍 {item.location}</Text>
                  {item.type?.name && (
                    <Text style={styles.type}>🏷️ {item.type.name}</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f0f8",
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  noEvents: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 50,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 160,
  },
  noImage: {
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#8f52c7",
    borderRadius: 6,
    padding: 6,
    alignItems: "center",
  },
  dateText: {
    color: "#fff",
    fontSize: 12,
  },
  dayText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: "#888",
  },
  type: {
    fontSize: 14,
    color: "#444",
    marginTop: 4,
  },
});
