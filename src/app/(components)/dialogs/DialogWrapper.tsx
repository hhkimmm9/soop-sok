"use client"

import MUIActionsDialog from "./MUIActionsDialog"
import MUIMessageDialog from "./MUIMessageDialog"
import { useAppState } from "@/utils/AppStateProvider"
import type { JSX } from "react"

const DialogWrapper = (): JSX.Element => {
  const { state, dispatch } = useAppState()

  return (
    <>
      <MUIMessageDialog
        show={state.showMessageDialog}
        handleClose={() => {
          dispatch({
            type: "SHOW_MESSAGE_DIALOG",
            payload: { show: false, type: null },
          })
        }}
        type={state.messageDialogType}
      />

      <MUIActionsDialog
        show={state.showActionsDialog}
        handleClose={() => {
          dispatch({
            type: "SHOW_ACTIONS_DIALOG",
            payload: { show: false, type: null },
          })
        }}
        type={state.actionsDialogType}
      />
    </>
  )
}

export default DialogWrapper
