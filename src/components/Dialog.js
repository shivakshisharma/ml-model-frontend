import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function CustomizedDialogs() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button component="label" variant="contained" onClick={handleClickOpen}>
        RDI description
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Sinter RDI Description
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom variant='subtitle2'>
          Reducibility is an important characteristic of sinters which measures the ability to transfer oxygen during reduction in the blast furnace, giving an idea of fuel consumption needs in the furnace. The porosity and
           structure of the sinters and their mineral phases are intimately related with their reducibility. A heterogeneous structure is more reducible than a homogeneous structure.
          </Typography>
          <Typography gutterBottom variant='subtitle2'>
          The degradation of sinter is determined by the low temperature degradation index (LTDI) and the RDI. Degradation is originated, to a certain extent, in the transformation that takes place during the reduction of hematite to magnetite, accompanied by an increase in volume, giving rise to the presence of structural stresses in the sinter. The degradation of sinter in the blast furnace occurs during reduction in the low temperature zone, and has a harmful effect on the burden strength in the furnace, with 
          the consequent loss of permeability to reducing gases and an increase in coke consumption. Low values of sinter degradation during reduction at low temperature are desirable.
          </Typography>
          <Typography gutterBottom variant='subtitle2'>
          The RDI is a very important parameter that is used as a reference in all sintering work and serves to predict the sinter’s degradation behaviour in the lower part of the blast furnace stack. A strong relationship exists between the RDI and the outdoor ambient temperature at the sinter plant. The RDI is also strongly dependent on the Ti content in the sinter, even when this is very small. 
          There is no relationship with alumina but the coke ratio in the sinter mix is the most important control variable with regard to the RDI.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="text" autoFocus onClick={handleClose}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
