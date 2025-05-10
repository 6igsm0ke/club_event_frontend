import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

export default function VerifyAccountScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* <Image
        source={require("../assets/verify.png")}
        style={styles.image}
      /> */}
      <Text style={styles.title}>Verify Your Account</Text>
      <Text style={styles.subtitle}>
        We’ve sent you a verification email. Please check your inbox and click the link to confirm your email address.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("SignIn")}
      >
        <Text style={styles.buttonText}>Go to Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f0f8",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#8f52c7",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#8f52c7",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
