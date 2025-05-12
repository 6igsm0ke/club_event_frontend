import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function EditProfileScreen({ navigation }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    birth_date: "",
    phone: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      try {
        const res = await fetch(
          "http://172.20.10.10:8000/api/v1/auth/users/me/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          birth_date: data.birth_date || "",
          phone: data.phone || "",
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleClearField = (field) => {
    setForm({ ...form, [field]: "" });
  };

  const handleSave = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    try {
      const res = await fetch(
        "http://172.20.10.10:8000/api/v1/auth/users/me/",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      if (res.ok) {
        Alert.alert("Success", "Profile updated successfully");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to update profile");
      }
    } catch (error) {
      console.error("❌ Save error:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.avatarWrapper}>
          <Image source={require("../assets/ava.png")} style={styles.avatar} />
          <TouchableOpacity style={styles.editAvatar}>
            <MaterialIcons name="edit" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.row}>
          <View style={styles.inputWrapper}>
            <TextInput
              value={form.first_name}
              onChangeText={(text) => handleChange("first_name", text)}
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#999"
            />
            {form.first_name.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => handleClearField("first_name")}
              >
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              value={form.last_name}
              onChangeText={(text) => handleChange("last_name", text)}
              style={styles.input}
              placeholder="Surname"
              placeholderTextColor="#999"
            />
            {form.last_name.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => handleClearField("last_name")}
              >
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            value={form.birth_date}
            onChangeText={(text) => handleChange("birth_date", text)}
            style={styles.input}
            placeholder="Birth of date"
            placeholderTextColor="#999"
          />
          {form.birth_date.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => handleClearField("birth_date")}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            value={form.phone}
            onChangeText={(text) => handleChange("phone", text)}
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#999"
          />
          {form.phone.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => handleClearField("phone")}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    height: 200,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  topBar: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },
  avatarWrapper: {
    position: "absolute",
    bottom: -50,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },
  editAvatar: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#8f52c7",
    borderRadius: 10,
    padding: 4,
  },
  form: {
    marginTop: 70,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputWrapper: {
    position: "relative",
    flex: 1,
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  clearButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  saveButton: {
    backgroundColor: "#4f46e5",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
