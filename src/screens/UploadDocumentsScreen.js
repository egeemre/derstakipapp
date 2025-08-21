import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../localization/LanguageContext';

export default function UploadDocumentsScreen({ navigation }) {
  const { t } = useLanguage();
  const [documents, setDocuments] = useState([
    { id: 1, name: 'biology', date: 'Friday, 10 September 2026', size: '3.4 mb', pages: 4 },
    { id: 2, name: 'what is life?', date: 'Saturday, 12 June 2026', size: '978 kb', pages: 1 },
    { id: 3, name: 'math formulas', date: 'Sunday, 25 August 2026', size: '4.6 mb', pages: 5 },
    { id: 4, name: 'physics formulas', date: 'Wednesday, 10 July 2026', size: '654 kb', pages: 2 },
  ]);

  const handleAddDocument = () => {
    Alert.alert(
      t.addNew,
      'Document picker would open here',
      [{ text: 'OK' }]
    );
  };

  const handleDeleteDocument = (id) => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to delete this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => setDocuments(docs => docs.filter(doc => doc.id !== id))
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{t.uploadDocuments}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Add New Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddDocument}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>{t.addNew}</Text>
      </TouchableOpacity>

      {/* Documents List */}
      <ScrollView style={styles.documentsContainer} showsVerticalScrollIndicator={false}>
        {documents.map((doc) => (
          <View key={doc.id} style={styles.documentItem}>
            <View style={styles.documentIcon}>
              <Ionicons name="document-text" size={24} color="#000" />
            </View>
            <View style={styles.documentInfo}>
              <Text style={styles.documentName}>{doc.name}</Text>
              <Text style={styles.documentDate}>{doc.date}</Text>
              <View style={styles.documentStats}>
                <Text style={styles.documentSize}>{doc.size}</Text>
                <Text style={styles.documentPages}>{doc.pages} {t.pages}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => handleDeleteDocument(doc.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
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
  addButton: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  documentsContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  documentIcon: {
    backgroundColor: '#e5e5e5',
    borderRadius: 8,
    padding: 12,
    marginRight: 16,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  documentDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  documentStats: {
    flexDirection: 'row',
    gap: 16,
  },
  documentSize: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
  },
  documentPages: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
  },
});