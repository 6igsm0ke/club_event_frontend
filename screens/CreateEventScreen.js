import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';  // Импортируем useNavigation

export default function CreateEventScreen() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const navigation = useNavigation();  // Инициализируем навигацию

  const handleSubmit = () => {
    const eventData = {
      title,
      description,
      location,
      date,
    };

    fetch("http://172.20.10.10:8000/api/v1/events/events/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create event");
        return res.json();
      })
      .then((data) => {
        console.log("✅ Event created:", data);
        Alert.alert("Success", "Event created successfully");
        
        // Очищаем поля формы после успешного создания
        setTitle("");
        setDescription("");
        setDate("");
        setLocation("");

        // Навигация на другой экран, например, на страницу со списком событий
        navigation.navigate('EventList');  // Убедитесь, что у вас есть экран EventList
      })
      .catch((err) => {
        console.error("❌ Error:", err);
        Alert.alert("Error", "Something went wrong");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create Event</Text>

      <TextInput
        placeholder="Event Title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Description"
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        placeholder="Date (YYYY-MM-DD)"
        style={styles.input}
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        placeholder="Location"
        style={styles.input}
        value={location}
        onChangeText={setLocation}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
    padding: 10,
  },
});
