import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../localization/LanguageContext';

export default function NotesScreen({ navigation }) {
  const { t } = useLanguage();
  const [notes, setNotes] = useState([
    { id: 1, title: 'Biology Study Notes', content: 'Cell structure and functions...', date: '2026-09-10' },
    { id: 2, title: 'Math Formulas', content: 'Quadratic equation: ax² + bx + c = 0...', date: '2026-08-25' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const addNote = () => {
    if (newNoteTitle.trim() && newNoteContent.trim()) {
      const newNote = {
        id: Date.now(),
        title: newNoteTitle,
        content: newNoteContent,
        date: new Date().toISOString().split('T')[0]
      };
      setNotes([newNote, ...notes]);
      setNewNoteTitle('');
      setNewNoteContent('');
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{t.notes}</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Notes List */}
      <ScrollView style={styles.notesContainer} showsVerticalScrollIndicator={false}>
        {notes.map((note) => (
          <TouchableOpacity key={note.id} style={styles.noteItem}>
            <Text style={styles.noteTitle}>{note.title}</Text>
            <Text style={styles.noteContent} numberOfLines={2}>{note.content}</Text>
            <Text style={styles.noteDate}>{note.date}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Note Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Note</Text>
            <TouchableOpacity onPress={addNote}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.titleInput}
            placeholder="Note title..."
            value={newNoteTitle}
            onChangeText={setNewNoteTitle}
          />
          <TextInput
            style={styles.contentInput}
            placeholder="Write your note here..."
            value={newNoteContent}
            onChangeText={setNewNoteContent}
            multiline
            textAlignVertical="top"
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  notesContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  noteItem: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  noteContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  noteDate: {
    fontSize: 12,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  titleInput: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    padding: 24,
    lineHeight: 24,
  },
});