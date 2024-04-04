'use client';

import React, {
  createContext,
  useContext,
  ReactNode,
  useReducer,
} from 'react';

type TAvailableChannelComponents = (
  | 'lobby'
  | 'features'
  | 'create_chat'
  | 'chat_list'
  | 'user_list'
  | 'chat'
);

interface AppState {
  currentPage: ('channel' | 'private_chat' | 'pages');
  activateChannelChat: boolean;
  activateChatChat: boolean;
  activatePrivateChat: boolean;
  channelId: string;
  chatId: string;
  privateChatId: string;
  channelComponent: TAvailableChannelComponents;
};

type Action = (
  | { type: 'SET_TO_CHANNEL' }
  | { type: 'SET_TO_PRIVATE_CHAT' }
  | { type: 'SET_TO_PAGES' }
  | { type: 'ENTER_CHANNEL', channelId: string }
  | { type: 'ENTER_CHAT', chatId: string }
  | { type: 'ENTER_PRIVATE_CHAT', privateChatId: string }
  | { type: 'LEAVE_CHANNEL' }
  | { type: 'LEAVE_CHAT' }
  | { type: 'LEAVE_PRIVATE_CHAT' }
  | {
      type: 'CURRENT_CHANNEL_COMPONENT',
      channelComponent: TAvailableChannelComponents
    }
);

const initialState: AppState = {
  currentPage: 'pages',
  activateChannelChat: false,
  activateChatChat: false,
  activatePrivateChat: false,
  channelId: '',
  chatId: '',
  privateChatId: '',
  channelComponent: 'lobby'
}

const AppStateContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<Action>
} | undefined>(undefined);

const appStateReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_TO_CHANNEL':
      return { ...state, currentPage: 'channel' };
    case 'SET_TO_PRIVATE_CHAT':
      return { ...state, currentPage: 'private_chat' };
    case 'SET_TO_PAGES':
      return { ...state, currentPage: 'pages' };
    case 'ENTER_CHANNEL':
      return {
        ...state,
        activateChannelChat: true,
        channelComponent: 'lobby',
        channelId: action.channelId
      };
    case 'ENTER_CHAT':
      return {
        ...state,
        activateChannelChat: false,
        activateChatChat: true,
        channelComponent: 'chat',
        chatId: action.chatId
      };
    case 'ENTER_PRIVATE_CHAT':
      return {
        ...state,
        activatePrivateChat: true,
        privateChatId: action.privateChatId
      };
    case 'LEAVE_CHANNEL':
      return {
        ...state,
        activateChannelChat: false,
        channelId: '',
      };
    case 'LEAVE_CHAT':
      return {
        ...state,
        activateChannelChat: true,
        activateChatChat: false,
        channelComponent: 'lobby',
        chatId: ''
      };
    case 'LEAVE_PRIVATE_CHAT':
      return {
        ...state,
        activatePrivateChat: false,
        privateChatId: ''
      };
    case 'CURRENT_CHANNEL_COMPONENT':
      return {
        ...state,
        channelComponent: action.channelComponent
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