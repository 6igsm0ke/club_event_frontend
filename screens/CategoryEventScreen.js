import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

export default function CategoryEventsScreen({ route, navigation }) {
  const { category } = route.params;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eventCard}
            onPress={() =>
              navigation.navigate("EventDetail", { eventId: item.id })
            }
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>📍 {item.location}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  eventCard: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: { fontSize: 16, fontWeight: "600" },
  subtitle: { fontSize: 14, color: "#666" },
});
