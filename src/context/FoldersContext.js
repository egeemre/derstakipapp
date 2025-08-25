import React, { createContext, useContext, useState } from 'react';

const FoldersContext = createContext();

export const useFolders = () => {
  const context = useContext(FoldersContext);
  if (!context) {
    throw new Error('useFolders must be used within a FoldersProvider');
  }
  return context;
};

export const FoldersProvider = ({ children }) => {
  // Predefined pastel colors for folders
  const pastelColors = [
    '#FFB3BA', // Light pink
    '#BAFFC9', // Light green
    '#BAE1FF', // Light blue
    '#FFFFBA', // Light yellow
    '#FFDFBA', // Light orange
    '#E0BBE4', // Light purple
    '#FFB3E6', // Light magenta
    '#B3E5FC', // Light cyan
    '#C8E6C9', // Light mint
    '#FFF9C4', // Light lemon
    '#FFCDD2', // Light rose
    '#D1C4E9', // Light lavender
  ];

  const [folders, setFolders] = useState([
    { id: 1, name: 'School', documents: [1, 2], color: pastelColors[0] },
    { id: 2, name: 'Work', documents: [3], color: pastelColors[1] },
    { id: 3, name: 'Personal', documents: [4], color: pastelColors[2] },
  ]);

  const getNextAvailableColor = () => {
    const usedColors = folders.map(f => f.color);
    const availableColors = pastelColors.filter(color => !usedColors.includes(color));
    return availableColors.length > 0 ? availableColors[0] : pastelColors[folders.length % pastelColors.length];
  };

  const addFolder = (folder) => {
    const newFolder = {
      id: Date.now(),
      name: folder.name,
      documents: folder.documents || [],
      color: folder.color || getNextAvailableColor(),
    };
    setFolders(prev => [...prev, newFolder]);
    return newFolder;
  };

  const deleteFolder = (folderId) => {
    setFolders(prev => prev.filter(folder => folder.id !== folderId));
  };

  const addDocumentToFolder = (folderId, documentId) => {
    setFolders(prev => prev.map(folder => 
      folder.id === folderId 
        ? { ...folder, documents: [...folder.documents, documentId] }
        : folder
    ));
  };

  const removeDocumentFromFolder = (folderId, documentId) => {
    setFolders(prev => prev.map(folder => 
      folder.id === folderId 
        ? { ...folder, documents: folder.documents.filter(docId => docId !== documentId) }
        : folder
    ));
  };

  const moveDocumentToFolder = (documentId, fromFolderId, toFolderId) => {
    // Remove from current folder if it exists
    if (fromFolderId) {
      removeDocumentFromFolder(fromFolderId, documentId);
    } else {
      // Remove from all folders if it was uncategorized
      setFolders(prev => prev.map(folder => ({
        ...folder,
        documents: folder.documents.filter(docId => docId !== documentId)
      })));
    }

    // Add to new folder if specified
    if (toFolderId) {
      addDocumentToFolder(toFolderId, documentId);
    }
  };

  const updateFolderColor = (folderId, color) => {
    setFolders(prev => prev.map(folder => 
      folder.id === folderId 
        ? { ...folder, color }
        : folder
    ));
  };

  const value = {
    folders,
    addFolder,
    deleteFolder,
    addDocumentToFolder,
    removeDocumentFromFolder,
    moveDocumentToFolder,
    updateFolderColor,
    pastelColors,
  };

  return (
    <FoldersContext.Provider value={value}>
      {children}
    </FoldersContext.Provider>
  );
};