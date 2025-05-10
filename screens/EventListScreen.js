import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function EventListScreen() {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState([]);

  const refreshAccessToken = async () => {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    try {
      const response = await fetch("http://172.20.10.10:8000/api/v1/auth/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      const data = await response.json();
      if (data.access) {
        await AsyncStorage.setItem("accessToken", data.access);
        return data.access;
      } else {
        console.error("❌ Failed to refresh token:", data);
        return null;
      }
    } catch (err) {
      console.error("❌ Refresh error:", err);
      return null;
    }
  };

  const fetchProfile = async () => {
    let token = await AsyncStorage.getItem("accessToken");
    if (!token) return;

    const tryFetch = async (accessToken) => {
      return await fetch("http://172.20.10.10:8000/api/v1/auth/users/me/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
    };

    try {
      let response = await tryFetch(token);

      if (response.status === 401) {
        token = await refreshAccessToken();
        if (!token) return;
        response = await tryFetch(token);
      }

      const profileData = await response.json();
      setUserRoles(profileData.roles);
      console.log("👤 Profile data:", profileData.roles);
    } catch (error) {
      console.error("❌ Error loading profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    fetch("http://172.20.10.10:8000/api/v1/events/events/")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("❌ Error loading events:", err))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const month = date.toLocaleString("default", { month: "short" });
    return {
      day: date.getDate(),
      month,
    };
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        style={{ marginTop: 50 }}
        color="#8f52c7"
      />
    );
  }

  return (
    <View style={styles.container}>
      {!userRoles.some((role) =>
        ["std", "student", "STD"].includes(role.code.toLowerCase())
      ) && (
        <TouchableOpacity
          onPress={() => navigation.navigate("CreateEvent")}
          style={styles.createButton}
        >
          <Text style={styles.createButtonText}>➕ Create Event</Text>
        </TouchableOpacity>
      )}

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f0f8",
    padding: 16,
  },
  createButton: {
    backgroundColor: "#8f52c7",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
