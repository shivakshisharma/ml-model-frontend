
import React from 'react'
import { AppBar ,Toolbar,Stack,Box,Typography,Button, Menu, MenuItem, IconButton,Breadcrumbs} from '@mui/material'
import Logo from "../../assests/jsw.png"
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import LogoutIcon from '@mui/icons-material/Logout';
import CustomizedDialogs from '../Dialog'; // Adjust the path if necessary
import Dialog from '@mui/material/Dialog';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useContext,useState,useEffect } from 'react';
import { UploadContext } from '../UploadContext';
import { DateContext } from '../DateContext';
import { fieldMapping } from '../Mapping';
import MenuIcon from '@mui/icons-material/Menu';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import ResponsiveDateTimePickers from "../DateTimePicker";
import utc from 'dayjs/plugin/utc';
import { useDate } from '../DateRangeContext';

dayjs.extend(utc);

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

dayjs.extend(utc);
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
  const { dateRange } = useDate();
const { setUploadedData } = useContext(UploadContext);
const { isAuthenticated, logout } = useAuth();
const theme = useTheme();
const API_URL = 'http://10.5.45.182:5000'; // Replace with your actual backend URL

const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
const [anchorEl, setAnchorEl] = useState(null);
const navigate = useNavigate();
const { selectedDate, setSelectedDate } = useContext(DateContext);
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
    const response = await axios.post(`${API_URL}/upload`, formData, {
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
  if (dateRange.startDate && dateRange.endDate) {
    const formattedStartDate = dayjs(dateRange.startDate).format('YYYY-MM-DDTHH:mm:ss');
    const formattedEndDate = dayjs(dateRange.endDate).format('YYYY-MM-DDTHH:mm:ss');
    console.log("Downloading data from", formattedStartDate, "to", formattedEndDate);

    try {
      const response = await axios.get(`${API_URL}/download`, {
        params: {
          start: formattedStartDate,
          end: formattedEndDate,
        },
        responseType: 'blob', // Important for handling binary data
      });

      // Create a blob URL and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      console.log(url);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'previous_results.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    
    } 
    catch (error) {
    console.error('Error downloading file:', error);
  }
}
  else {
    alert("Please select a date range first.");
  }
};
// /lasteupdatedDate
const lasteUpdatedDate=async()=>{
  try{
    const response=await axios.get(`${API_URL}/lasteupdatedDate`);
    const lastDate=response.data.CreatedAt;
    console.log(lastDate);
    const formattedDate = dayjs.utc(lastDate);
    console.log(formattedDate,"format");
    setSelectedDate(formattedDate);
    console.log(selectedDate,"afterformat");
  
  } catch (error) {
    console.error('Error fetching date', error);
  }
}

useEffect(() => {
  // Call to fetch the last updated date on component mount
  lasteUpdatedDate();

  // Set up an interval to fetch the last updated date every hour (3600000 milliseconds)
  const intervalId = setInterval(() => {
    lasteUpdatedDate();
  }, 10000);

  // Clean up the interval on component unmount
  return () => clearInterval(intervalId);
}, []);


  const handleLogout = () => {
    // Clear authentication data here (if any)
    // For example, clear localStorage or context values
    navigate('/');
  };
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position='sticky' color='primary'>
      <Box display='flex' alignItems='center' width='100%' justifyContent='space-between' px={isMobile ? 2 : 4}>
        <Toolbar>
          <img src={Logo} alt="Logo" height={50} style={{ marginRight: isMobile ? '10px' : '60px' }} />
          <Typography variant="h6" fontWeight="700" fontFamily="sans-serif">
            <b>SINTER RDI</b>
          </Typography>
        </Toolbar>
        {!hideButtons && (
          isMobile ? (
            <>
              <IconButton edge="end" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
                <MenuIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleMenuClose}>
                  <CustomizedDialogs />
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                <ResponsiveDateTimePickers selectedDate={selectedDate} setSelectedDate={setSelectedDate} /> 
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                    <b>Upload file</b> 
                    <VisuallyHiddenInput type="file" onChange={handleFileUpload} />
                  </Button>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Button component="label" variant="contained" startIcon={<CloudDownloadIcon />} onClick={handleDownload}>
                   <b>Download Results</b> 
                  </Button>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Button component="label" variant="contained" startIcon={<LogoutIcon />} onClick={handleLogout}>
                   <b>Logout</b> 
                  </Button>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Stack direction='row' spacing={2} style={{ marginRight: '70px', fontFamily: 'sans-serif' }}>
              <CustomizedDialogs />
              <ResponsiveDateTimePickers selectedDate={selectedDate} setSelectedDate={setSelectedDate} />   
              <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
              <b>Upload file</b> 
                <VisuallyHiddenInput type="file" onChange={handleFileUpload} />
              </Button>
              <Button component="label" variant="contained" startIcon={<CloudDownloadIcon />} onClick={handleDownload}>
              <b>Download Results</b> 
              </Button>
              <Button component="label" variant="contained" startIcon={<LogoutIcon />} onClick={handleLogout}>
              <b>Logout</b>
              </Button>
            </Stack>
          )
        )}
      </Box>
    </AppBar>
  )
}

export default Navbar
