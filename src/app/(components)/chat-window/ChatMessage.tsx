import { TMessage } from "@/types"
import { auth } from "@/utils/firebase/firebase"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React from "react"
import type { JSX } from "react"

type ChatMessageProps = {
  message: TMessage
}

const ChatMessage = (props: ChatMessageProps): JSX.Element => {
  const router = useRouter()

  const redirectToProfile = (): void => {
    if (auth) router.push(`/profile/${props.message?.uid}`)
  }

  return (
    <div className="grid grid-cols-6">
      <div onClick={redirectToProfile} className="col-span-1 mt-2">
        <Image
          src={props.message?.senderPhotoURL}
          alt="Profile Picture"
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
      </div>
      <div className="col-span-5 ml-2 flex flex-col gap-1">
        <p className="text-sm text-gray-600">{props.message?.senderName}</p>
        <div className="rounded-xl bg-gradient-to-b from-sky-500 to-sky-400 px-3 py-2">
          <p className="text-neutral-100">{props.message.message}</p>
        </div>
      </div>
    </div>
  )
}

export default ChatMessage
