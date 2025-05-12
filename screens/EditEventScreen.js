import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function EditEventScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { eventId } = route.params;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(""); // This can be a string in the format 'YYYY-MM-DD'
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to format the date correctly if needed
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const formattedDate = date.toISOString().split("T")[0]; // 'YYYY-MM-DD'
    return formattedDate;
  };

  useEffect(() => {
    // Fetch the event details using the eventId
    fetch(`http://172.20.10.10:8000/api/v1/events/events/${eventId}/`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data);
        setTitle(data.title);
        setDescription(data.description);
        setDate(formatDate(data.date)); // Format date as 'YYYY-MM-DD'
        setLocation(data.location);
      })
      .catch((err) => {
        console.error("❌ Failed to load event", err);
        Alert.alert("Error", "Failed to load event details.");
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  const handleSubmit = async () => {
    // Validate inputs
    if (!title || !description || !date || !location) {
      Alert.alert("❌ Error", "Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Not Authenticated", "Please log in first.");
        return;
      }

      const updatedEvent = {
        title,
        description,
        date,
        location,
      };

      // Send the PATCH request to update the event
      const response = await fetch(
        `http://172.20.10.10:8000/api/v1/events/events/${eventId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedEvent), // Send the event data as JSON
        }
      );

      const data = await response.json();
      if (response.ok) {
        Alert.alert("✅ Event Updated", "The event has been successfully updated.");
        navigation.goBack(); // Go back to the previous screen after successful update
      } else {
        Alert.alert("❌ Error", data.message || "Failed to update the event.");
      }
    } catch (error) {
      console.error("❌ Error updating event:", error);
      Alert.alert("❌ Error", "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearField = (setter) => {
    setter("");
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
      <Text style={styles.header}>Edit Event</Text>

      {/* Event Title */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Event Title"
          value={title}
          onChangeText={setTitle}
        />
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => clearField(setTitle)}
        >
          <Ionicons name="close-circle" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Description */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Description"
          multiline
          value={description}
          onChangeText={setDescription}
        />
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => clearField(setDescription)}
        >
          <Ionicons name="close-circle" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Date */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
        />
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => clearField(setDate)}
        >
          <Ionicons name="close-circle" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Location */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => clearField(setLocation)}
        >
          <Ionicons name="close-circle" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Update Event</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f0f8",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  inputContainer: {
    position: "relative",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderColor: "#ccc",
    borderWidth: 1,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  clearButton: {
    position: "absolute",
    right: 10,
    top: 10,
  },
});
