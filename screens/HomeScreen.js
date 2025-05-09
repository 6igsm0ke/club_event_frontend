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
import NavigationBar from "../components/NavigationBar"; // Import the NavigationBar component

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}> {/* Wrap everything in a View to manage fixed position of nav bar */}
      <ScrollView contentContainerStyle={{ paddingBottom: 70 }}> {/* Add paddingBottom to make room for NavigationBar */}
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity>
            {/* <Image source={require('./assets/menu.png')} style={styles.icon} /> */}
          </TouchableOpacity>
          <TextInput placeholder="Search" style={styles.searchBox} />
          <TouchableOpacity>
            {/* <Image source={require('./assets/search.png')} style={styles.icon} /> */}
          </TouchableOpacity>
        </View>

        {/* Top Image Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imageScroll}
        >
          <View style={styles.imageCard}>
            <Image source={require("../assets/ak.png")} style={styles.cardImage} />
            <Text style={styles.imageText}>8/13</Text>
          </View>
          <View style={styles.imageCard}>
            <Image source={require("../assets/jasyl.png")} style={styles.cardImage} />
            <Text style={styles.imageText}>2/10</Text>
          </View>
        </ScrollView>

        {/* Category Grid */}
        <View style={styles.grid}>
          {categories.map((category, index) => (
            <View
              key={index}
              style={[styles.card, { backgroundColor: category.bg }]}
            >
              <Image source={category.icon} style={styles.cardIcon} />
              <Text style={styles.cardText}>
                {category.title.map((line, i) => (
                  <Text key={i}>{line}{"\n"}</Text>
                ))}
              </Text>
              {/* <Image source={require('./assets/bell.png')} style={styles.bellIcon} /> */}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Fixed Bottom Navigation Bar */}
      <NavigationBar navigation={navigation} />
    </View>
  );
}

const categories = [
  {
    title: ["Social &", "Human Rights"],
    bg: "#fbd3e9",
  },
  {
    title: ["Event", "Support"],
    bg: "#fbdcdc",
  },
  {
    title: ["Community", "Service"],
    bg: "#fff1b0",
  },
  {
    title: ["Sport"],
    bg: "#d1f2eb",
  },
  {
    title: ["Education &", "Tutoring"],
    bg: "#d6eaf8",
  },
  {
    title: ["Arts &", "Culture"],
    bg: "#f9d6c4",
  },
];


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f8ff",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 8,
  },
  searchBox: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 20,
  },
  imageScroll: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  imageCard: {
    marginRight: 10,
    position: "relative",
  },
  cardImage: {
    width: 140,
    height: 100,
    borderRadius: 10,
  },
  imageText: {
    position: "absolute",
    bottom: 5,
    left: 8,
    color: "#fff",
    fontWeight: "bold",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  card: {
    width: "45%",
    aspectRatio: 1,
    marginVertical: 10,
    borderRadius: 15,
    padding: 10,
    justifyContent: "space-between",
  },
  cardText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  cardIcon: {
    width: 40,
    height: 40,
  },
  bellIcon: {
    width: 18,
    height: 18,
    position: "absolute",
    top: 10,
    right: 10,
  },
});
