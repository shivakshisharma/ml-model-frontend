import React, { useState } from 'react';
import { Card, Box, TextField, Button,Grid,Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Logo from "../../assests/jsw.png";
import backgroundImage from"../../assests/backgroundImage.png"



const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const handleLogin = (e) => {
    e.preventDefault();
    // Replace with actual authentication logic
    if (username === 'Sinter2' && password === 'Sinter2024') {
      login();
      navigate('/predict');
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="100vh"
    style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}
  >

    <Grid
    container
    justifyContent="center"
    alignItems="center"
    style={{ minHeight: '100vh' }}
  >
    <Grid item xs={12} sm={8} md={4}>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '100%' },
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleLogin}
      >
        <Card sx={{ p: 4, textAlign: 'center' }}>
        <img src={Logo} alt="" height={70}  />
        <Typography variant="h6" mx={4}  fontFamily="arial" color="navy"><b>Sinter RDI Prediction System</b></Typography>
          <TextField
            required
            id="outlined-username"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
          <TextField
            required
            id="outlined-password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Button variant="contained" type="submit" sx={{mt:2,width:"100px",height:"50px"}}>
            Login
          </Button>
        </Card>
      </Box>
    </Grid>
  </Grid>
  </Box>
  );
};

export default LoginForm;
