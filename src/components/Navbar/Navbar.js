
import React from 'react'
import { AppBar ,Toolbar,Stack,Box,Typography,Button} from '@mui/material'
import Logo from "../../assests/jsw.png"
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CustomizedDialogs from '../Dialog'; // Adjust the path if necessary
import Dialog from '@mui/material/Dialog';
import axios from 'axios';

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

const Navbar = () => {
 
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('http://localhost:5000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('File upload successful:', response.data);
    // Handle success response
  } catch (error) {
    console.error('File upload failed:', error);
    // Handle error response
  }
}
  return (
    <AppBar position='static' color='primary'  >
        <Box display='flex' alignItems='center' width='100%' justifyContent='space-between'>
        <Toolbar >
            <img src={Logo} alt="" height={50} style={{marginRight:"60px"}} />
             <Typography variant="h6" mx={4} fontWeight="500" fontFamily="sans-serif" >SINTER RDI</Typography>
        </Toolbar>
        <Stack direction='row'  spacing={4} style={{marginRight:"70px",fontFamily:"sans-serif"}}>
           
           <CustomizedDialogs />
            <Button component="label" role={undefined} variant="contained" tabIndex={-1}  sx={{ marginLeft: 'auto' }} startIcon={<CloudUploadIcon />}>
              Upload file
           <VisuallyHiddenInput type="file" onChange={handleFileUpload} /> 
           </Button>
        </Stack>
        </Box>
    </AppBar>
  )
}

export default Navbar
