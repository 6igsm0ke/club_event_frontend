import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function EventListScreen() {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  useEffect(() => {
    fetch('http://172.20.10.10:8000/api/v1/events/events/')
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error('❌ Error loading events:', err));
  }, []);

  const handleEdit = (event) => {
    setEditingEvent(event);
    setEditedTitle(event.title);
  };

  const saveEdit = () => {
    fetch(`http://172.20.10.10:8000/api/v1/events/events/${editingEvent.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...editingEvent, title: editedTitle })
    })
      .then((res) => res.json())
      .then((updated) => {
        const newEvents = events.map((e) => (e.id === updated.id ? updated : e));
        setEvents(newEvents);
        setEditingEvent(null);
        Alert.alert('Updated', 'Event updated successfully');
      })
      .catch((err) => console.error('Update failed:', err));
  };

  const deleteEvent = (id) => {
    fetch(`http://172.20.10.10:8000/api/v1/events/events/${id}/`, {
      method: 'DELETE'
    })
      .then(() => {
        setEvents(events.filter((e) => e.id !== id));
        Alert.alert('Deleted', 'Event deleted successfully');
      })
      .catch((err) => console.error('Delete failed:', err));
  };

  return (

    <View style={styles.container}>
      <Text style={styles.heading}>Event List</Text>
      <View style={styles.buttonRow}>
        <Button title="➕ Create Event" onPress={() => navigation.navigate('CreateEvent')} />
        <Button title="💬 Go to Chat" onPress={() => navigation.navigate('Chat')} />
      </View>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text style={styles.eventText}>{item.title}</Text>
            <Button title="Edit" onPress={() => handleEdit(item)} />
            <Button title="Delete" color="red" onPress={() => deleteEvent(item.id)} />
          </View>
        )}
      />

      {editingEvent && (
        <View style={styles.editArea}>
          <TextInput
            style={styles.input}
            value={editedTitle}
            onChangeText={setEditedTitle}
            placeholder="Edit Title"
          />
          <Button title="Save" onPress={saveEdit} />
          <Button title="Cancel" color="grey" onPress={() => setEditingEvent(null)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  eventItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' },
  eventText: { fontSize: 16, flex: 1 },
  editArea: { marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },  
});
