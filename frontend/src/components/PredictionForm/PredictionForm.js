import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Box, Typography } from "@mui/material";
import { BorderColor } from "@mui/icons-material";
import backgroundImage from "../../assests/backgroundImage.png";
import { predict } from "../../services/api";
import CircularProgress from "@mui/material/CircularProgress";
import Output from "../Output/Output";
import InputAdornment from '@mui/material/InputAdornment';
const PredictionForm = () => {
  const [formData, setFormData] = useState({
    Temperature_C: "",
    Oxygen_percent: "",
    Sinter_bed_height_m: "",
    Blast_pressure: "",
    Sinter_density: "",
    Sinter_size_mm: "",
    Ash_rate_percent: "",
    Coke_Rate_kg_per_ton: "",
    Pressure_Mpa: "",
    Moisture_percent: "",
    Blast_Temperature: "",
    Iron_Ore_rate: "",
    Sinter_temperature: "",
    Sinter_Strength: "",
    Lime_rate: "",
    Oxygen_Enrichment: "",
  });




  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let featuresArray = [];
      setProgress(30);
      Object.entries(formData).map(([name, value]) => {
        featuresArray.push(Number.parseFloat(value));
      });
      setProgress(50);
      // const prediction = await predict(featuresArray);
      setProgress(70);
      // setResult(prediction.prediction)
      setProgress(100);
    } catch (error) {
      console.log(error);
    }
    console.log(formData);
  };

  const formStyle = {
    backgroundColor: "#121417",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    width: "100%",
    height: "100%",
    padding:"30px 0px"
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      {/* Loop through all 16 input fields */}

      <Box
        display={"flex"}
        justifyContent={"space-between"}
        width={"100%"}
        height={"100%"}
      >
        <Box
          display={"flex"}
          width={"45%"}
          gap={"20px"}
          flexDirection={"column"}
          px="120px"
          py="60px"
        >
          {Object.entries(formData)
            .slice(0, 8)
            .map(([name, value]) => {


              const formIcons={
                Temperature_C:"C",
                Oxygen_percent:"%",
                Sinter_bed_height_m:"m",
                Blast_pressure: "Mpa",
                Sinter_density: "t/m^3",
                Sinter_size_mm: "mm",
                Ash_rate_percent: "%",
                Coke_Rate_kg_per_ton: "kg/t",
                Pressure_Mpa: "Mpa",
                Moisture_percent: "",
                Blast_Temperature: "",
                Iron_Ore_rate: "",
                Sinter_temperature: "",
                Sinter_Strength: "",
                Lime_rate: "",
                Oxygen_Enrichment: "",
              }



              const fieldName=name
              console.log(fieldName)
              console.log(formIcons.fieldName)
              return <TextField
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
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="start">{formIcons.fieldName}</InputAdornment>,
                  style:{
                    color:"white"
                  }
                }}
                InputLabelProps={{
                  style: {
                    color: "white",
                  },
                }}
              />
})}
        </Box>
        <Box
          display={"flex"}
          width={"45%"}
          gap={"20px"}
          flexDirection={"column"}
          px="120px"
          py="60px"
        >
          {Object.entries(formData)
            .slice(8)
            .map(([name, value]) => (
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
                }}
                inputProps={{
                  style: {
                    color: "white",
                  },
                }}
                InputLabelProps={{
                  style: {
                    color: "white",
                  },
                }}
              />
            ))}
        </Box>
      </Box>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{
          width: "200px",
          height: "50px",
          marginLeft: "120px",
          marginBottom: "60px",
        }}
      >
        Predict
      </Button>
      {progress != 0 && (

         
            <CircularProgress
            variant="determinate"
            value={progress}
            sx={{ marginLeft: "40px", marginBottom: "10px" }}
          />
         
      
      )}
     <Output result={result}/>
    </form>
  );
};

export default PredictionForm;
