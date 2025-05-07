import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
} from "react-native";
import CheckBox from 'react-native-checkbox';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = () => {
    const data = { email, password };

    // Reset errors
    setEmailError("");
    setPasswordError("");

    fetch("http://172.20.10.10:8000/api/v1/auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        // If there is an error in the response, handle it here
        if (data.error) {
          if (data.code === "001") {
            setEmailError(data.error); // Invalid email or account does not exist
          } else if (data.code === "003") {
            setPasswordError(data.error); // Incorrect password
          } else {
            Alert.alert("Error", "Login failed");
          }
        } else {
          // Successfully logged in
          console.log("✅ User logged in:", data);
          
          if (data.access && data.refresh) {
            // Store tokens in AsyncStorage
            AsyncStorage.setItem("accessToken", data.access)
              .then(() => {
                AsyncStorage.setItem("refreshToken", data.refresh)
                  .then(() => {
                    Alert.alert("Success", "Login successful");
                    navigation.navigate("HomeScreen");
                  })
                  .catch((error) => {
                    console.error("Error storing refreshToken:", error);
                    Alert.alert("Error", "An error occurred while storing refresh token.");
                  });
              })
              .catch((error) => {
                console.error("Error storing accessToken:", error);
                Alert.alert("Error", "An error occurred while storing access token.");
              });
          } else {
            Alert.alert("Error", "Login failed");
          }
        }
      })
      .catch((error) => {
        console.error("❌ Error:", error);
        Alert.alert("Error", "Login failed");
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/logo.png")}
          style={[styles.logo, { width: 300, height: 150 }]}
        />
      </View>

      {/* Title and Subtitle */}
      <Text style={styles.title}>Get Started now</Text>
      <Text style={styles.subtitle}>
        Welcome! Sign in using your social account or email to continue us
      </Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, emailError ? styles.errorInput : null]}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError(""); // Reset email error when user starts typing
          }}
          keyboardType="email-address"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        {/* Password Input with Toggle Visibility */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.passwordInput, passwordError ? styles.errorInput : null]}
            placeholder="Create a password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError(""); // Reset password error when user starts typing
            }}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Ionicons name={passwordVisible ? "eye" : "eye-off"} size={24} color="gray" />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        {/* Remember Me Checkbox */}
        <View style={styles.rememberMeContainer}>
          <CheckBox value={rememberMe} onValueChange={setRememberMe} style={styles.checkbox} />
          <Text style={styles.rememberMeText}>Remember me</Text>
          <TouchableOpacity style={styles.forgotContainer}>
            <Text style={styles.forgotText}>Forget password?</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("HomeScreen")}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
      </View>

      {/* Footer with Sign Up Link */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.link}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  input: {
    backgroundColor: "#fff",
    borderColor: "#d8c8e3",
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    width: "100%",
    elevation: 2,
  },
  passwordContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d8c8e3",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    width: "100%",
    elevation: 2,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  errorInput: {
    borderColor: "#FF4D4D",
    borderWidth: 2,
  },
  errorText: {
    color: "#FF4D4D",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "left",
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
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

