import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type DialogComponentProps = {
  show: boolean,
  title: string,
  message: string,
  handleClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void,
};

const MUIMessageDialog = ({
  show,
  title,
  message,
  handleClose
}: DialogComponentProps ) => {
  return (
    <Dialog
      open={show}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{ title }</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          { message }
        </Typography>
        <Typography gutterBottom>
          <span>If the problem persists, feel free to contact support for assistance.</span>
        </Typography>
      </DialogContent>
    </Dialog>
  )
};

export default MUIMessageDialog;