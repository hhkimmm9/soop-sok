import { doc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDocumentData } from "react-firebase-hooks/firestore"

import { TChat } from "@/types"
import { useAppState } from "@/utils/AppStateProvider"
import { auth, firestore } from "@/utils/firebase/firebase"
import { updateChat } from "@/utils/firebase/firestore"
import { formatTimeAgo } from "@/utils/functions"

type ChatProps = {
  chat: TChat
}

const Chat = ({ chat }: ChatProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isFull, setIsFull] = useState(false)

  const router = useRouter()

  const { dispatch } = useAppState()

  // Authorize users before rendering the page.
  useEffect(() => {
    if (!auth) {
      router.push("/")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  // Fetch channle data in real time only if a user is authorized.
  const chatRef = doc(firestore, "chats", chat.id)
  const [value, loading, error] = useDocumentData(
    isAuthenticated ? chatRef : null,
  )

  useEffect(() => {
    if (value?.numMembers < value?.capacity) {
      setIsFull(false)
    }
  }, [value])

  // Error: real time data fetching
  useEffect(() => {
    if (error !== undefined) {
      dispatch({
        type: "SHOW_MESSAGE_DIALOG",
        payload: { show: true, type: "data_retrieval" },
      })
      router.refresh()
    }
  }, [error, dispatch, router])

  const handleEnterChat = async () => {
    // Authorize users.
    if (auth && auth.currentUser && !isFull) {
      try {
        const res = await updateChat(chat.id, auth.currentUser.uid, "enter")

        if (res) router.push(`/chats/chatroom/${chat.id}`)
      } catch (err) {
        console.error(err)
        dispatch({
          type: "SHOW_MESSAGE_DIALOG",
          payload: { show: true, type: "general" },
        })
      }
    }
  }

  return (
    <div
      onClick={handleEnterChat}
      className="flex flex-col gap-1 rounded-lg bg-stone-100 px-3 py-2"
    >
      {/* name */}
      <div>
        <p className="line-clamp-1">{chat.name}</p>
      </div>

      {/* chat info: created_at */}
      <div className="flex justify-end">
        <p className="text-sm">{formatTimeAgo(chat.createdAt)}</p>
      </div>

      {/* topic, buttons */}
      <div className="flex h-6 justify-between">
        {chat.tag.length > 0 && (
          // bubble
          <div className="rounded-full bg-amber-500 px-4 py-1 text-xs text-white">
            <span>{chat.tag}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat
