import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";

export default function CreateEventScreen() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [eventType, setEventType] = useState("");
  const [types, setTypes] = useState([]);
  const [image, setImage] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetch("http://172.20.10.10:8000/api/v1/events/types/")
      .then((res) => res.json())
      .then((data) => setTypes(data))
      .catch((err) => console.error("❌ Failed to load types:", err));
  }, []);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Allow access to media library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const refreshAccessToken = async () => {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token");

    const response = await fetch("http://172.20.10.10:8000/api/v1/auth/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) throw new Error("Failed to refresh token");

    const data = await response.json();
    await AsyncStorage.setItem("accessToken", data.access);
    return data.access;
  };

  const submitEvent = async (tokenToUse) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("date", date);
    formData.append("type", eventType);

    if (image) {
      formData.append("image", {
        uri: image.uri,
        type: "image/jpeg",
        name: "event.jpg",
      });
    }

    return fetch("http://172.20.10.10:8000/api/v1/events/events/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenToUse}`,
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });
  };

  const handleSubmit = async () => {
    if (!title || !description || !location || !date || !eventType) {
      return Alert.alert("Error", "Please fill out all fields.");
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return Alert.alert("Error", "Date must be in YYYY-MM-DD format.");
    }

    try {
      let token = await AsyncStorage.getItem("accessToken");
      let response = await submitEvent(token);

      if (response.status === 401) {
        // Try refresh
        token = await refreshAccessToken();
        response = await submitEvent(token);
      }

      if (!response.ok) throw new Error("Failed to create event");
      await response.json();
      Alert.alert("Success", "Event created!");
      navigation.navigate("EventList");
    } catch (err) {
      console.error("❌ Error:", err);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Create Event</Text>

      <TextInput placeholder="Event Title" style={styles.input} value={title} onChangeText={setTitle} />
      <TextInput
        placeholder="Description"
        style={[styles.input, { height: 100 }]}
        multiline
        value={description}
        onChangeText={setDescription}
      />
      <TextInput placeholder="Date (YYYY-MM-DD)" style={styles.input} value={date} onChangeText={setDate} />
      <TextInput placeholder="Location" style={styles.input} value={location} onChangeText={setLocation} />

      <Text style={styles.label}>Event Type</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={eventType} onValueChange={setEventType}>
          <Picker.Item label="Select a type..." value="" />
          {types.map((type) => (
            <Picker.Item key={type.id} label={type.name} value={String(type.id)} />
          ))}
        </Picker>
      </View>

      <Button title="Pick Image" onPress={pickImage} />
      {image && <Image source={{ uri: image.uri }} style={styles.previewImage} />}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Event</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f6f0f8",
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: "#555",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#8f52c7",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  previewImage: {
    width: "100%",
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
  },
});
