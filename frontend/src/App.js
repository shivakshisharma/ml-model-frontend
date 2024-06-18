import React from 'react';

import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import Navbar from './components/Navbar/Navbar';
import PredictionForm from './components/PredictionForm/PredictionForm';
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
 <ThemeProvider theme={theme}>
 <Navbar/>
 <PredictionForm/>
 </ThemeProvider>
  );
};

export default App;
