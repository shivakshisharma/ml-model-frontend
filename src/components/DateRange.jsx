import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateRangePicker.css';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';


dayjs.extend(utc);

const DateRangePicker = ({ onDatesChange }) => {
  // Set default start and end dates
  const today = new Date();
  const defaultEndDate = new Date();
  const defaultStartDate = new Date(today.setDate(today.getDate() - 7));

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  useEffect(() => {
    if (typeof onDatesChange === 'function') {
      onDatesChange(dayjs(startDate).format('YYYY-MM-DDTHH:mm:ss'), dayjs(endDate).format('YYYY-MM-DDTHH:mm:ss'));
    }
  }, [startDate, endDate, onDatesChange]);

  return (
    <div className="custom-date-picker">
      <h2>Select Date Range</h2>
      <div>
        <label>Start Date:</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="MMMM d, yyyy HH:mm"
          showTimeSelect
          timeFormat="HH:mm"
          placeholderText="Select a start date"
        />
      </div>
      <div>
        <label>End Date:</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          dateFormat="MMMM d, yyyy HH:mm"
          showTimeSelect
          timeFormat="HH:mm"
          placeholderText="Select an end date"
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
