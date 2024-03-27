'use client';

import React, {
  createContext,
  useContext,
  ReactNode,
  useReducer,
} from 'react';

interface AppState {
  currentPage: 'in_channel' | 'private_chats' | 'pages'
};

type Action =
  | { type: 'SET_TO_IN_CHANNEL' }
  | { type: 'SET_TO_PRIVATE_CHATS' }
  | { type: 'SET_TO_PAGES' };

const initialState: AppState = {
  currentPage: 'in_channel'
}

const AppStateContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<Action>
} | undefined>(undefined);

const appStateReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_TO_IN_CHANNEL':
      return { ...state, currentPage: 'in_channel' }
    case 'SET_TO_PRIVATE_CHATS':
      return { ...state, currentPage: 'private_chats' }
    case 'SET_TO_PAGES':
      return { ...state, currentPage: 'pages' }
    default:
      return state
  }
};

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appStateReducer, initialState);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      { children }
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};