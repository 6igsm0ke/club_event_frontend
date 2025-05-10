import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EventDetailScreen({ route }) {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://172.20.10.10:8000/api/v1/events/events/${eventId}/`)
      .then((res) => res.json())
      .then((data) => setEvent(data))
      .catch((err) => {
        console.error("❌ Failed to load event", err);
        Alert.alert("Error", "Failed to load event details.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRegister = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Not Authenticated", "Please log in first.");
        return;
      }

      const response = await fetch(
        `http://172.20.10.10:8000/api/v1/events/register/${eventId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        Alert.alert("✅ Registered", data.message || "You are registered!");
      } else {
        Alert.alert("❌ Error", data.message || "Failed to register.");
      }
    } catch (error) {
      console.error("❌ Register error:", error);
      Alert.alert("❌ Error", "Something went wrong.");
    }
  };

  if (loading || !event) {
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, marginTop: 50 }}
        color="#8f52c7"
      />
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {event.image && (
        <Image source={{ uri: event.image }} style={styles.image} />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.detailText}>Club: {event.club?.name}</Text>
        <Text style={styles.detailText}>Date: {formattedDate}</Text>
        <Text style={styles.detailText}>
          Time: {event.start_time} - {event.end_time}
        </Text>
        <Text style={styles.detailText}>Place: {event.location}</Text>
        {event.bonus && (
          <Text style={styles.detailText}>Others: {event.bonus} ⚡</Text>
        )}

        <View style={styles.membersRow}>
          <View style={styles.memberBox}>
            <Text style={styles.memberNumber}>{event.registered_count}</Text>
            <Text style={styles.memberLabel}>Submitted</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.memberBox}>
            <Text style={styles.memberNumber}>{event.max_members}</Text>
            <Text style={styles.memberLabel}>Overall</Text>
          </View>
        </View>

        <Text style={styles.description}>{event.description}</Text>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f6f0f8",
    padding: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },
  membersRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 12,
  },
  memberBox: {
    alignItems: "center",
    flex: 1,
  },
  memberNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4a4a4a",
  },
  memberLabel: {
    fontSize: 13,
    color: "#666",
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#ccc",
  },
  description: {
    fontSize: 14,
    color: "#444",
    marginVertical: 12,
  },
  registerButton: {
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
