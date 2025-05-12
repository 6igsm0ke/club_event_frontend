import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function ChatScreen() {
  const ws = useRef(null);
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    ws.current = new WebSocket("ws://172.20.10.10:8000/ws/chat/lobby/");

    ws.current.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("📩 Received:", data.message);
      setChatLog((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: data.message,
          fromSelf: false,
        },
      ]);
    };

    ws.current.onerror = (e) => {
      console.error("❌ WebSocket error:", e.message);
    };

    ws.current.onclose = () => {
      console.log("🔌 WebSocket disconnected");
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws.current && message.trim() !== "") {
      const newMessage = {
        id: Date.now().toString(),
        text: message,
        fromSelf: true,
      };

      ws.current.send(JSON.stringify({ message }));
      setChatLog((prev) => [...prev, newMessage]);
      setMessage("");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={chatLog}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageWrapper,
              item.fromSelf ? styles.selfMessage : styles.otherMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatArea}
      />

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Введите сообщение"
        />
        <Button title="➤" onPress={sendMessage} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef1f5",
    paddingTop: 40,
  },
  topBar: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },
  chatArea: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  messageWrapper: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 12,
    marginVertical: 6,
  },
  selfMessage: {
    backgroundColor: "#d1e7ff",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  otherMessage: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopColor: "#ccc",
    borderTopWidth: 1,
    paddingBottom: 25,
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
    marginRight: 10,
    backgroundColor: "#f9f9f9",
  },
});
