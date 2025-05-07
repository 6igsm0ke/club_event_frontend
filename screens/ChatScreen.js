import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';

export default function ChatScreen() {
  const ws = useRef(null);
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);

  useEffect(() => {
    ws.current = new WebSocket("ws://172.20.10.10:8000/ws/chat/lobby/")

    ws.current.onopen = () => {
      console.log('✅ WebSocket connected');
    };

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log('📩 Received:', data.message);
      setChatLog((prev) => [...prev, { id: Date.now().toString(), text: data.message }]);
    };

    ws.current.onerror = (e) => {
      console.error('❌ WebSocket error:', e.message);
    };

    ws.current.onclose = () => {
      console.log('🔌 WebSocket disconnected');
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws.current && message.trim() !== '') {
      ws.current.send(JSON.stringify({ message }));
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chatLog}
        renderItem={({ item }) => <Text style={styles.message}>{item.text}</Text>}
        keyExtractor={(item) => item.id}
        style={styles.chatArea}
      />

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Введите сообщение"
        />
        <Button title="Отправить" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#eef1f5',
      paddingHorizontal: 16,
      paddingTop: 40,
    },
    chatArea: {
      flex: 1,
      marginBottom: 16,
    },
    message: {
      padding: 12,
      backgroundColor: '#ffffff',
      marginVertical: 6,
      borderRadius: 12,
      alignSelf: 'flex-start',
      maxWidth: '80%',
      fontSize: 16,
      color: '#333',
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 1,
    },
    inputArea: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: -1 },
      shadowRadius: 4,
      elevation: 4,
    },
    input: {
      flex: 1,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 14,
      height: 44,
      marginRight: 10,
      backgroundColor: '#f9f9f9',
    },
  });
  
