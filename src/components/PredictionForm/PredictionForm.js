import React, { useState, useEffect, useContext } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Box, CircularProgress, Typography } from "@mui/material";
import { predict } from "../../services/api";
import Output from "../Output/Output";
import InputAdornment from '@mui/material/InputAdornment';
import axios from 'axios';
import { UploadContext } from "../UploadContext";
import { fieldMapping } from "../Mapping";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


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
  const [visible, setVisible] = useState(true);
  const [showCheckIcon, setShowCheckIcon] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    const savedData = localStorage.getItem('uploadedData');
    const savedResult = localStorage.getItem('predictionResult');
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      } catch (error) {
        console.error('Error parsing saved data:', error);
        localStorage.removeItem('uploadedData');
      }
    }
    if (savedResult) {
      setResult(parseFloat(savedResult));
    }
  
  }, []);


  useEffect(() => {
    if (uploadedData) {
      setFormData(uploadedData);
    }
  }, [uploadedData]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setProgress(30);
    try {
      const response = await axios.post('http://localhost:5000/predict');
      setProgress(70);
      const prediction = parseFloat(response.data.prediction.toFixed(2));
      setResult(prediction);
      setProgress(100);
      setShowCheckIcon(true);
    // Save the prediction result to local storage
    localStorage.setItem('predictionResult', prediction.toString());
    } catch (error) {
      console.error('Error fetching prediction:', error);
      setProgress(0);
    }
  };

  useEffect(() => {
    let timer;
    if (progress === 100) {
      timer = setTimeout(() => {
        setVisible(false);
      }, 2000);
    } else {
      setVisible(true);
    }
    return () => clearTimeout(timer);
  }, [progress]);




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
                borderRadius: "2%",
                ".MuiInputAdornment-root": { color: "white" },
                ".MuiFilledInput-root": { color: "white" },
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
              sx={{ border: "1px solid grey", input: { color: "white" }, borderRadius: "2%" }}
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px', marginBottom: "60px" }}>
        <Button
          component="label"
          variant="contained"
          type="submit"
          color="primary"
          sx={{ width: "200px", height: "50px" }}
          onClick={handleSubmit}
        >
          <Typography sx={{ fontFamily: "sans-serif", fontWeight: "700" }}>Predict</Typography>
        </Button>
        {visible && progress > 0 && (
          <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginLeft: "40px" }}>
            <CircularProgress
              variant="determinate"
              value={progress}
              sx={{
                color: progress === 100 ? "green" : "defaultColor"
              }}
            />
            {progress === 100 && showCheckIcon && (
              <CheckCircleIcon
                sx={{
                  color: "green",
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: "100%",
                  height: "100%",
                  transform: 'translate(-50%, -50%)',
                }}
              />
            )}
          </Box>
        )}
      </Box>
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
