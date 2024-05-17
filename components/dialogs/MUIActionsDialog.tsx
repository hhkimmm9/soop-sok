'use client';

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

// TODO:
const CONFIRM_TITLE = 'confirm title';
const CONFIRM_MESSAGE = 'confirm message';
const CONFIRM_BUTTON_TEXT = 'Confirm';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type MUIActionsDialogProps = {
  show: boolean,
  handleClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void,
  type: string | null,
};

const MUIActionsDialog = ({
  show,
  handleClose,
  type,
}: MUIActionsDialogProps) => {
  const [content, setContent] = useState({
    title: '',
    message: '',
    buttonText: ''
  });

  useEffect(() => {
    if (type === 'confirm') {
      setContent({
        title: CONFIRM_TITLE,
        message: CONFIRM_MESSAGE,
        buttonText: CONFIRM_BUTTON_TEXT
      });
    }
  }, [type]);
  const handleButtonClick = () => {
    // 
  };

  return (
    <Dialog
      open={show}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{ content.title }</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          { content.message }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleButtonClick}>Cancel</Button>
        <Button onClick={handleButtonClick}>{ content.buttonText }</Button>
      </DialogActions>
    </Dialog>
  )
};

export default MUIActionsDialog;