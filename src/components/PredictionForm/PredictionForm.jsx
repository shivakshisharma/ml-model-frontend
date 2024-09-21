import React, { useState, useEffect, useContext } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Box, CircularProgress, Typography,Grid,Stack,Switch } from "@mui/material";
import { predict } from "../../services/api";
import Output from "../Output/Output";
import InputAdornment from '@mui/material/InputAdornment';
import axios from 'axios';
import { UploadContext } from "../UploadContext";
import { fieldMapping } from "../Mapping";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const API_URL = 'http://10.5.45.182:5000'; // Replace with your actual backend URL


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
  const [rdiData, setRdiData] = useState([]);
  const [lastdate,setlastdate]=useState();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [showCheckIcon, setShowCheckIcon] = useState(false);
   // Step 1: Toggle state for manual mode
   const [manualMode, setManualMode] = useState(false);


  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleToggleManualMode = (event) => {
    const newMode = event.target.checked;
    setManualMode(newMode);

    // If manual mode is turned off, reset formData from local storage
    if (!newMode) {
      const savedData = localStorage.getItem('uploadedData');
      const savedPred=localStorage.getItem('predictionResult');
      if (savedData ) {
        try {
          const parsedData = JSON.parse(savedData);
          setFormData(parsedData);
        
        } catch (error) {
          console.error('Error parsing saved data:', error);
          localStorage.removeItem('uploadedData');
        }
      }
      if (savedPred) {
        setResult(parseFloat(savedPred)); // Reset prediction result
      }
    }
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


//Fetch real time data 
const fetchRealTimeData = async () => {
  try {
    const response = await axios.get(`${API_URL}/realtime-data`);
    const fetchedData = response.data;
    console.log(fetchedData);
    setlastdate(fetchedData.CreatedAt);
    console.log(lastdate);

    // Compare fetched data with current formData
    const isDataDifferent = JSON.stringify(fetchedData) !== JSON.stringify(formData);

    if (isDataDifferent) {
      setFormData(fetchedData);
      localStorage.setItem("uploadedData", JSON.stringify(fetchedData));
      await handlePredict(fetchedData);
    }
  } catch (error) {
    console.error("Error fetching real-time data:", error);
  }
};

const fetchPiVisionRealTimeData = async () => {
  try {
    const response = await axios.get(`${API_URL}/specific-realtime-data`);
    const specificData = response.data;
    console.log(specificData);

    const updatedFormData = { ...formData, ...specificData };
    setFormData(updatedFormData);
    localStorage.setItem("uploadedData", JSON.stringify(updatedFormData));
    // await handlePredict(updatedFormData); // Automatically trigger prediction
  } catch (error) {
    console.error("Error fetching specific real-time data:", error);
  }
};


// To fetch the specific inputs every 30 seconds
useEffect(() => {
  if (!manualMode) {
    const interval = setInterval(fetchPiVisionRealTimeData, 30000); // Fetch specific inputs every 3 seconds
    return () => clearInterval(interval);
  }
}, [manualMode, formData]); // Dependency on manualMode and formData


useEffect(() => {
  const fetchData = async () => {
    await fetchRealTimeData(); // Fetch data immediately
  };

  // Fetch data immediately on mount
  fetchData();

  if (!uploadedData && !manualMode) {
    const interval = setInterval(fetchRealTimeData, 60000); // Fetch every one hour
    return () => clearInterval(interval); // Clean up interval on unmount
  }
}, [uploadedData, manualMode]); // Dependency on uploadedData and manualMode
 
const handlePredict = async (data) => {
 
  setProgress(30);
  try {

  const features = [
    parseFloat(formData["Size5mm"]),
    parseFloat(formData["MeanSizeRawMixWet"]),
    parseFloat(formData["ProductSinterAbove40mm"]),
    parseFloat(formData["FeO"]),
    parseFloat(formData["MgO"]),
    parseFloat(formData["CoalCI"]),
    parseFloat(formData["LimeCI"]),
    parseFloat(formData["DolomiteCI"]),
    parseFloat(formData["Basicity"]),
    parseFloat(formData["Al2O3_SiO2_Ratio"]),
    parseFloat(formData["MainFanSpeedRPM"]),
    parseFloat(formData["BTP"]),
    parseFloat(formData["CaO"]),
    parseFloat(formData["BallingIndex"]),
    parseFloat(formData["FCTemp"]),
    parseFloat(formData["MCSpeed"]),
  ];

    
    console.log(data);
    const response = manualMode
      ? await axios.post(`${API_URL}/predict-manual`, {features}) // Use formData when in manual mode
      : await axios.post(`${API_URL}/predict`); // Use real-time data API);
    
    setProgress(70);
    const prediction = parseFloat(response.data.prediction.toFixed(2));
    setResult(prediction);
    setProgress(100);
    setShowCheckIcon(true);
   if(!manualMode)
    {
      localStorage.setItem('predictionResult', prediction.toString());
    } 
    else{

    }
  } catch (error) {
    console.error('Error fetching prediction:', error);
    setProgress(0);
  }
};
 const handleSubmit = (e) => {
    e.preventDefault();
    handlePredict(formData);
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
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
        <Typography sx={{ color: "white", marginRight: '10px' }}>Manual Mode:</Typography>
        <Switch checked={manualMode} onChange={handleToggleManualMode} color="primary" />
      </Box>
      <Grid container spacing={2} sx={{ padding: { xs: 2, md: 6 } }}>
        {Object.entries(formData).map(([name, value], index) => (
          <Grid item xs={12} md={6} key={name} sx={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              label={name.split("_").join(" ")}
              name={name}
              value={value}
              onChange={handleChange}
              margin="normal"
              variant="filled"
              sx={{
                width: "80%",
                border: "1px solid grey",
                input: { color: "white" },
                borderRadius: "2%",
                ".MuiInputAdornment-root": { color: "white" },
                ".MuiFilledInput-root": { color: "white" },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <span style={{ color: "white" }}>{ units[fieldMapping[name]]?units[fieldMapping[name]]:units[name]  }</span>
                  </InputAdornment>
                ),
                style: { color: "white" }
              }}
              InputLabelProps={{ style: { color: "white" } }}
            />
          </Grid>
        ))}
      </Grid>
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


