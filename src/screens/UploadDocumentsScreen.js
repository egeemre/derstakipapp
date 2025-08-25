import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLanguage } from '../localization/LanguageContext';
import { useDocuments } from '../context/DocumentsContext';
import { useTheme } from '../theme/ThemeContext';
import { useFolders } from '../context/FoldersContext';

export default function UploadDocumentsScreen({ navigation }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { documents, addDocument, deleteDocument } = useDocuments();
  const { folders, addFolder, addDocumentToFolder } = useFolders();
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [showCreateNewFolder, setShowCreateNewFolder] = useState(false);
  const [pendingDocument, setPendingDocument] = useState(null);

  const handleAddDocument = () => {
    // Create the new document first
    const newDocument = {
      name: `Document ${documents.length + 1}`,
      size: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 9)} mb`,
      pages: Math.floor(Math.random() * 10) + 1,
    };
    
    // Store the document temporarily and show folder selection modal
    setPendingDocument(newDocument);
    setSelectedFolder(null); // No pre-selection
    setShowCreateNewFolder(false);
    setNewFolderName('');
    setShowFolderModal(true);
  };

  const handleFolderSelection = (folderId) => {
    setSelectedFolder(folderId);
    setShowCreateNewFolder(false);
  };

  const handleCreateNewFolder = () => {
    setShowCreateNewFolder(true);
    setSelectedFolder(null);
  };

  const handleConfirmUpload = () => {
    if (!pendingDocument) return;

    let targetFolderId = selectedFolder;
    let folderName = 'None';

    // If creating a new folder
    if (showCreateNewFolder && newFolderName.trim()) {
      const newFolder = addFolder({ name: newFolderName.trim() });
      targetFolderId = newFolder.id;
      folderName = newFolder.name;
    } else if (targetFolderId) {
      const folder = folders.find(f => f.id === targetFolderId);
      folderName = folder ? folder.name : 'None';
    }

    // Add the document with folder information
    const documentWithFolder = {
      ...pendingDocument,
      folderId: targetFolderId,
      folderName: folderName !== 'None' ? folderName : null,
    };

    const addedDocument = addDocument(documentWithFolder);

    // Update the folder's documents array if a folder was selected
    if (targetFolderId && addedDocument && addedDocument.id) {
      addDocumentToFolder(targetFolderId, addedDocument.id);
    }
    
    // Reset states
    setShowFolderModal(false);
    setPendingDocument(null);
    setSelectedFolder(null);
    setNewFolderName('');
    setShowCreateNewFolder(false);

    Alert.alert(
      'Success',
      `Document added${folderName !== 'None' ? ` to ${folderName}` : ''}!`,
      [{ text: 'OK' }]
    );
  };

  const handleCancelUpload = () => {
    setShowFolderModal(false);
    setPendingDocument(null);
    setSelectedFolder(null);
    setNewFolderName('');
    setShowCreateNewFolder(false);
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
          onPress: () => deleteDocument(id)
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t.uploadDocuments}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Add New Button */}
      <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.colors.primary }]} onPress={handleAddDocument}>
        <Icon name="add" size={24} color={theme.colors.background} />
        <Text style={[styles.addButtonText, { color: theme.colors.background }]}>{t.addNew}</Text>
      </TouchableOpacity>

      {/* Documents List */}
      <ScrollView style={styles.documentsContainer} showsVerticalScrollIndicator={false}>
        {documents.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="document-outline" size={48} color={theme.colors.textSecondary} style={styles.emptyStateIcon} />
            <Text style={[styles.emptyStateTitle, { color: theme.colors.textSecondary }]}>No documents yet</Text>
            <Text style={[styles.emptyStateSubtext, { color: theme.colors.textSecondary }]}>Upload your first document to get started</Text>
          </View>
        ) : (
          <>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Documents</Text>
            {documents.slice(0, 3).map((doc) => (
              <View key={doc.id} style={[styles.documentItem, { backgroundColor: theme.colors.surfaceAlt }]}>
                <View style={[styles.documentIcon, { backgroundColor: theme.colors.surface }]}>
                  <Icon name="document-text" size={24} color={theme.colors.text} />
                </View>
                <View style={styles.documentInfo}>
                  <Text style={[styles.documentName, { color: theme.colors.text }]}>{doc.name}</Text>
                  {doc.folderName && (
                    <Text style={[styles.documentFolder, { color: theme.colors.primary }]}>📁 {doc.folderName}</Text>
                  )}
                  <Text style={[styles.documentDate, { color: theme.colors.textSecondary }]}>{doc.date ? doc.date.toLocaleDateString('en-GB') : 'Recent'}</Text>
                  <View style={styles.documentStats}>
                    <Text style={[styles.documentSize, { color: theme.colors.text }]}>{doc.size}</Text>
                    <Text style={[styles.documentPages, { color: theme.colors.textSecondary }]}>{doc.pages} {t.pages}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteDocument(doc.id)}
                >
                  <Icon name="trash-outline" size={20} color="#ff6b6b" />
                </TouchableOpacity>
              </View>
            ))}
            {documents.length > 3 && (
              <TouchableOpacity 
                style={styles.seeAllButton} 
                onPress={() => navigation.navigate('Notes')}
              >
                <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>See All Documents</Text>
                <Icon name="chevron-forward" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>

      {/* Folder Selection Modal */}
      <Modal
        visible={showFolderModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancelUpload}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Select Folder</Text>
            <ScrollView style={styles.folderList}>
              {/* Add None option at the top */}
              <TouchableOpacity
                style={[
                  styles.folderItem,
                  selectedFolder === null && { backgroundColor: theme.colors.primary }
                ]}
                onPress={() => handleFolderSelection(null)}
              >
                <Text style={[
                  styles.folderName,
                  { color: selectedFolder === null ? theme.colors.background : theme.colors.text }
                ]}>
                  None
                </Text>
              </TouchableOpacity>
              
              {folders.map(folder => (
                <TouchableOpacity
                  key={folder.id}
                  style={[
                    styles.folderItem,
                    selectedFolder === folder.id && { backgroundColor: theme.colors.primary }
                  ]}
                  onPress={() => handleFolderSelection(folder.id)}
                >
                  <Text style={[
                    styles.folderName,
                    { color: selectedFolder === folder.id ? theme.colors.background : theme.colors.text }
                  ]}>
                    {folder.name}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.createFolderButton}
                onPress={handleCreateNewFolder}
              >
                <Icon name="add" size={20} color={theme.colors.primary} />
                <Text style={[styles.createFolderText, { color: theme.colors.primary }]}>Create New Folder</Text>
              </TouchableOpacity>
            </ScrollView>
            {showCreateNewFolder && (
              <TextInput
                style={[styles.newFolderInput, { borderColor: theme.colors.text }]}
                placeholder="Enter folder name"
                placeholderTextColor={theme.colors.textSecondary}
                value={newFolderName}
                onChangeText={setNewFolderName}
              />
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={handleCancelUpload}>
                <Text style={[styles.modalButtonText, { color: theme.colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleConfirmUpload}>
                <Text style={[styles.modalButtonText, { color: theme.colors.primary }]}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  documentIcon: {
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
  },
  documentDate: {
    fontSize: 12,
    marginBottom: 8,
  },
  documentStats: {
    flexDirection: 'row',
    gap: 16,
  },
  documentSize: {
    fontSize: 12,
    fontWeight: '500',
  },
  documentPages: {
    fontSize: 12,
  },
  deleteButton: {
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  folderList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  folderItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  folderName: {
    fontSize: 16,
  },
  createFolderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  createFolderText: {
    fontSize: 16,
    marginLeft: 8,
  },
  newFolderInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 8,
  },
  modalButtonText: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  documentFolder: {
    fontSize: 12,
    marginBottom: 4,
  },
});