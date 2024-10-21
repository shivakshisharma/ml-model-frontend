import * as React from 'react';
import dayjs from 'dayjs';
import { TextField, Box } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';



export default function ResponsiveDateTimePickers({ selectedDate, setSelectedDate }) {
    const theme = useTheme();
    const datedefault=Date.now();
  
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
         width: isMobile ? '200px' : '250px', // Change width for mobile
          margin: '0 16px', // Space around the picker
          height:'40px',
          backgroundColor: theme.palette.primary.main, // Use your theme's primary color
          marginLeft:'1px',
          fontWeight: 'bold', // Make text bold
          borderRadius: '4px', // Match the button's border radius
          display: 'flex', // Flex container to align items
          alignItems: 'center', // Center vertically
          padding: '8px', // Padding to give space around the picker
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Add shadow effect
          '&:hover': {
            cursor: 'pointer', // Change cursor to pointer on hover
          },
        }}
      >
        <DateTimePicker
          value={selectedDate} // Use selectedDate prop for controlled input
          onChange={(newValue) => setSelectedDate(newValue)} // Update state on change
         sx={{
            '& .MuiSvgIcon-root': {
              color: 'white', // Change icon color to white
            },
            '& .MuiInputBase-root': {
              color: 'white', // Change text color to white
            },
            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent', // Make the border transparent
                  },
                  '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent', // Keep the border transparent on hover
                  },
                  '&.Mui-focused .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent', // Keep the border transparent when focused
                
                },
          }}
        
          defaultValue={dayjs(datedefault)}
        />
      </Box>
    </LocalizationProvider>
  );
}
