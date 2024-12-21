"use client"

import { TBanner } from "@/types"
import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useReducer,
} from "react"
import type { JSX } from "react"

interface AppState {
  publicChatURL: string
  privateChatURL: string
  currentBanner: TBanner | null
  showMessageDialog: boolean
  messageDialogType: string | null
  showActionsDialog: boolean
  actionsDialogType: string | null
  actionsDialogResponse: boolean
  channelId: string | null
}

type Action =
  | {
      type: "SET_PUBLIC_URL"
      payload: string
    }
  | {
      type: "SET_PRIVATE_URL"
      payload: string
    }
  | {
      type: "SET_CURRENT_BANNER"
      payload: TBanner
    }
  | {
      type: "SHOW_MESSAGE_DIALOG"
      payload: { show: boolean; type: string | null }
    }
  | {
      type: "SHOW_ACTIONS_DIALOG"
      payload: { show: boolean; type: string | null }
    }
  | {
      type: "SET_ACTIONS_DIALOG_RESPONSE"
      payload: boolean
    }
  | {
      type: "SET_CHANNEL_ID"
      payload: string | null
    }

const initialState: AppState = {
  publicChatURL: "",
  privateChatURL: "",
  currentBanner: null,
  showMessageDialog: false,
  messageDialogType: null,
  showActionsDialog: false,
  actionsDialogType: null,
  actionsDialogResponse: false,
  channelId: null,
}

const AppStateContext = createContext<
  | {
      state: AppState
      dispatch: React.Dispatch<Action>
    }
  | undefined
>(undefined)

const appStateReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "SET_PUBLIC_URL":
      return { ...state, publicChatURL: action.payload }
    case "SET_PRIVATE_URL":
      return { ...state, privateChatURL: action.payload }
    case "SET_CURRENT_BANNER":
      return { ...state, currentBanner: action.payload }
    case "SHOW_MESSAGE_DIALOG":
      return {
        ...state,
        showMessageDialog: action.payload.show,
        messageDialogType: action.payload.type,
      }
    case "SHOW_ACTIONS_DIALOG":
      return {
        ...state,
        showActionsDialog: action.payload.show,
        actionsDialogType: action.payload.type,
      }
    case "SET_ACTIONS_DIALOG_RESPONSE":
      return { ...state, actionsDialogResponse: action.payload }
    case "SET_CHANNEL_ID":
      return { ...state, channelId: action.payload }
    default:
      return state
  }
}

export const AppStateProvider = ({
  children,
}: {
  children: ReactNode
}): JSX.Element => {
  const [state, dispatch] = useReducer(appStateReducer, initialState)

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch])

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  )
}

export const useAppState = (): {
  state: AppState
  dispatch: React.Dispatch<Action>
} => {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider")
  }
  return context
}
