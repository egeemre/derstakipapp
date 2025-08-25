import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLanguage } from '../localization/LanguageContext';
import { useDocuments } from '../context/DocumentsContext';
import { useTheme } from '../theme/ThemeContext';

export default function SummariesScreen({ navigation }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { documents } = useDocuments();
  const [summaries, setSummaries] = useState([
    { id: 1, title: 'Biology Chapter 1 Summary', documentId: 1, documentName: 'biology', date: '2026-09-10', pages: 2 },
    { id: 2, title: 'Math Formulas Summary', documentId: 3, documentName: 'math formulas', date: '2026-08-25', pages: 1 },
    { id: 3, title: 'Physics Laws Summary', documentId: 4, documentName: 'physics formulas', date: '2026-07-10', pages: 1 },
  ]);
  const [showDocumentSelector, setShowDocumentSelector] = useState(false);
  const [newSummaryTitle, setNewSummaryTitle] = useState('');

  const handleCreateSummary = () => {
    if (documents.length === 0) {
      Alert.alert('No Documents', 'Please upload some documents first to create summaries.');
      return;
    }
    setShowDocumentSelector(true);
  };

  const handleDocumentSelect = (document) => {
    setShowDocumentSelector(false);
    const newSummary = {
      id: Date.now(),
      title: `Summary of ${document.name}`,
      documentId: document.id,
      documentName: document.name,
      date: new Date().toISOString().split('T')[0],
      pages: Math.floor(document.pages / 2) + 1,
    };
    setSummaries(prev => [newSummary, ...prev]);
    Alert.alert('Success', `Summary created for ${document.name}!`);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t.summaries}</Text>
        <TouchableOpacity onPress={handleCreateSummary}>
          <Icon name="add" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Summaries List */}
      <ScrollView style={styles.summariesContainer} showsVerticalScrollIndicator={false}>
        {summaries.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="reader-outline" size={48} color={theme.colors.textSecondary} style={styles.emptyStateIcon} />
            <Text style={[styles.emptyStateTitle, { color: theme.colors.textSecondary }]}>No summaries yet</Text>
            <Text style={[styles.emptyStateSubtext, { color: theme.colors.textSecondary }]}>Create your first summary from uploaded documents</Text>
            <TouchableOpacity 
              style={[styles.emptyStateButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleCreateSummary}
            >
              <Text style={[styles.emptyStateButtonText, { color: theme.colors.background }]}>Create Summary</Text>
            </TouchableOpacity>
          </View>
        ) : (
          summaries.map((summary) => (
            <TouchableOpacity key={summary.id} style={[styles.summaryItem, { backgroundColor: theme.colors.surfaceAlt }]}>
              <View style={[styles.summaryIcon, { backgroundColor: theme.colors.surface }]}>
                <Icon name="reader" size={24} color={theme.colors.text} />
              </View>
              <View style={styles.summaryInfo}>
                <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>{summary.title}</Text>
                <Text style={[styles.summaryDocument, { color: theme.colors.textSecondary }]}>From: {summary.documentName}</Text>
                <View style={styles.summaryMeta}>
                  <Text style={[styles.summaryDate, { color: theme.colors.textSecondary }]}>{summary.date}</Text>
                  <Text style={[styles.summaryPages, { color: theme.colors.textSecondary }]}>{summary.pages} {t.pages}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.viewButton}>
                <Icon name="eye-outline" size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Document Selector Modal */}
      <Modal
        visible={showDocumentSelector}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDocumentSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surfaceElevated }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Select Document</Text>
              <TouchableOpacity onPress={() => setShowDocumentSelector(false)}>
                <Icon name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.documentList}>
              {documents.map((doc) => (
                <TouchableOpacity
                  key={doc.id}
                  style={[styles.documentOption, { backgroundColor: theme.colors.surfaceAlt }]}
                  onPress={() => handleDocumentSelect(doc)}
                >
                  <Icon name="document-text" size={20} color={theme.colors.text} />
                  <Text style={[styles.documentOptionText, { color: theme.colors.text }]}>{doc.name}</Text>
                  <Icon name="chevron-forward" size={16} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  summariesContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  summaryIcon: {
    borderRadius: 8,
    padding: 12,
    marginRight: 16,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryDocument: {
    fontSize: 12,
    marginBottom: 8,
  },
  summaryMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  summaryDate: {
    fontSize: 12,
  },
  summaryPages: {
    fontSize: 12,
  },
  viewButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyStateButton: {
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  documentList: {
    maxHeight: 400,
  },
  documentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  documentOptionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
});