import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Box, CircularProgress } from "@mui/material";
import { predict } from "../../services/api";
import Output from "../Output/Output";
import InputAdornment from '@mui/material/InputAdornment';

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    "5mm": "",
    Mean_size_raw_mix_wet: "",
    "+40mm_of_product_sinter": "",
    FeO: "",
    MgO: "",
    CI_of_Coal: "",
    "CI of Lime (range 85-90)": "",
    CI_of_Dolomite: "",
    Basicity: "",
    "Al2O3/SiO2": "",
    Main_Fan_Speed_RPM: "",
    "avg BTP (range 400-450)": "",
    CaO: "",
    "Balling Index (lower bound 1.55+)": "",
    "avg F/C temp (range 1150-1200)": "",
    "M/C speed m/min": "",
  });

  const units = {
    "5mm": "mm",
    Mean_size_raw_mix_wet: "mm",
    "+40mm_of_product_sinter": "mm",
    FeO: "%",
    MgO: "%",
    CI_of_Coal: "%",
    "CI of Lime (range 85-90)": "%",
    CI_of_Dolomite: "%",
    Basicity: "%",
    "Al2O3/SiO2": "%",
    Main_Fan_Speed_RPM: "rpm",
    "avg BTP (range 400-450)": "°C",
    CaO: "%",
    "Balling Index (lower bound 1.55+)": "mm",
    "avg F/C temp (range 1150-1200)": "°C",
    "M/C speed m/min": "m/min",
  };

  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setProgress(30);
      const response = await predict(formData); // Assuming predict function handles API call
      setProgress(100);
      setResult(response.prediction);
    } catch (error) {
      console.error('Prediction error:', error);
      // Handle error state or display error message
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: "#121417", padding: "30px 0px" }}>
      <Box display="flex" justifyContent="space-between" width="100%" height="100%">
        <Box display="flex" width="45%" gap="20px" flexDirection="column" px="120px" py="60px">
          {Object.entries(formData).slice(0, 8).map(([name, value]) => (
            <TextField
              key={name}
              label={name.split("_").join(" ")}
              name={name}
              value={value}
              onChange={handleChange}
              margin="normal"
              fullWidth
              variant="filled"
              sx={{ 
                border: "1px solid grey", 
                input: { color: "white" }, 
                borderRadius:"2%",
                ".MuiInputAdornment-root": { color: "white" }, // Ensure InputAdornment text is white
                ".MuiFilledInput-root": { color: "white" } , // Ensure input text is white
               
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                   <span style={{ color: "white" }}>{units[name]}</span> 
                  </InputAdornment>
                ),
                style: { color: "white" }
              }}
              InputLabelProps={{ style: { color: "white" } }}
            />
          ))}
        </Box>
        <Box display="flex" width="45%" gap="20px" flexDirection="column" px="120px" py="60px">
          {Object.entries(formData).slice(8).map(([name, value]) => (
            <TextField
              key={name}
              label={name.split("_").join(" ")}
              name={name}
              value={value}
              onChange={handleChange}
              margin="normal"
              fullWidth
              variant="filled"
              sx={{ border: "1px solid grey", input: { color: "white" }, borderRadius:"2%" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start" sx={{ color: "white" }}>
                    <span style={{ color: "white" }}> {units[name]}</span>
                  </InputAdornment>
                ),
                style: { color: "white" }
              }}
              InputLabelProps={{ style: { color: "white" } }}
            />
          ))}
        </Box>
      </Box>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ width: "200px", height: "50px", marginLeft: "120px", marginBottom: "60px" }}
      >
        Predict
      </Button>
      {progress > 0 && (
        <CircularProgress
          variant="determinate"
          value={progress}
          sx={{ marginLeft: "40px", marginBottom: "10px" }}
        />
      )}
      <Output result={result} />
    </form>
  );
};

export default PredictionForm;
