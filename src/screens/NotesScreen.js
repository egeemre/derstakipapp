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
  const { folders, addFolder, deleteFolder, moveDocumentToFolder, pastelColors } = useFolders();
  const [currentFolder, setCurrentFolder] = useState(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  
  // New states for file moving functionality
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedTargetFolder, setSelectedTargetFolder] = useState(null);
  const [showCreateNewFolderForMove, setShowCreateNewFolderForMove] = useState(false);
  const [newMovefolderName, setNewMoveFolderName] = useState('');
  const [selectedMoveColor, setSelectedMoveColor] = useState(null);

  const formatDate = (date) => {
    try {
      return date.toLocaleDateString('en-GB'); // dd/mm/yyyy format
    } catch (e) {
      return date.toDateString();
    }
  };

  // Add this helper function to get folder name for a document
  const getFolderNameForDocument = (documentId) => {
    const folder = folders.find(f => f.documents.includes(documentId));
    return folder ? folder.name : null;
  };

  // Add this helper function to get folder color for a document
  const getFolderColorForDocument = (documentId) => {
    const folder = folders.find(f => f.documents.includes(documentId));
    return folder ? folder.color : null;
  };

  // Add helper function to darken a color properly
  const darkenColor = (color, amount = 0.3) => {
    // Remove # if present
    const hex = color.replace('#', '');
    
    // Parse RGB values
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Darken each component
    const darkenedR = Math.max(0, Math.floor(r * (1 - amount)));
    const darkenedG = Math.max(0, Math.floor(g * (1 - amount)));
    const darkenedB = Math.max(0, Math.floor(b * (1 - amount)));
    
    // Convert back to hex
    const toHex = (n) => n.toString(16).padStart(2, '0');
    return `#${toHex(darkenedR)}${toHex(darkenedG)}${toHex(darkenedB)}`;
  };

  const handleDocumentPress = (document) => {
    navigation.navigate('FileViewer', { file: document, returnTo: 'Notes' });
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
      addFolder({ 
        name: newFolderName.trim(),
        color: selectedColor
      });
      setNewFolderName('');
      setSelectedColor(null);
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
      const newFolder = addFolder({ 
        name: newMovefolderName.trim(),
        color: selectedMoveColor
      });
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
    setSelectedMoveColor(null);

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
              { 
                backgroundColor: theme.colors.surfaceAlt,
                opacity: currentFolder === null ? 0.8 : 1,
                borderWidth: currentFolder === null ? 2 : 0,
                borderColor: currentFolder === null ? '#000' : 'transparent',
              }
            ]}
            onPress={() => setCurrentFolder(null)}
          >
            <Icon name="folder-open" size={20} color="#000" />
            <Text style={[styles.folderName, { color: '#000', fontWeight: currentFolder === null ? 'bold' : '600' }]}>
              All ({documents.length})
            </Text>
          </TouchableOpacity>
          
          {folders.map((folder) => {
            const isSelected = currentFolder === folder.id;
            return (
              <TouchableOpacity
                key={folder.id}
                style={[
                  styles.folderItem,
                  { 
                    backgroundColor: folder.color,
                    opacity: isSelected ? 0.8 : 1,
                    borderWidth: isSelected ? 2 : 0,
                    borderColor: isSelected ? '#000' : 'transparent',
                  }
                ]}
                onPress={() => setCurrentFolder(folder.id)}
              >
                <Icon name="folder" size={20} color="#000" />
                <Text style={[styles.folderName, { color: '#000', fontWeight: isSelected ? 'bold' : '600' }]}>
                  {folder.name} ({getDocumentsInFolder(folder.id).length})
                </Text>
              </TouchableOpacity>
            );
          })}
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
          getDocumentsInFolder(currentFolder).map((doc) => {
            const folderColor = getFolderColorForDocument(doc.id);
            return (
              <View 
                key={doc.id} 
                style={[
                  styles.documentItem, 
                  { 
                    backgroundColor: theme.colors.surfaceAlt,
                    borderLeftWidth: folderColor ? 4 : 0,
                    borderLeftColor: folderColor || 'transparent',
                  }
                ]}
              >
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
                    {getFolderNameForDocument(doc.id) && (
                      <View style={styles.folderInfoContainer}>
                        <View style={[styles.folderColorDot, { backgroundColor: folderColor }]} />
                        <Text style={[styles.documentFolder, { color: theme.colors.primary }]}>{getFolderNameForDocument(doc.id)}</Text>
                      </View>
                    )}
                    <Text style={[styles.documentDate, { color: theme.colors.textSecondary }]}>{formatDate(doc.date)}</Text>
                    <View style={styles.documentStats}>
                      <Text style={[styles.documentSize, { color: theme.colors.text }]}>{doc.size}</Text>
                      <Text style={[styles.documentPages, { color: theme.colors.textSecondary }]}>{doc.pages} {t.pages}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })
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
            
            {/* Color Selection */}
            <View style={styles.colorSection}>
              <Text style={[styles.colorSectionTitle, { color: theme.colors.text }]}>Choose Color</Text>
              <View style={styles.colorGrid}>
                {pastelColors.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColorOption
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <Icon name="checkmark" size={16} color="#333" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

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
              <>
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
                
                {/* Color Selection for Move Modal */}
                <View style={styles.colorSection}>
                  <Text style={[styles.colorSectionTitle, { color: theme.colors.text }]}>Choose Color</Text>
                  <View style={styles.colorGrid}>
                    {pastelColors.map((color, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.colorOption,
                          { backgroundColor: color },
                          selectedMoveColor === color && styles.selectedColorOption
                        ]}
                        onPress={() => setSelectedMoveColor(color)}
                      >
                        {selectedMoveColor === color && (
                          <Icon name="checkmark" size={16} color="#333" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
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
  colorIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  folderInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  folderColorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  colorSection: {
    marginBottom: 20,
  },
  colorSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColorOption: {
    borderWidth: 2,
    borderColor: '#333',
  },
});