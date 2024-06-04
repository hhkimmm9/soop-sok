'use client';

import MUIActionsDialog from "./MUIActionsDialog";
import MUIMessageDialog from "./MUIMessageDialog";

import { useAppState } from '@/utils/AppStateProvider';

const DialogWrapper = () => {
  const { state, dispatch } = useAppState();

  return (<>
    <MUIMessageDialog
      show={state.showMessageDialog}
      handleClose={() => { dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: { show: false, type: undefined } }) }}
      type={state.messageDialogType}
    />

    <MUIActionsDialog
      show={state.showActionsDialog}
      handleClose={() => { dispatch({ type: 'SHOW_ACTIONS_DIALOG', payload: false }) }}
      type={state.actionsDialogType}
    />
  </>)
};

export default DialogWrapper;