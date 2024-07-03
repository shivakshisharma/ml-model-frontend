import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Box, CircularProgress, Typography } from "@mui/material";
import { predict } from "../../services/api";
import Output from "../Output/Output";
import InputAdornment from '@mui/material/InputAdornment';
import axios from 'axios';
import { UploadContext } from "../UploadContext";
import { fieldMapping } from "../Mapping";
import { useContext } from 'react';
import { useEffect } from "react";

const PredictionForm = () => {
  const { uploadedData, setUploadedData } = useContext(UploadContext);

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
    "Main_Fan_Speed_RPM": "rpm",
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

  useEffect(() => {
    // Load data from local storage if available
    const savedData = localStorage.getItem('uploadedData');
   
  
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        
        setFormData(parsedData);
      } catch (error) {
        console.error('Error parsing saved data:', error);
        // If parsing fails, clear the local storage key
        localStorage.removeItem('uploadedData');
      }
    }
  }, []);

  useEffect(() => {
    if (uploadedData) {
      setFormData(uploadedData);
      
    }
  }, [uploadedData]);
  console.log(formData);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setProgress(30);
    try {
      
      const response = await axios.post('http://localhost:5000/predict');
      setProgress(70);
      setResult(response.data.prediction);
      setProgress(100);
    } catch (error) {
      console.error('Error fetching prediction:', error);
      setProgress(0);
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
       component="label" 
       variant="contained" 
       tabIndex={-1} 
        type="submit"
        color="primary"
        
       sx={{ width: "200px", height: "50px", marginLeft: "45%", marginBottom: "60px" }}
       onClick={handleSubmit}

      >
       <Typography sx={{fontFamily:"sans-serif",fontWeight:"70px"}}><b>Predict</b></Typography> 
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

// import React, { useState, useEffect } from "react";
// import TextField from "@mui/material/TextField";
// import { Box, CircularProgress } from "@mui/material";
// import axios from 'axios'

// const PredictionForm = () => {
//   const [formData, setFormData] = useState({
//     "5mm": "",
//     Mean_size_raw_mix_wet: "",
//     "+40mm_of_product_sinter": "",
//     FeO: "",
//     MgO: "",
//     CI_of_Coal: "",
//     "CI of Lime (range 85-90)": "",
//     CI_of_Dolomite: "",
//     Basicity: "",
//     "Al2O3/SiO2": "",
//     Main_Fan_Speed_RPM: "",
//     "avg BTP (range 400-450)": "",
//     CaO: "",
//     "Balling Index (lower bound 1.55+)": "",
//     "avg F/C temp (range 1150-1200)": "",
//     "M/C speed m/min": "",
//   });

//   const units = {
//     "5mm": "mm",
//     Mean_size_raw_mix_wet: "mm",
//     "+40mm_of_product_sinter": "mm",
//     FeO: "%",
//     MgO: "%",
//     CI_of_Coal: "%",
//     "CI of Lime (range 85-90)": "%",
//     CI_of_Dolomite: "%",
//     Basicity: "%",
//     "Al2O3/SiO2": "%",
//     Main_Fan_Speed_RPM: "rpm",
//     "avg BTP (range 400-450)": "°C",
//     CaO: "%",
//     "Balling Index (lower bound 1.55+)": "mm",
//     "avg F/C temp (range 1150-1200)": "°C",
//     "M/C speed m/min": "m/min",
//   };

//   const [result, setResult] = useState(null);
//   const [progress, setProgress] = useState(0);

//   // Function to fetch inputs from backend on component mount and at intervals
//   useEffect(() => {
//     const fetchInputsAndPredict = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/fetchInputs'); // Replace with your backend endpoint for fetching inputs
//         const { inputs } = response.data;
//         setFormData(inputs);

//         // Automatically trigger prediction when new inputs are fetched
//         const featuresArray = Object.values(inputs).map(value => parseFloat(value));
//         const predictionResponse = await axios.post('http://localhost:5000/predict', { features: featuresArray });
//         setResult(predictionResponse.data.prediction);
//       } catch (error) {
//         console.error('Error fetching inputs or prediction:', error);
//       }
//     };

//     // Initial fetch
//     fetchInputsAndPredict();

//     // Set interval to fetch inputs and predict periodically (e.g., every 10 seconds)
//     const intervalId = setInterval(fetchInputsAndPredict, 10000); // Adjust the interval as needed

//     // Cleanup interval on component unmount
//     return () => clearInterval(intervalId);
//   }, []); // Empty dependency array ensures this effect runs only once on mount

//   return (
//     <form style={{ backgroundColor: "#121417", padding: "30px 0px" }}>
//       <Box display="flex" justifyContent="space-between" width="100%" height="100%">
//         <Box display="flex" width="45%" gap="20px" flexDirection="column" px="120px" py="60px">
//           {Object.entries(formData).slice(0, 8).map(([name, value]) => (
//             <TextField
//               key={name}
//               label={name.split("_").join(" ")}
//               name={name}
//               value={value}
//               margin="normal"
//               fullWidth
//               variant="filled"
//               sx={{ border: "1px solid grey", input: { color: "white" }, borderRadius: "2%" }}
//               InputProps={{
//                 endAdornment: (
//                   <span style={{ color: "white" }}>{units[name]}</span>
//                 ),
//                 style: { color: "white" }
//               }}
//               InputLabelProps={{ style: { color: "white" } }}
//               disabled
//             />
//           ))}
//         </Box>
//         <Box display="flex" width="45%" gap="20px" flexDirection="column" px="120px" py="60px">
//           {Object.entries(formData).slice(8).map(([name, value]) => (
//             <TextField
//               key={name}
//               label={name.split("_").join(" ")}
//               name={name}
//               value={value}
//               margin="normal"
//               fullWidth
//               variant="filled"
//               sx={{ border: "1px solid grey", input: { color: "white" }, borderRadius: "2%" }}
//               InputProps={{
//                 endAdornment: (
//                   <span style={{ color: "white" }}> {units[name]}</span>
//                 ),
//                 style: { color: "white" }
//               }}
//               InputLabelProps={{ style: { color: "white" } }}
//               disabled
//             />
//           ))}
//         </Box>
//       </Box>
//       {progress > 0 && (
//         <CircularProgress
//           variant="determinate"
//           value={progress}
//           sx={{ marginLeft: "40px", marginBottom: "10px" }}
//         />
//       )}
//       <Output result={result} />
//     </form>
//   );
// };

// export default PredictionForm;
