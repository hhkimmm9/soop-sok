"use client"

import Chat from "@/app/(pages)/chats/[type]/[id]/chat-list/Chat"
import { TChat } from "@/types"
import { auth, firestore } from "@/utils/firebase/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { collection } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { JSX } from "react"
import { useCollection } from "react-firebase-hooks/firestore"

type pageProps = {
  params: {
    type: string
    id: string
  }
}

const ChatListPage = ({ params }: pageProps): JSX.Element => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  // const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState<TChat[]>([])

  const router = useRouter()

  const [value, loading, error] = useCollection(
    collection(firestore, "chats"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  )

  // Authenticate a user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/")
      } else {
        setIsAuthenticated(true)
      }
    })

    if (isAuthenticated && value) {
      const chatList = value.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as TChat,
      )

      setChats(chatList)
    }

    // Cleanup subscription on unmount
    return () => {
      unsubscribe()
    }
  }, [isAuthenticated, value, router])

  useEffect(() => {
    if (loading) {
      console.log("Loading messages...")
    }

    if (error) {
      console.error("Error fetching messages:", error)
    }
  }, [loading, error])

  // Local functions ----------------------------------------------------------
  const handleCancelClick = (): void => {
    if (auth) router.push(`/chats/${params.type}/${params.id}/features`)
  }

  return (
    <div className="flex h-full flex-col gap-4">
      {/* chat list */}
      <div className="row-span-11 flex grow flex-col gap-6 overflow-y-auto rounded-lg bg-white p-4">
        <h1 className="text-center text-2xl font-semibold capitalize text-earth-600">
          Chats
        </h1>

        <div className="flex flex-col gap-3">
          {chats.map((chat: TChat) => (
            <Chat key={chat.id} chat={chat} />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleCancelClick}
        className="w-full rounded-lg bg-white py-4 text-xl font-semibold text-earth-400 shadow transition duration-300 ease-in-out hover:bg-earth-50"
      >
        {" "}
        Cancel{" "}
      </button>
    </div>
  )
}

ChatListPage.displayName = "ChatListPage"

export default ChatListPage
