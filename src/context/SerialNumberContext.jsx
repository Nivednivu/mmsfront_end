import React, { createContext, useState, useContext } from 'react';

const SerialNumberContext = createContext();

export const SerialNumberProvider = ({ children }) => {
  const [serialNO, setSerialNo] = useState('1');
  
  const updateSerialNo = (newSerial) => {
    setSerialNo(newSerial);
  };

  const incrementSerialNo = () => {
    const nextSerial = String(Number(serialNO) + 1);
    setSerialNo(nextSerial);
    return nextSerial; // Return the new serial number
  };

  return (
    <SerialNumberContext.Provider 
      value={{ serialNO, updateSerialNo, incrementSerialNo }}
    >
      {children}
    </SerialNumberContext.Provider>
  );
};

export const useSerialNumber = () => {
  const context = useContext(SerialNumberContext);
  if (!context) {
    throw new Error('useSerialNumber must be used within a SerialNumberProvider');
  }
  return context;
};