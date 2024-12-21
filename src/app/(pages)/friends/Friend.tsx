"use client"

import { TUser } from "@/types"
import useDialogs from "@/utils/dispatcher"
import { auth } from "@/utils/firebase/firebase"
import { fetchUser, getOrCreateChatId } from "@/utils/firebase/firestore"
import { formatTimeAgo } from "@/utils/functions"
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { JSX } from "react"

const NO_PIC_PLACEHOLDER =
  "https://firebasestorage.googleapis.com/v0/b/chat-platform-for-introv-9f70c.appspot.com/o/No%20Image.png?alt=media&token=18067651-9566-4522-bf2e-9a7963731676"

type FriendProp = {
  friendId: string
}

export const Friend = (props: FriendProp): JSX.Element => {
  const [friend, setFriend] = useState<TUser | null>(null)

  const router = useRouter()

  const { messageDialog } = useDialogs()

  useEffect(() => {
    const getUser = async (): Promise<void | null> => {
      if (!auth) return

      try {
        const user = await fetchUser(props.friendId)
        if (user) {
          setFriend(user as TUser)
        }
      } catch (err) {
        console.error(err)
        messageDialog.show("data_retrieval")
      }
    }
    getUser()
  }, [messageDialog, props.friendId])

  const redirectToDMChat = async (): Promise<void | null> => {
    const myId = auth.currentUser?.uid
    const opponentId = props.friendId

    if (!myId || !opponentId) return

    // check if their dm chat exists
    if (auth) {
      try {
        const chat = await getOrCreateChatId(myId, props.friendId)

        if (chat) {
          router.push(`/chats/private-chat/${chat.id}`)
          return
        }
      } catch (err) {
        console.error(err)
        messageDialog.show("data_retrieval")
      }
    }
  }

  return (
    <div className="flex gap-4 rounded-lg bg-white p-5 shadow">
      <Link
        href={`/profile/${props.friendId}`}
        className={`flex h-min items-center rounded-full border-4 ${friend?.isOnline ? "border-lime-400" : "border-red-400"} `}
      >
        <Image
          src={friend?.photoURL || NO_PIC_PLACEHOLDER}
          alt={`${friend?.displayName}'s profile picture`}
          width={48}
          height={48}
          className="h-10 w-10 rounded-full object-cover"
        />
      </Link>

      <div className="grid grow grid-cols-6">
        <Link
          href={`/profile/${props.friendId}`}
          className="col-span-4 cursor-pointer"
        >
          <p className="truncate text-lg font-medium">{friend?.displayName}</p>
          <p className="whitespace-nowrap text-sm text-gray-600">
            Last login: {formatTimeAgo(friend?.lastLoginTime)}
          </p>
        </Link>

        <div className="col-span-2 flex items-center justify-end">
          <button
            onClick={redirectToDMChat}
            aria-label="Direct Message"
            className="rounded-full border border-earth-100 bg-white p-2 transition-colors duration-200 hover:bg-earth-50"
          >
            <ChatBubbleBottomCenterIcon className="h-5 w-5 text-earth-600" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Friend
