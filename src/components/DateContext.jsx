// DateContext.js
import React, { createContext, useState } from 'react';
import dayjs from 'dayjs';

const DateContext = createContext();

const DateProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </DateContext.Provider>
  );
};

export { DateContext, DateProvider };
