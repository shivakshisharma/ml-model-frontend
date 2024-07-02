// UploadContext.js
import React, { createContext, useState } from 'react';

export const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [uploadedData, setUploadedData] = useState(null);

  return (
    <UploadContext.Provider value={{ uploadedData, setUploadedData }}>
      {children}
    </UploadContext.Provider>
  );
};
