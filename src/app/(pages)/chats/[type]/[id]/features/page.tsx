"use client"

import {
  ArrowLeftStartOnRectangleIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  MegaphoneIcon,
  PlusIcon,
  UsersIcon,
} from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"

import { useAppState } from "@/utils/AppStateProvider"
import useDialogs from "@/utils/dispatcher"
import { auth } from "@/utils/firebase/firebase"
import { updateChannel, updateChat } from "@/utils/firebase/firestore"

type TFeatures =
  | "create-chat"
  | "add-banner"
  | "chat-list"
  | "user-list"
  | "cancel"

type PageProps = {
  params: {
    type: string
    id: string
  }
}

const Page = ({ params }: PageProps) => {
  const router = useRouter()
  const { state } = useAppState()
  const { channelState } = useDialogs()

  const redirectTo = (feature: TFeatures) => {
    if (auth) {
      const path = feature === "cancel" ? "" : `/${feature}`
      router.push(`/chats/${params.type}/${params.id}${path}`)
    }
  }

  const handleLeave = async () => {
    const currentUserId = auth.currentUser?.uid
    if (currentUserId) {
      const leaveAction = params.type === "channel" ? updateChannel : updateChat
      const res = await leaveAction(params.id, currentUserId, "leave")

      if (params.type === "channel") {
        channelState.set(null)
        if (res) router.push("/channels")
      } else if (params.type === "chatroom" && res) {
        router.push(`/chats/channel/${state.channelId}`)
      }
    }
  }

  const features = [
    { feature: "create-chat", Icon: PlusIcon, text: "Create Chat" },
    { feature: "add-banner", Icon: MegaphoneIcon, text: "Add Banner" },
    {
      feature: "chat-list",
      Icon: ChatBubbleOvalLeftEllipsisIcon,
      text: "Chat List",
    },
  ]

  return (
    <div className="flex h-full flex-col gap-4 py-8">
      <div className="flex grow flex-col gap-4 overflow-y-auto rounded-lg">
        {params.type === "channel" &&
          features.map(({ feature, Icon, text }) => (
            <div
              key={feature}
              onClick={() => redirectTo(feature as TFeatures)}
              className="flex items-center justify-center gap-4 rounded-lg bg-earth-50 py-5 transition duration-300 ease-in-out hover:bg-earth-100"
            >
              {/* <Icon className='h-7' /> */}

              {/* TODO: need some thick ass font  */}
              <p className="text-lg font-semibold text-earth-500">{text}</p>
            </div>
          ))}

        <div
          onClick={() => redirectTo("user-list")}
          className="flex items-center justify-center gap-4 rounded-lg bg-earth-50 py-5 transition duration-300 ease-in-out hover:bg-earth-100"
        >
          {/* <UsersIcon className='h-7' /> */}

          {/* TODO: need some thick ass font  */}
          <p className="text-lg font-semibold text-earth-500">User List</p>
        </div>

        {(params.type === "channel" || params.type === "chatroom") && (
          <div
            onClick={handleLeave}
            className="flex items-center justify-center gap-4 rounded-lg bg-earth-50 py-5 transition duration-300 ease-in-out hover:bg-earth-100"
          >
            {/* <ArrowLeftStartOnRectangleIcon className='h-7' /> */}

            {/* TODO: need some thick ass font  */}
            <p className="text-lg font-semibold text-earth-500">Leave</p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => redirectTo("cancel")}
        className="w-full rounded-lg bg-earth-50 py-4 text-lg font-semibold text-earth-500 shadow-sm transition duration-300 ease-in-out hover:bg-earth-100"
      >
        Cancel
      </button>
    </div>
  )
}

export default Page
