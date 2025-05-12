import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import CheckBox from "react-native-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    const data = { email, password };

    setEmailError("");
    setPasswordError("");

    setLoading(true);

    fetch("http://172.20.10.10:8000/api/v1/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(async (data) => {
        setLoading(false);
        if (data.error) {
          if (data.code === "001") setEmailError(data.error);
          else if (data.code === "003") setPasswordError(data.error);
          else Alert.alert("Error", "Login failed");
        } else if (data.access && data.refresh) {
          await AsyncStorage.setItem("accessToken", data.access);
          await AsyncStorage.setItem("refreshToken", data.refresh);
          try {
            const profileRes = await fetch("http://172.20.10.10:8000/api/v1/auth/users/me/", {
              headers: {
                Authorization: `Bearer ${data.access}`,
                "Content-Type": "application/json",
              },
            });
            const profileData = await profileRes.json();
            Alert.alert("Success", "Login successful");
            navigation.navigate("HomeScreen");
          } catch (err) {
            console.error("❌ Error loading profile:", err);
            Alert.alert("Error", "Failed to load profile.");
          }
        } else {
          Alert.alert("Error", "Login failed");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("❌ Error:", error);
        Alert.alert("Error", "Login failed");
      });
  };

  const renderClearIcon = (setter, value) =>
    value ? (
      <TouchableOpacity onPress={() => setter("")}>
        <Ionicons name="close-circle" size={22} color="#999" />
      </TouchableOpacity>
    ) : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require("../assets/logo.png")} style={{ width: 300, height: 150 }} />
      </View>

      <Text style={styles.title}>Get Started now</Text>
      <Text style={styles.subtitle}>Welcome! Sign in using your social account or email</Text>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, emailError && styles.errorInput]}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError("");
            }}
            keyboardType="email-address"
          />
          {renderClearIcon(setEmail, email)}
        </View>
        {emailError && <Text style={styles.errorText}>{emailError}</Text>}

        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.passwordInput, passwordError && styles.errorInput]}
            placeholder="Enter your password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError("");
            }}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Ionicons name={passwordVisible ? "eye" : "eye-off"} size={22} color="gray" />
          </TouchableOpacity>
          {renderClearIcon(setPassword, password)}
        </View>
        {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

        <View style={styles.rememberMeContainer}>
          <CheckBox
            label=""
            value={rememberMe}
            onValueChange={setRememberMe}
            style={styles.checkbox}
          />
          <Text style={styles.rememberMeText}>Remember me</Text>
          <TouchableOpacity
            style={styles.forgotContainer}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotText}>Forget password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.loginButton, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Log In</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.link}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f6f0f8",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#8f52c7",
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#7a7a7a",
    marginBottom: 10,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputWrapper: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d8c8e3",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 16,
    elevation: 2,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
  passwordContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d8c8e3",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: "100%",
    elevation: 2,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
  errorInput: {
    borderColor: "#FF4D4D",
  },
  errorText: {
    color: "#FF4D4D",
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 10,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 8,
    gap: 10,
  },
  checkbox: {
    marginRight: 12,
  },
  rememberMeText: {
    fontSize: 16,
    color: "#7a7a7a",
  },
  forgotContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  forgotText: {
    color: "#4a4a4a",
    textDecorationLine: "underline",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#8f52c7",
    padding: 18,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    elevation: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 16,
    color: "#888",
  },
  link: {
    fontSize: 16,
    color: "#8f52c7",
    marginLeft: 5,
    fontWeight: "600",
  },
});
