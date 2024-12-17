"use client"

import Banner from "@/app/_components/chat-window/Banner"
import MessageContainer from "@/app/_components/chat-window/MessageContainer"
import MessageInput from "@/app/_components/chat-window/MessageInput"
import IconBesideInputContainer from "@/app/(pages)/chats/_components/IconBesideInputContainer"

interface ChatPageProps {
  params: {
    type: string
    id: string
  }
}

const ChatPage = ({ params }: ChatPageProps) => {
  return (
    <div className="grid h-full grid-rows-12">
      {(params.type === "channel" || params.type === "chatroom") && <Banner />}

      <div
        className={`flex h-full flex-col gap-4 ${
          params.type === "channel" || params.type === "chatroom"
            ? // If this is either a channel chat or general chat in a channel, show the banner.
              "row-span-11 row-start-2"
            : // Otherwise no banner.
              "row-span-12 row-start-1"
        } `}
      >
        <MessageContainer type={params.type} cid={params.id} />

        {/* features / leave and message input container */}
        <div className="flex justify-between gap-3">
          <IconBesideInputContainer type={params.type} cid={params.id} />
          <MessageInput cid={params.id} />
        </div>
      </div>
    </div>
  )
}

export default ChatPage
