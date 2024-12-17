"use client"

import {
  ChatBubbleBottomCenterIcon,
  Cog6ToothIcon,
  QueueListIcon,
  UserIcon,
} from "@heroicons/react/24/outline"
import { Badge } from "@mui/material"
import { usePathname, useRouter } from "next/navigation"

import { useAppState } from "@/utils/AppStateProvider"
import { auth } from "@/utils/firebase/firebase"

const tabs = [
  { tab: "public-chat", icon: <QueueListIcon className="h-5 w-5" />, badge: 1 },
  {
    tab: "private-chat",
    icon: <ChatBubbleBottomCenterIcon className="h-5 w-5" />,
    badge: 2,
  },
  { tab: "friends", icon: <UserIcon className="h-5 w-5" />, badge: 3 },
  { tab: "settings", icon: <Cog6ToothIcon className="h-5 w-5" />, badge: 4 },
]

const NavBar = () => {
  const router = useRouter()
  const pathname = usePathname()

  const { state, dispatch } = useAppState()

  const redirectTo = (tab: string) => {
    const { currentUser } = auth
    const { publicChatURL, privateChatURL } = state

    let redirectURL = ""

    if (
      pathname.includes("/chats/channel") ||
      pathname.includes("/chats/chatroom")
    ) {
      dispatch({ type: "SET_PUBLIC_URL", payload: pathname })
    } else if (
      pathname.includes("/private-chats") ||
      pathname.includes("/chats/private-chat")
    ) {
      dispatch({ type: "SET_PRIVATE_URL", payload: pathname })
    }

    const tabURLs: { [key: string]: string } = {
      "public-chat": publicChatURL || "/channels",
      "private-chat": privateChatURL || `/private-chats/${currentUser?.uid}`,
      friends: "/friends",
      settings: "/settings",
    }

    redirectURL = tabURLs[tab] || ""

    if (redirectURL) router.push(redirectURL)
  }

  return (
    <>
      {pathname !== "/" && (
        <nav className="absolute bottom-0 flex h-14 w-full items-center justify-between bg-earth-50 px-12 py-3">
          {tabs.map(({ tab, icon, badge }) => (
            <Badge key={tab} badgeContent={badge} color="primary">
              <div
                onClick={() => redirectTo(tab)}
                className="rounded-full bg-earth-100 p-2 transition duration-300 ease-in-out hover:bg-earth-200"
              >
                {icon}
              </div>
            </Badge>
          ))}
        </nav>
      )}
    </>
  )
}

export default NavBar
