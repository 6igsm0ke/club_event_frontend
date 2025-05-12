import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";

const SpeakerInfoScreen = ({ route, navigation }) => {
  const { speaker } = route.params;

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="#3e4152"
          style={styles.leftIcon}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Speaker Info</Text>
        <View style={styles.rightIcons}>
        </View>
      </View>

      {/* Speaker Card Section */}
      <View style={styles.speakerCard}>
        <View style={styles.avatarSection}>
          <Image
            source={speaker.imageUrl} // Dynamically use the passed image
            style={styles.avatarImage}
          />
          <View style={styles.experienceBadge}>
            <Text style={styles.experienceBadgeText}>15 years experience</Text>
          </View>
        </View>
        <View style={styles.focusBadge}>
          <Text style={styles.focusText}>
            Focus: {speaker.description}{" "}
            {/* Dynamically use the passed description */}
          </Text>
        </View>
        <Text style={styles.speakerName}>{speaker.name}</Text>
        <Text style={styles.locationText}>Location: New York, USA</Text>
        <Text style={styles.speakerSpecialty}>
          Specialty: {speaker.description}{" "}
          {/* Dynamically use the passed description */}
        </Text>
        <View style={styles.iconRow}>
          <FontAwesome name="star" size={20} color="#3e4152" />
          <Text style={styles.iconText}>5</Text>
          <Ionicons name="people" size={20} color="#3e4152" />
          <Text style={styles.iconText}>40</Text>
          <MaterialIcons name="schedule" size={20} color="#3e4152" />
        </View>
      </View>

      {/* Profile, Career Path, and Highlights Sections */}
      <Section
        title="Profile"
        content="Dr. UmarAdam Ibrahim is a seasoned expert specializing in IT and mobile application development. With over 15 years of experience, he has successfully led multiple high-impact projects that leverage cutting-edge technologies to create user-centric mobile solutions.
" // You can dynamically adjust this too
      />
      <Section
        title="Career Path"
        content="Dr. Ibrahim's career trajectory includes pioneering work in mobile application frameworks, agile software development, and IT project management. He has collaborated with industry leaders to deliver scalable and secure mobile solutions for diverse industries.
"
      />
      <Section
        title="Education"
        content={`PhD in IT and Mobile Application Development from Turkey\nDeveloped award-winning mobile apps for healthcare and local sectors\nSpeaker at international tech conferences and workshops`}
      />
    </ScrollView>
  );
};

const Section = ({ title, content }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionContent}>{content}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  leftIcon: { marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#3e4152" },
  rightIcons: { flexDirection: "row", gap: 16 },
  speakerCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  avatarSection: { position: "relative", marginBottom: 16 },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#DDD",
  },
  experienceBadge: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#4A148C",
    padding: 6,
    borderRadius: 12,
  },
  experienceBadgeText: { color: "#FFF", fontSize: 10 },
  focusBadge: {
    backgroundColor: "#512DA8",
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  focusText: { color: "#FFF", fontSize: 12 },
  speakerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3e4152",
    marginBottom: 4,
  },
  locationText: { fontSize: 14, color: "#757575", marginBottom: 8 },
  speakerSpecialty: { fontSize: 14, color: "#757575", marginBottom: 16 },
  iconRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  iconText: { marginLeft: 4, color: "#3e4152" },
  scheduleButton: {
    backgroundColor: "#1A237E",
    padding: 10,
    borderRadius: 20,
    marginBottom: 16,
  },
  scheduleButtonText: { color: "#FFF" },
  sectionContainer: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3e4152",
    marginBottom: 8,
  },
  sectionContent: { fontSize: 14, color: "#666" },
});

export default SpeakerInfoScreen;
