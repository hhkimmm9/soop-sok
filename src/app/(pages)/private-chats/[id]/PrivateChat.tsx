import { collection, limit, orderBy, query, where } from "firebase/firestore"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useCollection } from "react-firebase-hooks/firestore"

import { TMessage, TPrivateChat } from "@/types"
import useDialogs from "@/utils/dispatcher" // Adjust the import path as necessary
import { auth, firestore } from "@/utils/firebase/firebase"
import { formatTimeAgo } from "@/utils/functions"

type PrivateChatProps = {
  privateChat: TPrivateChat
}

const PrivateChat = ({ privateChat }: PrivateChatProps) => {
  const [latestMessage, setLatestMessage] = useState<TMessage | null>(null)

  const router = useRouter()
  const { messageDialog } = useDialogs()

  const messageRef = query(
    collection(firestore, "messages"),
    where("cid", "==", privateChat.id),
    orderBy("createdAt", "desc"),
    limit(1),
  )

  const [snapshot, loading, error] = useCollection(messageRef, {
    snapshotListenOptions: { includeMetadataChanges: true },
  })

  useEffect(() => {
    if (snapshot && !loading) {
      const latestMessage = snapshot.empty
        ? []
        : snapshot.docs.map((doc) => doc.data())
      if (latestMessage.length > 0) {
        setLatestMessage((latestMessage[0] as TMessage) || null)
      }
    }

    if (error) {
      console.error(error)
      messageDialog.show("data_retrieval")
    }
  }, [snapshot, loading, error, messageDialog])

  // fetch the latest message associated with this private chat
  // to display when it is sent and the content of it.

  const enterPrivateChat = () => {
    if (auth && auth.currentUser) {
      router.push(`/chats/private-chat/${privateChat.id}`)
    }
  }

  if (latestMessage)
    return (
      <div onClick={enterPrivateChat}>
        <div className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
          <Image
            src={latestMessage.senderPhotoURL}
            alt=""
            width={1324}
            height={1827}
            className="h-16 w-16 rounded-full object-cover"
          />

          <div className="w-min grow">
            <div className="flex justify-between">
              {/* Sender's name. */}
              <p className="font-medium">{latestMessage.senderName}</p>

              {/* the time last message was received. */}
              {latestMessage && <p>{formatTimeAgo(latestMessage.createdAt)}</p>}
            </div>

            {/* the content of the last message. */}
            <p className="mt-1 line-clamp-2 h-[3rem] overflow-hidden">
              {latestMessage.message}
            </p>
          </div>
        </div>
      </div>
    )
}

export default PrivateChat
