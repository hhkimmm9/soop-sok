import { useAppState } from '@/utils/AppStateProvider';
import { useMemo } from 'react';

const useDialogs = () => {
  const { dispatch } = useAppState();

  const actionsDialog = useMemo(() => ({
    show: (type: 'confirm' | '') => {
      dispatch({ type: 'SHOW_ACTIONS_DIALOG', payload: { show: true, type } });
    },
    hide: () => {
      dispatch({ type: 'SHOW_ACTIONS_DIALOG', payload: { show: false, type: null } });
    },
    setResponse: (option: boolean) => {
      dispatch({ type: 'SET_ACTIONS_DIALOG_RESPONSE', payload: option });
    }
  }), [dispatch]);

  const messageDialog = useMemo(() => ({
    show: (type: 'data_retrieval' | 'data_update' | 'signin' | 'general') => {
      dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: { show: true, type } });
    },
    hide: () => {
      dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: { show: false, type: null } });
    }
  }), [dispatch]);

  return {
    actionsDialog,
    messageDialog
  };
};

export default useDialogs;