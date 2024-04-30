
import React, { createContext, useContext, useState } from 'react';

const LastButtonContext = createContext();

export const LastButtonProvider = ({ children }) => {
  const [lastButton, setLastButton] = useState(null);

  return (
    <LastButtonContext.Provider value={{ lastButton, setLastButton }}>
      {children}
    </LastButtonContext.Provider>
  );
};

export const useLastButton = () => {
  const context = useContext(LastButtonContext);
  if (!context) {
    throw new Error('useLastButton must be used within a LastButtonProvider');
  }
  return context;
};
