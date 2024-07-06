import React from 'react';

import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import Navbar from './components/Navbar/Navbar';
import PredictionForm from './components/PredictionForm/PredictionForm';
import Login from './components/Login/Login'
import { UploadProvider } from './components/UploadContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';

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
     <AuthProvider>
      <ThemeProvider theme={theme}>
       <Router>
       <Routes>
       <Route
                path="/"
                element={
                  <>
                    <Navbar hideButtons={true} />
                    <Login />
                  </>
                }
              />
            <Route
                path="/predict"
                element={
                  <>
                    <Navbar />
                    <PredictionForm />
                  </>
                }
              />
          </Routes>
     </Router>
  
    </ThemeProvider>
    </AuthProvider>

    </UploadProvider>
     

 
  );
};

export default App;
