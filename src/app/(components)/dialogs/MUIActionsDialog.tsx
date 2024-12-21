"use client"

import { useAppState } from "@/utils/AppStateProvider"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Slide from "@mui/material/Slide"
import { TransitionProps } from "@mui/material/transitions"
import React, { useEffect, useState } from "react"
import type { JSX } from "react"

const CONFIRM_TITLE = "Are you sure you want to proceed?"
const CONFIRM_MESSAGE = "This action cannot be undone."
const CONFIRM_BUTTON_TEXT = "Confirm"

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

type MUIActionsDialogProps = {
  show: boolean
  handleClose: (
    event: object,
    reason: "backdropClick" | "escapeKeyDown",
  ) => void
  type: string | null
}

const MUIActionsDialog = (props: MUIActionsDialogProps): JSX.Element => {
  const [content, setContent] = useState({
    title: "",
    message: "",
    buttonText: "",
  })

  const { dispatch } = useAppState()

  useEffect(() => {
    if (props.type === "confirm") {
      setContent({
        title: CONFIRM_TITLE,
        message: CONFIRM_MESSAGE,
        buttonText: CONFIRM_BUTTON_TEXT,
      })
    }
  }, [props.type])

  const handleCloseWithButton = (): void => {
    dispatch({
      type: "SHOW_ACTIONS_DIALOG",
      payload: { show: false, type: null },
    })
  }

  const handleButtonClick = (): void => {
    dispatch({ type: "SET_ACTIONS_DIALOG_RESPONSE", payload: true })
  }

  return (
    <Dialog
      open={props.show}
      TransitionComponent={Transition}
      keepMounted
      onClose={props.handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{content.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {content.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseWithButton}>Cancel</Button>
        <Button onClick={handleButtonClick}>{content.buttonText}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default MUIActionsDialog
