
import React from 'react'
import { AppBar ,Toolbar,Stack,Box,Typography,Button} from '@mui/material'
import Logo from "../../assests/jsw.png"
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import LogoutIcon from '@mui/icons-material/Logout';
import CustomizedDialogs from '../Dialog'; // Adjust the path if necessary
import Dialog from '@mui/material/Dialog';
import axios from 'axios';
import { useContext } from 'react';
import { UploadContext } from '../UploadContext'
import { fieldMapping } from '../Mapping';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Navbar = ({hideButtons}) => {
const { setUploadedData } = useContext(UploadContext);
const { isAuthenticated, logout } = useAuth();
const navigate = useNavigate();
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    // Read the Excel file on the frontend
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Extract the last row from the worksheet
      const lastRow = worksheet[worksheet.length - 1];

      // Map the Excel data to the form fields
      const mappedData = {};
      for (const key in lastRow) {
        if (fieldMapping[key]) {
          mappedData[fieldMapping[key]] = lastRow[key];
        }
      }
  
      // Update the context with the mapped data
      setUploadedData(mappedData);
      // Save to local storage
      const jsonData = JSON.stringify(mappedData);
      localStorage.setItem('uploadedData', jsonData);
        
      // Append the JSON data to the form data
       formData.append('jsonData', jsonData);
    const response = await axios.post('http://localhost:5000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });


  }catch (error) {
    console.error('File upload failed:', error);
    // Handle error response
  }
}
const handleDownload = async () => {
  try {
    const response = await fetch('/download');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'previous_results.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
};


  const handleLogout = () => {
    // Clear authentication data here (if any)
    // For example, clear localStorage or context values
    navigate('/');
  };

  return (
    <AppBar position='sticky' color='primary'  >
        <Box display='flex' alignItems='center' width='100%' justifyContent='space-between'>
        <Toolbar >
            <img src={Logo} alt="" height={50} style={{marginRight:"60px"}} />
             <Typography variant="h6" mx={4} fontWeight="700" fontFamily="sans-serif" ><b>SINTER RDI</b></Typography>
        </Toolbar>
        {!hideButtons && (
        <Stack direction='row'  spacing={4} style={{marginRight:"70px",fontFamily:"sans-serif"}}>
           
           <CustomizedDialogs />
            <Button component="label" role={undefined} variant="contained" tabIndex={-1}  sx={{ marginLeft: 'auto' }} startIcon={<CloudUploadIcon />}>
             <b> Upload file</b>
           <VisuallyHiddenInput type="file" onChange={handleFileUpload} /> 
           </Button>
           <Button component="label" role={undefined} variant="contained" tabIndex={-1}  sx={{ marginLeft: 'auto' }} startIcon={<CloudDownloadIcon />}onClick={handleDownload}>
             <b> Download Results</b>
          
           </Button>
           <Button component="label"  variant="contained" startIcon={<LogoutIcon/>} onClick={handleLogout}>
         <b>Logout</b> 
        </Button>
        </Stack>
        )}
        </Box>
    </AppBar>
  )
}

export default Navbar
