import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import ChatScreen from "./screens/ChatScreen";
import CreateEventScreen from "./screens/CreateEventScreen";
import EventListScreen from "./screens/EventListScreen";
import SignUpScreen from "./screens/SignUpScreen";
import SignInScreen from "./screens/SignInScreen";
import HomeScreen from "./screens/HomeScreen";
import QosylAppAnimation from "./screens/SplashScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import ProfileScreen from "./screens/ProfileScreen";
import EventDetailScreen from "./screens/EventDetailScreen";
import VerifyAccountScreen from "./screens/VerifyYourScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import CategoryEventsScreen from "./screens/CategoryEventScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="QosylAppAnimation">
        {/* Stack Screens */}
        <Stack.Screen
          name="QosylAppAnimation"
          component={QosylAppAnimation}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OnboardingScreen"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />

        {/* Authentication Screens */}
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{ title: "Sign In" }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ title: "Sign Up" }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ title: "Forgot Password" }}
        />

        {/* Main Screens */}
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: "Profile" }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ title: "Home" }}
        />
        <Stack.Screen
          name="EventList"
          component={EventListScreen}
          options={{ title: "Events" }}
        />
        <Stack.Screen
          name="CreateEvent"
          component={CreateEventScreen}
          options={{ title: "Create Event" }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{ title: "Chat Room" }}
        />
        <Stack.Screen
          name="EventDetail"
          component={EventDetailScreen}
          options={{ title: "Event Details" }}
        />
        <Stack.Screen
          name="VerifyAccount"
          component={VerifyAccountScreen}
          options={{ title: "Verify Account" }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ title: "Edit Profile" }}
        />
        <Stack.Screen
          name="CategoryEvents"
          component={CategoryEventsScreen}
          options={{ title: "Category Events" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
