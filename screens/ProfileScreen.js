import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const imageMap = {
  "vision.png": require("../assets/vision.png"),
  "qamqor.png": require("../assets/qamqor.png"),
  "smmelo.png": require("../assets/smmelo.png"),
  "we.png": require("../assets/we.png"),
  "user.png": require("../assets/ava.png"),
  "card.png": require("../assets/card.png"),
};

const getImage = (name) => imageMap[name] || imageMap["card.png"];

const clubs = [
  {
    name: "Vision Club",
    icon: "vision.png",
    description: "Grow, volunteer, help, inspire.",
  },
  { name: "Qamqor Club", icon: "qamqor.png", description: "Charity club." },
  {
    name: "SMMelo",
    icon: "smmelo.png",
    description: "Learn social media with us.",
  },
  {
    name: "We Project",
    icon: "we.png",
    description: "Coding & branding with passion.",
  },
];

const events = [
  { time: "10:00–13:00", title: "UmarAdam Ibrahim", location: "RED hall" },
  {
    time: "14:00–15:00",
    title: "Spring Hiking Trip",
    description: "Define the problem or question...",
    location: "Mountain Base",
  },
  { time: "19:00–20:00", title: "EDU night", location: "Campus Auditorium" },
];

export default function UserProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProcess, setShowProcess] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const response = await fetch(
          "http://172.20.10.10:8000/api/v1/auth/users/me/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Failed to load user data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#8f52c7" />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <Image source={getImage("user.png")} style={styles.profileImage} />
        <Text style={styles.userName}>
          {userData?.first_name} {userData?.last_name}
        </Text>
        <Text style={styles.email}>{userData?.email}</Text>
        <Text style={styles.userStats}>1200 Vol. Hours | 22 Projects</Text>

        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            await AsyncStorage.clear();
            navigation.reset({
              index: 0,
              routes: [{ name: "SignIn" }],
            });
          }}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {!showProcess ? (
          <>
            <TouchableOpacity style={styles.activeTab}>
              <Text style={styles.tabText}>Clubs</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.inactiveTab}
              onPress={() => setShowProcess(true)}
            >
              <Text style={styles.tabText}>Process</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={() => setShowProcess(false)}>
            <Text style={styles.tabText}>← Back to Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {!showProcess ? (
        <View style={styles.clubList}>
          {clubs.map((club, index) => (
            <View key={index} style={styles.clubCard}>
              <Image source={getImage(club.icon)} style={styles.clubIcon} />
              <View style={styles.clubInfo}>
                <Text style={styles.clubName}>{club.name}</Text>
                <Text style={styles.clubDescription}>{club.description}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={{ paddingHorizontal: 10 }}>
          {events.map((event, index) => (
            <View key={index} style={styles.eventCard}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventTime}>
                {event.time} — {event.location}
              </Text>
              {event.description && (
                <Text style={styles.eventDescription}>{event.description}</Text>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f8ff",
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "gray",
    marginBottom: 8,
  },
  userStats: {
    fontSize: 14,
    color: "#777",
  },
  editProfileButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 10,
  },
  editProfileText: {
    color: "#fff",
    fontWeight: "bold",
  },
  logoutButton: {
    padding: 10,
  },
  logoutText: {
    color: "red",
    fontSize: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#4A90E2",
    paddingBottom: 5,
  },
  inactiveTab: {
    paddingBottom: 5,
  },
  tabText: {
    fontSize: 16,
    color: "#4A90E2",
  },
  clubList: {
    paddingHorizontal: 10,
  },
  clubCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  clubIcon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  clubInfo: {
    flex: 1,
  },
  clubName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  clubDescription: {
    fontSize: 14,
    color: "#777",
  },
  eventCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  eventTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: "#666",
  },
  eventDescription: {
    marginTop: 6,
    fontSize: 14,
    color: "#444",
  },
});
