import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // For icons

export default function NavigationBar({ navigation }) {
  return (
    <View style={styles.navBar}>
      {/* Home Button */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("HomeScreen")}
      >
        <MaterialCommunityIcons name="home" size={30} color="white" />
        <Text style={styles.navText}>Home</Text> {/* Wrap text inside <Text> */}
      </TouchableOpacity>

      {/* Search Button (Uncomment if needed) */}
      {/* <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Search')}>
        <MaterialCommunityIcons name="magnify" size={30} color="white" />
        <Text style={styles.navText}>Search</Text>
      </TouchableOpacity> */}

      {/* Chat Button (Uncomment if needed) */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Chat")}
      >
        <MaterialCommunityIcons name="chat" size={30} color="white" />
        <Text style={styles.navText}>Chat</Text>
      </TouchableOpacity>

      {/* Profile Button (Uncomment if needed) */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
        <MaterialCommunityIcons name="account" size={30} color="white" />
        <Text style={styles.navText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-evenly", // равномерные промежутки
    alignItems: "center",
    backgroundColor: "#2C3E50",
    height: 50,
    width: "85%", // уже, чтобы не растягивался
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    borderRadius: 40, // скруглённый бар
    paddingHorizontal: 10, // внутренняя отступка
    zIndex: 10,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1, // равномерная ширина каждому элементу
  },
  navText: {
    color: "white",
    fontSize: 12,
    marginTop: 2,
  },
});
