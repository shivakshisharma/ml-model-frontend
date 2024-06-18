
import React, { useState } from 'react';
import { Button, TextField, Container, Typography } from '@mui/material';
import { predict } from '../services/api';

const PredictionForm = () => {
  const [features, setFeatures] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const featuresArray = features.split(',').map(Number);
      console.log(featuresArray)
      const prediction = await predict(featuresArray);
      setResult(prediction.prediction);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        RDI Prediction Model
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Features (comma separated)"
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Predict
        </Button>
      </form>
      {result !== null && (
        <Typography variant="h6" marginTop={2}>
          Prediction: {result}
        </Typography>
      )}
    </Container>
  );
};

export default PredictionForm;
