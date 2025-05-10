import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import NavigationBar from "../components/NavigationBar";
import { MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialIcons
            name="search"
            size={24}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput placeholder="Search" style={styles.searchInput} />
        </View>

        {/* Featured Events */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imageScroll}
        >
          {eventCards.map((card, index) => (
            <View key={index} style={styles.imageCard}>
              <Image source={card.image} style={styles.cardImage} />
              <Text style={styles.imageText}>{card.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Categories */}
        <View style={styles.grid}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { backgroundColor: category.bg }]}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("CategoryEvents", {
                  category: category.title.join(" "),
                })
              }
            >
              <Image source={category.icon} style={styles.cardIcon} />
              <Text style={styles.cardText}>
                {category.title.map((line, i) => (
                  <Text key={i}>
                    {line}
                    {"\n"}
                  </Text>
                ))}
              </Text>
              {category.badge && (
                <Image
                  source={require("../assets/adam.png")}
                  style={styles.bellIcon}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <NavigationBar navigation={navigation} />
    </View>
  );
}

const eventCards = [
  { image: require("../assets/ak.png"), label: "8/13" },
  { image: require("../assets/jasyl.png"), label: "2/10" },
];

const categories = [
  {
    title: ["Social &", "Human Rights"],
    icon: require("../assets/adam.png"),
    bg: "#A8D5E2",
    badge: true,
  },
  {
    title: ["Event", "Support"],
    icon: require("../assets/calendar.png"),
    bg: "#FAD3D6",
  },
  {
    title: ["Conference"],
    icon: require("../assets/public speaking.png"),
    bg: "#C8BFE7",
  },
  {
    title: ["Sport"],
    icon: require("../assets/Football ball.png"),
    bg: "#C5CBE3",
  },
  {
    title: ["Education &", "Tutoring"],
    icon: require("../assets/open book.png"),
    bg: "#B4D4B0",
  },
  {
    title: ["Arts &", "Culture"],
    icon: require("../assets/color palette.png"),
    bg: "#F5CBA7",
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f8ff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
  imageScroll: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  imageCard: {
    marginRight: 16,
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: 160,
    height: 110,
    borderRadius: 12,
  },
  imageText: {
    position: "absolute",
    bottom: 8,
    left: 10,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 16,
  },
  card: {
    width: "47%",
    aspectRatio: 1,
    borderRadius: 16,
    padding: 14,
    justifyContent: "space-between",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardIcon: {
    width: 40,
    height: 40,
  },
  cardText: {
    fontWeight: "600",
    fontSize: 15,
    marginTop: 10,
  },
  bellIcon: {
    width: 18,
    height: 18,
    position: "absolute",
    top: 10,
    right: 10,
  },
});
