import React from 'react';

import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import Navbar from './components/Navbar/Navbar';
import PredictionForm from './components/PredictionForm/PredictionForm';
import { UploadProvider } from './components/UploadContext';
const theme=createTheme({
  palette:{
    secondary:{
      main:"#121417",
      light:"#1E1E1E"
    }
  }
})



const App = () => {
  return (
    <UploadProvider>
      <ThemeProvider theme={theme}>
     <Navbar/>
     <PredictionForm/>
    </ThemeProvider>

    </UploadProvider>
     

 
  );
};

export default App;
