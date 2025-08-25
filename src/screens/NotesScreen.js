import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, TextInput, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLanguage } from '../localization/LanguageContext';
import { useDocuments } from '../context/DocumentsContext';
import { useTheme } from '../theme/ThemeContext';
import { useFolders } from '../context/FoldersContext';

export default function NotesScreen({ navigation }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { documents, deleteDocument } = useDocuments();
  const { folders, addFolder, deleteFolder, moveDocumentToFolder } = useFolders();
  const [currentFolder, setCurrentFolder] = useState(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  // New states for file moving functionality
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedTargetFolder, setSelectedTargetFolder] = useState(null);
  const [showCreateNewFolderForMove, setShowCreateNewFolderForMove] = useState(false);
  const [newMovefolderName, setNewMoveFolderName] = useState('');

  const formatDate = (date) => {
    try {
      return date.toLocaleDateString('en-GB'); // dd/mm/yyyy format
    } catch (e) {
      return date.toDateString();
    }
  };

  const handleDocumentPress = (document) => {
    navigation.navigate('FileViewer', { file: document });
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

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      addFolder({ name: newFolderName.trim() });
      setNewFolderName('');
      setShowCreateFolder(false);
    }
  };

  const handleDeleteFolder = (folderId) => {
    Alert.alert(
      'Delete Folder',
      'Are you sure you want to delete this folder? All documents will be moved to uncategorized.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteFolder(folderId);
            if (currentFolder === folderId) {
              setCurrentFolder(null);
            }
          }
        }
      ]
    );
  };

  const getDocumentsInFolder = (folderId) => {
    if (!folderId) return documents;
    const folder = folders.find(f => f.id === folderId);
    return folder ? documents.filter(doc => folder.documents.includes(doc.id)) : [];
  };

  const getUncategorizedDocuments = () => {
    const categorizedDocIds = folders.flatMap(folder => folder.documents);
    return documents.filter(doc => !categorizedDocIds.includes(doc.id));
  };

  const handleDocumentLongPress = (document) => {
    setSelectedDocument(document);
    setSelectedTargetFolder(null);
    setShowCreateNewFolderForMove(false);
    setNewMoveFolderName('');
    setShowMoveModal(true);
  };

  const handleMoveToFolder = (folderId) => {
    setSelectedTargetFolder(folderId);
    setShowCreateNewFolderForMove(false);
  };

  const handleCreateNewFolderForMove = () => {
    setShowCreateNewFolderForMove(true);
    setSelectedTargetFolder(null);
  };

  const handleConfirmMove = () => {
    if (!selectedDocument) return;

    let targetFolderId = selectedTargetFolder;

    // If creating a new folder for move
    if (showCreateNewFolderForMove && newMovefolderName.trim()) {
      const newFolder = addFolder({ name: newMovefolderName.trim() });
      targetFolderId = newFolder.id;
    }

    // Move the document using the context function
    const currentFolderId = selectedDocument.folderId;
    moveDocumentToFolder(selectedDocument.id, currentFolderId, targetFolderId);

    // Reset states
    setShowMoveModal(false);
    setSelectedDocument(null);
    setSelectedTargetFolder(null);
    setShowCreateNewFolderForMove(false);
    setNewMoveFolderName('');

    const folderName = targetFolderId !== null 
      ? folders.find(f => f.id === targetFolderId)?.name || 'folder'
      : 'All';

    Alert.alert(
      'Success',
      `Document moved to ${folderName}!`,
      [{ text: 'OK' }]
    );
  };

  const handleCancelMove = () => {
    setShowMoveModal(false);
    setSelectedDocument(null);
    setSelectedTargetFolder(null);
    setShowCreateNewFolderForMove(false);
    setNewMoveFolderName('');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Documents</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => setShowCreateFolder(true)} style={styles.headerButton}>
            <Icon name="folder-open" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('UploadDocuments')} style={styles.headerButton}>
            <Icon name="add" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Folders Section */}
      <View style={styles.foldersSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Folders</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.foldersScroll}>
          <TouchableOpacity
            style={[
              styles.folderItem,
              { backgroundColor: currentFolder === null ? theme.colors.primary : theme.colors.surfaceAlt }
            ]}
            onPress={() => setCurrentFolder(null)}
          >
            <Text style={[styles.folderName, { color: currentFolder === null ? theme.colors.background : theme.colors.text, marginLeft: 0 }]}>
              All ({documents.length})
            </Text>
          </TouchableOpacity>
          
          {folders.map((folder) => (
            <TouchableOpacity
              key={folder.id}
              style={[
                styles.folderItem,
                { backgroundColor: currentFolder === folder.id ? theme.colors.primary : theme.colors.surfaceAlt }
              ]}
              onPress={() => setCurrentFolder(folder.id)}
            >
              <Icon name="folder" size={24} color={currentFolder === folder.id ? theme.colors.background : theme.colors.text} />
              <Text style={[styles.folderName, { color: currentFolder === folder.id ? theme.colors.background : theme.colors.text }]}>
                {folder.name} ({getDocumentsInFolder(folder.id).length})
              </Text>
              {currentFolder === folder.id && (
                <TouchableOpacity
                  style={styles.folderDeleteButton}
                  onPress={() => handleDeleteFolder(folder.id)}
                >
                  <Icon name="trash-outline" size={16} color={theme.colors.background} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Documents List */}
      <ScrollView style={styles.documentsContainer} showsVerticalScrollIndicator={false}>
        {getDocumentsInFolder(currentFolder).length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="document-outline" size={48} color={theme.colors.textSecondary} style={styles.emptyStateIcon} />
            <Text style={[styles.emptyStateTitle, { color: theme.colors.textSecondary }]}>
              {currentFolder ? 'No documents in this folder' : 'No documents yet'}
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: theme.colors.textSecondary }]}>
              {currentFolder ? 'Add documents to this folder' : 'Upload your first document to get started'}
            </Text>
            <TouchableOpacity 
              style={[styles.emptyStateButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('UploadDocuments')}
            >
              <Text style={[styles.emptyStateButtonText, { color: theme.colors.background }]}>{t.uploadDocuments}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          getDocumentsInFolder(currentFolder).map((doc) => (
            <View key={doc.id} style={[styles.documentItem, { backgroundColor: theme.colors.surfaceAlt }]}>
              <TouchableOpacity 
                style={styles.documentContent}
                onPress={() => handleDocumentPress(doc)}
                onLongPress={() => handleDocumentLongPress(doc)}
              >
                <View style={[styles.documentIcon, { backgroundColor: theme.colors.surface }]}>
                  <Icon name="document-text" size={24} color={theme.colors.text} />
                </View>
                <View style={styles.documentInfo}>
                  <Text style={[styles.documentName, { color: theme.colors.text }]}>{doc.name}</Text>
                  {doc.folderName && (
                    <Text style={[styles.documentFolder, { color: theme.colors.primary }]}>📁 {doc.folderName}</Text>
                  )}
                  <Text style={[styles.documentDate, { color: theme.colors.textSecondary }]}>{formatDate(doc.date)}</Text>
                  <View style={styles.documentStats}>
                    <Text style={[styles.documentSize, { color: theme.colors.text }]}>{doc.size}</Text>
                    <Text style={[styles.documentPages, { color: theme.colors.textSecondary }]}>{doc.pages} {t.pages}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDeleteDocument(doc.id)}
              >
                <Icon name="trash-outline" size={20} color="#ff6b6b" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Create Folder Modal */}
      <Modal
        visible={showCreateFolder}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateFolder(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surfaceElevated }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Create New Folder</Text>
              <TouchableOpacity onPress={() => setShowCreateFolder(false)}>
                <Icon name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.folderInput, { 
                backgroundColor: theme.colors.surfaceAlt,
                color: theme.colors.text,
                borderColor: theme.colors.border
              }]}
              placeholder="Folder name..."
              placeholderTextColor={theme.colors.textSecondary}
              value={newFolderName}
              onChangeText={setNewFolderName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.surfaceAlt }]}
                onPress={() => setShowCreateFolder(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleCreateFolder}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.background }]}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Move Document Modal */}
      <Modal
        visible={showMoveModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelMove}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surfaceElevated }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Move Document</Text>
              <TouchableOpacity onPress={handleCancelMove}>
                <Icon name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.foldersScroll}>
              {folders.map((folder) => (
                <TouchableOpacity
                  key={folder.id}
                  style={[
                    styles.folderItem,
                    { backgroundColor: selectedTargetFolder === folder.id ? theme.colors.primary : theme.colors.surfaceAlt }
                  ]}
                  onPress={() => handleMoveToFolder(folder.id)}
                >
                  <Icon name="folder" size={24} color={selectedTargetFolder === folder.id ? theme.colors.background : theme.colors.text} />
                  <Text style={[styles.folderName, { color: selectedTargetFolder === folder.id ? theme.colors.background : theme.colors.text }]}>
                    {folder.name}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[
                  styles.folderItem,
                  { backgroundColor: showCreateNewFolderForMove ? theme.colors.primary : theme.colors.surfaceAlt }
                ]}
                onPress={handleCreateNewFolderForMove}
              >
                <Icon name="add" size={24} color={showCreateNewFolderForMove ? theme.colors.background : theme.colors.text} />
                <Text style={[styles.folderName, { color: showCreateNewFolderForMove ? theme.colors.background : theme.colors.text }]}>
                  Create New Folder
                </Text>
              </TouchableOpacity>
            </ScrollView>
            {showCreateNewFolderForMove && (
              <TextInput
                style={[styles.folderInput, { 
                  backgroundColor: theme.colors.surfaceAlt,
                  color: theme.colors.text,
                  borderColor: theme.colors.border
                }]}
                placeholder="New folder name..."
                placeholderTextColor={theme.colors.textSecondary}
                value={newMovefolderName}
                onChangeText={setNewMoveFolderName}
                autoFocus
              />
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.surfaceAlt }]}
                onPress={handleCancelMove}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleConfirmMove}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.background }]}>Move</Text>
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 16,
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
  documentContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
  foldersSection: {
    marginBottom: 24,
    paddingHorizontal: 24, // Add horizontal padding to the section
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  foldersScroll: {
    flexDirection: 'row',
    paddingHorizontal: 0, // Remove any default padding
    marginHorizontal: -12, // Negative margin to offset the first item's margin
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 6, // Changed from marginRight to marginHorizontal for better spacing
    minWidth: 120,
  },
  folderName: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  folderDeleteButton: {
    marginLeft: 8,
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
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
  folderInput: {
    fontSize: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  documentFolder: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '500',
  },
});