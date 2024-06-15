import React from 'react';
import PredictionForm from './components/PredictionForm';
import { Container, Typography } from '@mui/material';

const App = () => {
  return (
    <Container>
      <Typography variant="h2" gutterBottom>
          Reduction Degradation Index
      </Typography>
      <PredictionForm />
    </Container>
  );
};

export default App;
