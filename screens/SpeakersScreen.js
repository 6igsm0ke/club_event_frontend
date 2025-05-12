import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const speakers = [
  { name: "UmarAdam Ibrahim", specialty: "Mobile application development" },
  { name: "Samat Maxutov", specialty: "Problem solving" },
  { name: "Dr. Olivia Turner, M.D.", specialty: "Dermato-Endocrinology" },
  { name: "Dr. Sophia Martinez, Ph.D.", specialty: "Cosmetic Bioengineering" },
];

export default function SpeakersScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.sortContainer}>
          <Text style={styles.sortText}>Sort By</Text>
          <View style={styles.sortButton}>
            <Text style={styles.sortButtonText}>A-Z</Text>
          </View>
        </View>
        <Text style={styles.title}>Speakers</Text>
        <View style={styles.iconContainer}>
          <Feather name="star" size={24} color="#666" />
          <Feather name="heart" size={24} color="#666" style={{ marginLeft: 16 }} />
          <Feather name="search" size={24} color="#666" style={{ marginLeft: 16 }} />
          <Feather name="filter" size={24} color="#666" style={{ marginLeft: 16 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.speakerList}>
        {speakers.map((speaker, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.avatar} />
            <View style={styles.speakerInfo}>
              <Text style={styles.speakerName}>{speaker.name}</Text>
              <Text style={styles.speakerSpecialty}>{speaker.specialty}</Text>
            </View>
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => navigation.navigate("SpeakerInfo")}
            >
              <Text style={styles.infoButtonText}>Info</Text>
            </TouchableOpacity>
            <Feather name="calendar" size={24} color="#666" style={{ marginRight: 16 }} />
            <Feather name="heart" size={24} color="#666" />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F0F0", padding: 16 },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sortContainer: { flexDirection: "row", alignItems: "center" },
  sortText: { color: "#666", marginRight: 8 },
  sortButton: {
    backgroundColor: "#E0CFF6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sortButtonText: { color: "#7D4CC1" },
  title: { fontSize: 20, fontWeight: "bold" },
  iconContainer: { flexDirection: "row", alignItems: "center" },
  speakerList: { paddingBottom: 80 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    backgroundColor: "#CCC",
    borderRadius: 24,
    marginRight: 16,
  },
  speakerInfo: { flex: 1 },
  speakerName: { fontWeight: "bold", color: "#333" },
  speakerSpecialty: { color: "#777" },
  infoButton: {
    backgroundColor: "#7D4CC1",
    padding: 8,
    borderRadius: 8,
    marginRight: 16,
  },
  infoButtonText: { color: "#FFF" },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#FFF",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});
