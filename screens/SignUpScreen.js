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
} from "react-native";
import CheckBox from "react-native-checkbox";

import { Ionicons } from "@expo/vector-icons";

const SignUpScreen = ({ navigation }) => {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState(""); 
  const [lastName, setLastName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [firstNameError, setFirstNameError] = useState(""); 
  const [lastNameError, setLastNameError] = useState(""); 
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = () => {
    const data = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    };

    // Reset errors on each submit attempt
    setEmailError("");
    setPasswordError("");
    setFirstNameError("");
    setLastNameError("");

    // Simple client-side validation for demonstration
    if (!firstName) {
      setFirstNameError("First Name is required");
    }
    if (!lastName) {
      setLastNameError("Last Name is required");
    }
    if (!email) {
      setEmailError("Email is required");
    }
    if (!password) {
      setPasswordError("Password is required");
    }

    if (email && password && firstName && lastName) {
      // Proceed with API request if no validation errors
      fetch("http://172.20.10.10:8000/api/v1/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            if (data.code === "001") {
              setEmailError(data.error); // Email is already in use
            } else if (data.code === "003") {
              setPasswordError(data.error); // Incorrect password
            } else {
              Alert.alert("Error", "Registration failed");
            }
          } else {
            Alert.alert("Success", "Registration successful");
            navigation.navigate("VerifyAccount");
          }
        })
        .catch((error) => {
          console.error("❌ Error:", error);
          Alert.alert("Error", "An error occurred while trying to register");
        });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/logo.png")}
          style={[styles.logo, { width: 300, height: 150 }]}
        />
      </View>

      <Text style={styles.title}>Get Started now</Text>
      <Text style={styles.subtitle}>
        Welcome! Sign in using your social account or email to continue us
      </Text>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, firstNameError ? styles.errorInput : null]}
          placeholder="Enter your first name"
          placeholderTextColor="#999"
          value={firstName}
          onChangeText={(text) => {
            setFirstName(text);
            setFirstNameError(""); // Reset first name error when user starts typing
          }}
        />
        {firstNameError ? (
          <Text style={styles.errorText}>{firstNameError}</Text>
        ) : null}

        <TextInput
          style={[styles.input, lastNameError ? styles.errorInput : null]}
          placeholder="Enter your last name"
          placeholderTextColor="#999"
          value={lastName}
          onChangeText={(text) => {
            setLastName(text);
            setLastNameError(""); // Reset last name error when user starts typing
          }}
        />
        {lastNameError ? (
          <Text style={styles.errorText}>{lastNameError}</Text>
        ) : null}

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
            style={[
              styles.passwordInput,
              passwordError ? styles.errorInput : null,
            ]}
            placeholder="Create a password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError(""); // Reset password error when user starts typing
            }}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Ionicons
              name={passwordVisible ? "eye" : "eye-off"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        {/* Remember Me Checkbox */}
        <View style={styles.rememberMeContainer}>
          <CheckBox
            value={rememberMe}
            onValueChange={setRememberMe}
            style={styles.checkbox}
          />
          <Text style={styles.rememberMeText}>Remember me</Text>
        </View>

        {/* Register Button */}
        <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
          <Text style={styles.registerButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Footer with Sign Up Link */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
          <Text style={styles.link}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

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
  registerButton: {
    backgroundColor: "#8f52c7",
    padding: 18,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    elevation: 5,
  },
  registerButtonText: {
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

export default SignUpScreen;
