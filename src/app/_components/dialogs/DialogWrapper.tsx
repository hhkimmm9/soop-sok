"use client"

// eslint-disable-next-line simple-import-sort/imports
import { useAppState } from "@/utils/AppStateProvider"
import MUIActionsDialog from "./MUIActionsDialog"
import MUIMessageDialog from "./MUIMessageDialog"

const DialogWrapper = () => {
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
