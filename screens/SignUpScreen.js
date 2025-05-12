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
import { Ionicons } from "@expo/vector-icons";

const SignUpScreen = ({ navigation }) => {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

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

    setEmailError("");
    setPasswordError("");
    setFirstNameError("");
    setLastNameError("");

    if (!firstName) setFirstNameError("First Name is required");
    if (!lastName) setLastNameError("Last Name is required");
    if (!email) setEmailError("Email is required");
    if (!password) setPasswordError("Password is required");

    if (email && password && firstName && lastName) {
      setLoading(true);
      fetch("http://172.20.10.10:8000/api/v1/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);
          if (data.error) {
            if (data.code === "001") setEmailError(data.error);
            else if (data.code === "003") setPasswordError(data.error);
            else Alert.alert("Error", "Registration failed");
          } else {
            Alert.alert("Success", "Registration successful");
            navigation.navigate("VerifyAccount");
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error("❌ Error:", error);
          Alert.alert("Error", "An error occurred while trying to register");
        });
    }
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
        <Image
          source={require("../assets/logo.png")}
          style={[styles.logo, { width: 300, height: 150 }]}
        />
      </View>

      <Text style={styles.title}>Get Started now</Text>
      <Text style={styles.subtitle}>
        Welcome! Sign in using your social account or email to continue us
      </Text>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, firstNameError && styles.errorInput]}
            placeholder="Enter your first name"
            placeholderTextColor="#999"
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
              setFirstNameError("");
            }}
          />
          {renderClearIcon(setFirstName, firstName)}
        </View>
        {firstNameError && <Text style={styles.errorText}>{firstNameError}</Text>}

        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, lastNameError && styles.errorInput]}
            placeholder="Enter your last name"
            placeholderTextColor="#999"
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
              setLastNameError("");
            }}
          />
          {renderClearIcon(setLastName, lastName)}
        </View>
        {lastNameError && <Text style={styles.errorText}>{lastNameError}</Text>}

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
            placeholder="Create a password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError("");
            }}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={{ marginHorizontal: 5 }}
          >
            <Ionicons
              name={passwordVisible ? "eye" : "eye-off"}
              size={22}
              color="gray"
            />
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
        </View>

        <TouchableOpacity
          style={[styles.registerButton, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
      </View>

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
    marginTop: 10,
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
