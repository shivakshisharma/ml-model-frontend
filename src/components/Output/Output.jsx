import React from 'react'
import { useState } from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import BasicArea from '../BasicArea';
import DateRangePicker from '../DateRange';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const Output = ({ result }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
     // Set default start and end dates
  const today = new Date();
  const defaultEndDate = dayjs(today).format('YYYY-MM-DDTHH');
   const defaultStartDate1 = new Date(today.setDate(today.getDate() - 7));
   const defaultStartDate=dayjs(defaultStartDate1).format('YYYY-MM-DDTHH');
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  const handleDatesChange = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  return (
    <Box
      mx={isMobile ? "20px" : "120px"}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      px={isMobile ? "10px" : "20px"}
      py={isMobile ? "20px" : "40px"}
      color="white"
      border="1px solid grey"
      borderRadius="8px"
      boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
      bgcolor="rgba(0, 0, 0, 0.7)"
    >
      <Typography 
        variant={isMobile ? "h6" : "h5"} 
        fontWeight="700" 
        textAlign="center" 
        fontFamily="calibri"
        mb={2}
        sx={{ 
          color: "#f1f1f1",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)"
        }}
      >
        Predicted RDI Value
      </Typography>
      <Typography
        variant={isMobile ? "h4" : "h3"}
        fontWeight="700"
        sx={{ 
          color: "#00FF00", // Green color for the result
          textAlign: "center",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)"
        }}
      >
        {result !== null && result}
      </Typography>
      <Box mt={4} width="100%">
      <DateRangePicker onDatesChange={handleDatesChange} />
      <BasicArea startDate={startDate} endDate={endDate} />
      </Box>
    </Box>
  );
}

export default Output;