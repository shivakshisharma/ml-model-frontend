// App.js
import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import Navbar from './components/Navbar/Navbar';
import PredictionForm from './components/PredictionForm/PredictionForm';
import Login from './components/Login/Login';
import { UploadProvider } from './components/UploadContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import { DateProvider } from './components/DateContext';
import { DateRangeProvider } from './components/DateRangeContext';

const theme = createTheme({
  palette: {
    secondary: {
      main: "#121417",
      light: "#1E1E1E"
    }
  }
});

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/" />;
};

const App = () => {
  return (
    <DateRangeProvider>
    <DateProvider>
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
                  element={<ProtectedRoute element={<><Navbar /><PredictionForm /></>} />}
                />
              </Routes>
            </Router>
          </ThemeProvider>
        </AuthProvider>
      </UploadProvider>
    </DateProvider>
    </DateRangeProvider>
  );
};

export default App;
