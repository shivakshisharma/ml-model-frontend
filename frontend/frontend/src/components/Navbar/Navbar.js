
import React from 'react'
import { AppBar ,Toolbar,Stack,Box,Typography,Button} from '@mui/material'
import Logo from "../../assests/jsw.png"
const Navbar = () => {
  return (
    <AppBar position='static' color='primary'  >
      <Box display='flex'  alignItems='center' fontSize="24px" py={1} px={"80px"}>  
        <Toolbar >
            <img src={Logo} alt="" height={50} style={{marginRight:"60px"}} />
             <Typography variant="h6" mx={4} fontWeight="500" >SINTER RDI</Typography>
        </Toolbar>
        <Stack direction='row' spacing={4}>
            <Button color="inherit" fontSize="24px">
            <Typography variant="h6" mx={4} fontWeight="500" >PREVIOUS RESULTS</Typography>
            </Button>
            <Button color="inherit" fontSize="24px"> <Typography variant="h6" mx={4} fontWeight="500" >ABOUT</Typography></Button>
        </Stack>
        </Box>
    </AppBar>
  )
}

export default Navbar
