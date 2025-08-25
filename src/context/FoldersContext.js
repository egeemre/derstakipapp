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
  const [folders, setFolders] = useState([
    { id: 1, name: 'School', documents: [1, 2] },
    { id: 2, name: 'Work', documents: [3] },
    { id: 3, name: 'Personal', documents: [4] },
  ]);

  const addFolder = (folder) => {
    const newFolder = {
      id: Date.now(),
      name: folder.name,
      documents: folder.documents || [],
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

  const value = {
    folders,
    addFolder,
    deleteFolder,
    addDocumentToFolder,
    removeDocumentFromFolder,
    moveDocumentToFolder,
  };

  return (
    <FoldersContext.Provider value={value}>
      {children}
    </FoldersContext.Provider>
  );
};