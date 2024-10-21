// Footer.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star'; // Import the heat icon

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#121417', // Background color
        color: '#00CCCC', // Text color
        textAlign: 'center',
        padding: '16px 0',
        position: 'relative',
        bottom: 0,
        width: '100%',
      }}
    >
      <Typography variant="body2" display="flex" alignItems="center" justifyContent="center">
      <StarIcon sx={{ marginRight: 1 }} /> {/* Star icon */}
        Designed and developed by JSW Dolvi Digital team
      </Typography>
      <Typography variant="caption" sx={{ marginTop: 1 }}>
        Copyright 2024 © JSW Steel, Dolvi Works. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
