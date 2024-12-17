import { doc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDocumentData } from "react-firebase-hooks/firestore"

import { TChannel } from "@/types"
import useDialogs from "@/utils/dispatcher"
import { auth, firestore } from "@/utils/firebase/firebase"
import { updateChannel } from "@/utils/firebase/firestore"

interface ChannelProps {
  channel: TChannel
}

export const Channel = ({ channel }: ChannelProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isFull, setIsFull] = useState(false)

  const router = useRouter()

  const { messageDialog, channelState } = useDialogs()

  // Authorize users before rendering the page.
  useEffect(() => {
    if (!auth) {
      router.push("/")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  // Fetch channle data in real time only if a user is authorized.
  const channelRef = doc(firestore, "channels", channel.id)
  const [value, loading, error] = useDocumentData(
    isAuthenticated ? channelRef : null,
  )

  useEffect(() => {
    if (value?.numMembers >= value?.capacity) {
      setIsFull(true)
    }
  }, [value])

  // Error: real time data fetching
  useEffect(() => {
    if (error !== undefined) {
      messageDialog.show("data_retrieval")
    }
  }, [error, messageDialog])

  // When users join a channel, add them to the 'members' subcollection of the associated channel document and update the 'numMembers' field in the channel document accordingly.
  const handleEnterChannel = async () => {
    const currentUser = auth.currentUser

    if (!currentUser) {
      router.push("/")
      return
    }

    // Authorize users.
    if (!isFull) {
      // Log where the user is in.
      try {
        const res = await updateChannel(channel.id, currentUser.uid, "enter")

        // Store the channel ID in the global state.
        channelState.set(channel.id)

        // Redriect to the selected channel page.
        if (res) router.push(`/chats/channel/${channel.id}/`)
      } catch (err) {
        console.error(err)
        messageDialog.show("data_retrieval")
      }
    }
  }

  return (
    <div
      onClick={handleEnterChannel}
      className={` ${!isFull ? "cursor-pointer" : "cursor-not-allowed opacity-50"} flex flex-col gap-2 rounded-lg bg-white p-4 shadow-md transition duration-300 ease-in-out hover:bg-gray-100`}
    >
      <h3 className="text-lg font-semibold text-gray-800">{channel.name}</h3>
      <p className="text-sm text-gray-600">
        Capacity: {value?.numMembers} / {channel.capacity}
      </p>
    </div>
  )
}

export default Channel
