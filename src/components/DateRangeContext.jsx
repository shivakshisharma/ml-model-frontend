import React, { createContext, useState, useContext } from 'react';

const DateRangeContext = createContext();

export const DateRangeProvider = ({ children }) => {
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  return (
    <DateRangeContext.Provider value={{ dateRange, setDateRange }}>
      {children}
    </DateRangeContext.Provider>
  );
};

export const useDate = () => {
  return useContext(DateRangeContext );
};
