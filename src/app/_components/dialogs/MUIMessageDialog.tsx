"use client"

import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Slide from "@mui/material/Slide"
import { TransitionProps } from "@mui/material/transitions"
import Typography from "@mui/material/Typography"
import React, { useEffect, useState } from "react"

const GENERAL_TITLE = "Error: Oops, Something Went Wrong!"
const GENERAL_MESSAGE =
  "Oops! It seems there was an error. Please try again later"
const DATA_RETRIEVAL_TITLE = "Data Retrieval Error"
const DATA_RETRIEVAL_MESSAGE =
  "Oops! It seems there was an issue retrieving the data. Please check your internet connection and try again."
const DATA_UPDATE_TITLE = "Data Update Error"
const DATA_UPDATE_MESSAGE =
  "Oops! It seems there was an issue updating the data. Please try again later."
const SIGN_IN_TITLE = "Sign In Error"
const SIGN_IN_MESSAGE =
  "Oops! It seems there was an issue with signing in. Please double-check your credentials and try again."

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

type DialogComponentProps = {
  show: boolean
  type: string | null
  handleClose: (
    event: object,
    reason: "backdropClick" | "escapeKeyDown",
  ) => void
}

const MUIMessageDialog = ({
  show,
  type,
  handleClose,
}: DialogComponentProps) => {
  const [content, setContent] = useState({
    title: "",
    message: "",
  })

  useEffect(() => {
    if (type === "data_retrieval") {
      setContent({
        title: DATA_RETRIEVAL_TITLE,
        message: DATA_RETRIEVAL_MESSAGE,
      })
    } else if (type === "data_update") {
      setContent({
        title: DATA_UPDATE_TITLE,
        message: DATA_UPDATE_MESSAGE,
      })
    } else if (type === "signin") {
      setContent({
        title: SIGN_IN_TITLE,
        message: SIGN_IN_MESSAGE,
      })
    } else {
      setContent({
        title: GENERAL_TITLE,
        message: GENERAL_MESSAGE,
      })
    }
  }, [type])

  return (
    <Dialog
      open={show}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{content.title}</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>{content.message}</Typography>
        <Typography gutterBottom>
          <span>
            If the problem persists, feel free to contact support for
            assistance.
          </span>
        </Typography>
      </DialogContent>
    </Dialog>
  )
}

export default MUIMessageDialog
