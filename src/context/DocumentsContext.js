import React, { createContext, useContext, useState } from 'react';

const DocumentsContext = createContext();

export const useDocuments = () => {
  const context = useContext(DocumentsContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentsProvider');
  }
  return context;
};

export const DocumentsProvider = ({ children }) => {
  const [documents, setDocuments] = useState([
    { id: 1, name: 'biology', date: new Date(2026, 8, 10), size: '3.4 mb', pages: 4 },
    { id: 2, name: 'what is life?', date: new Date(2026, 5, 12), size: '978 kb', pages: 1 },
    { id: 3, name: 'math formulas', date: new Date(2026, 7, 25), size: '4.6 mb', pages: 5 },
    { id: 4, name: 'physics formulas', date: new Date(2026, 6, 10), size: '654 kb', pages: 2 },
  ]);

  const addDocument = (document) => {
    const newDocument = {
      id: Date.now(),
      ...document,
      date: new Date(),
    };
    setDocuments(prev => [newDocument, ...prev]);
    return newDocument; // Return the created document
  };

  const deleteDocument = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const getRecentDocuments = (limit = 3) => {
    return documents.slice(0, limit);
  };

  const value = {
    documents,
    addDocument,
    deleteDocument,
    getRecentDocuments,
  };

  return (
    <DocumentsContext.Provider value={value}>
      {children}
    </DocumentsContext.Provider>
  );
};
