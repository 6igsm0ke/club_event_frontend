import React, { useState, useEffect } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function EventDetailScreen({ route }) {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const navigation = useNavigation();

  const isConference = event?.type?.name?.toLowerCase() === "conference";

  const speakers = [
    {
      id: 1,
      name: "UmarAdam Ibrahim",
      description: "Mobile application development",
      imageUrl: require("../assets/Umaragai.png"),
    },
    {
      id: 2,
      name: "Arai Abzal",
      description: "AI in Education",
      imageUrl: require("../assets/AbzalArai.jpg"),
    },
  ];

  const refreshAccessToken = async () => {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    try {
      const response = await fetch(
        "http://172.20.10.10:8000/api/v1/auth/refresh/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        }
      );

      const data = await response.json();
      if (data.access) {
        await AsyncStorage.setItem("accessToken", data.access);
        return data.access;
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  };

  const fetchUserRoles = async () => {
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
    } catch (error) {
      console.error("❌ Error loading profile:", error);
    }
  };

  useEffect(() => {
    fetchUserRoles();
    fetch(`http://172.20.10.10:8000/api/v1/events/events/${eventId}/`)
      .then((res) => res.json())
      .then((data) => setEvent(data))
      .catch(() => Alert.alert("Error", "Failed to load event details."))
      .finally(() => setLoading(false));
  }, []);

  const isStudent = userRoles.some((role) =>
    ["std", "student"].includes(role.code?.toLowerCase())
  );

  const handleRegister = async () => {
    setRegistering(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Not Authenticated", "Please log in first.");
        setRegistering(false);
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
      Alert.alert("❌ Error", "Something went wrong.");
    } finally {
      setRegistering(false);
    }
  };

  const formattedDate = new Date(event?.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  const deleteEvent = async () => {
    Alert.alert("Delete Event", "Are you sure you want to delete this event?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const token = await AsyncStorage.getItem("accessToken");
          if (!token) {
            Alert.alert("Not Authenticated", "Please log in first.");
            return;
          }

          try {
            const response = await fetch(
              `http://172.20.10.10:8000/api/v1/events/events/${eventId}/`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (response.ok) {
              navigation.goBack();
              Alert.alert(
                "Event Deleted",
                "The event has been successfully deleted."
              );
            } else {
              Alert.alert("❌ Error", "Failed to delete the event.");
            }
          } catch (error) {
            console.error("❌ Error deleting event:", error);
            Alert.alert("❌ Error", "Something went wrong.");
          }
        },
      },
    ]);
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {!isStudent && (
          <View style={styles.topBarActions}>
            <TouchableOpacity
              style={styles.topBarButton}
              onPress={() => navigation.navigate("EditEvent", { eventId })}
            >
              <Ionicons name="create-outline" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.topBarButton} onPress={deleteEvent}>
              <MaterialIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      </View>

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

        <TouchableOpacity
          style={[styles.registerButton, registering && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={registering}
        >
          {registering ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>Register</Text>
          )}
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
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  topBarActions: {
    flexDirection: "row",
    gap: 10,
  },
  topBarButton: {
    padding: 8,
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
