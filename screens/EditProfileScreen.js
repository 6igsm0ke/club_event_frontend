import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
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
        const res = await fetch("http://172.20.10.10:8000/api/v1/auth/users/me/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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

  const handleSave = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    try {
      const res = await fetch("http://172.20.10.10:8000/api/v1/auth/users/me/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

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
        {/* <Image
          source={require("../assets/header-bg.png")}
          style={styles.headerImage}
        /> */}
        <View style={styles.avatarWrapper}>
          <Image source={require("../assets/ava.png")} style={styles.avatar} />
          <TouchableOpacity style={styles.editAvatar}>
            <MaterialIcons name="edit" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.row}>
          <TextInput
            value={form.first_name}
            onChangeText={(text) => handleChange("first_name", text)}
            style={styles.input}
            placeholder="Name"
          />
          <TextInput
            value={form.last_name}
            onChangeText={(text) => handleChange("last_name", text)}
            style={styles.input}
            placeholder="Surname"
          />
        </View>

        <TextInput
          value={form.birth_date}
          onChangeText={(text) => handleChange("birth_date", text)}
          style={styles.fullInput}
          placeholder="Birth of date"
        />
        <TextInput
          value={form.phone}
          onChangeText={(text) => handleChange("phone", text)}
          style={styles.fullInput}
          placeholder="Phone Number"
        />

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
  headerImage: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 200,
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
  input: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 5,
  },
  fullInput: {
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
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
