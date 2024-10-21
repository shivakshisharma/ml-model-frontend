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
import Footer from './components/Footer/footer';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
const theme = createTheme({
  palette: {
    secondary: {
      main: "#121417",
      light: "#1E1E1E"
    }
  }
});

const ProtectedRoute = ({ element }) => {
  const {loading, isAuthenticated } = useAuth();
  console.log({isAuthenticated},"ans");
  if (loading) {
    return (
      <Box sx={{ width: '100%', position: 'absolute', top: 0 }}>
        <LinearProgress />
      </Box>
    ); // Show a linear loading state while checking
  }
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
                    element={<ProtectedRoute element={<><Navbar /><PredictionForm /><Footer /></>} />}
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