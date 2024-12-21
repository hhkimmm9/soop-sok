import { TChat } from "@/types"
import useDialogs from "@/utils/dispatcher"
import { auth, firestore } from "@/utils/firebase/firebase"
import { updateChat } from "@/utils/firebase/firestore"
import { formatTimeAgo } from "@/utils/functions"
import { doc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { JSX } from "react"
import { useDocumentData } from "react-firebase-hooks/firestore"

type ChatProps = {
  chat: TChat
}

const Chat = (props: ChatProps): JSX.Element => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isFull, setIsFull] = useState(false)

  const router = useRouter()

  const { messageDialog } = useDialogs()

  // Authorize users before rendering the page.
  useEffect(() => {
    if (!auth) {
      router.push("/")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  // Fetch channle data in real time only if a user is authorized.
  const chatRef = doc(firestore, "chats", props.chat.id)
  const [value, error] = useDocumentData(isAuthenticated ? chatRef : null)

  useEffect(() => {
    if (value?.numMembers < value?.capacity) {
      setIsFull(false)
    }
  }, [value])

  // Error: real time data fetching
  useEffect(() => {
    if (error !== undefined) {
      messageDialog.show("data_retrieval")
      router.refresh()
    }
  }, [error, messageDialog, router])

  const handleEnterChat = async (): Promise<void> => {
    // Authorize users.
    if (auth && auth.currentUser && !isFull) {
      try {
        const res = await updateChat(
          props.chat.id,
          auth.currentUser.uid,
          "enter",
        )

        if (res) router.push(`/chats/chatroom/${props.chat.id}`)
      } catch (err) {
        console.error(err)
        messageDialog.show("general")
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
        <p className="line-clamp-1">{props.chat.name}</p>
      </div>

      {/* chat info: created_at */}
      <div className="flex justify-end">
        <p className="text-sm">{formatTimeAgo(props.chat.createdAt)}</p>
      </div>

      {/* topic, buttons */}
      <div className="flex h-6 justify-between">
        {props.chat.tag.length > 0 && (
          // bubble
          <div className="rounded-full bg-amber-500 px-4 py-1 text-xs text-white">
            <span>{props.chat.tag}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat
