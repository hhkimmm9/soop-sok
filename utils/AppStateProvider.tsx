'use client';

import React, {
  createContext,
  useContext,
  ReactNode,
  useReducer,
} from 'react';

import { TBanner } from '@/types';
interface AppState {
  publicChatURL: string;
  privateChatURL: string;
  currentBanner: TBanner | null;
};

type Action = (
  | { type: "SET_PUBLIC_URL", publicChatURL: string }
  | { type: "SET_PRIVATE_URL", privateChatURL: string }
  | { type: "SET_CURRENT_BANNER", currentBanner: TBanner }
);

const initialState: AppState = {
  publicChatURL: "",
  privateChatURL: "",
  currentBanner: null,
}

const AppStateContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<Action>
} | undefined>(undefined);

const appStateReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "SET_PUBLIC_URL":  
      return {
        ...state,
        publicChatURL: action.publicChatURL,
      };
    case "SET_PRIVATE_URL":  
      return {
        ...state,
        privateChatURL: action.privateChatURL,
      };
    case "SET_CURRENT_BANNER":
      return {
        ...state,
        currentBanner: action.currentBanner
      };
    default:
      return state;
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