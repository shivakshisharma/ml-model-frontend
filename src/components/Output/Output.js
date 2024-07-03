import React from 'react'
import { Box,Typography } from '@mui/material'
const Output = ({result}) => {
  return (
    <Box
    mx={"120px"}
    display={"flex"}
    flexDirection="column"
    px={"20px"}
    py={"40px"}
    color={"white"}
    border={"1px solid grey"}
  >
    <Typography variant="h5" fontWeight="500" textAlign={'center'} fontFamily={"calibri"}>
    Predicted RDI Value
    </Typography>
    <Typography
      variant="h6"
      my={4}
      fontWeight="500"
      sx={{ color: "#e1e1e1",textAlign:"center" }}
      
    >
     {(result !== null) && result}
    </Typography>
  </Box>
  )
}

export default Output
