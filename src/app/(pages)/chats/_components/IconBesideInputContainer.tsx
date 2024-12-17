import { ArrowLeftIcon, Bars3Icon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"

import { auth } from "@/utils/firebase/firebase"

interface IconBesideInputContainerProps {
  type: string
  cid: string
}

const IconBesideInputContainer = ({
  type,
  cid,
}: IconBesideInputContainerProps) => {
  const router = useRouter()

  const handleClick = () => {
    if (type === "channel" || type === "chatroom") {
      router.push(`/chats/${type}/${cid}/features`)
    } else {
      router.push(`/private-chats/${auth.currentUser?.uid}`)
    }
  }

  return (
    <div
      className="flex items-center rounded-lg bg-white p-2 shadow-sm"
      onClick={handleClick}
    >
      {type === "channel" || type === "chatroom" ? (
        <Bars3Icon className="h-5 w-5" />
      ) : (
        <ArrowLeftIcon className="h-5 w-5" />
      )}
    </div>
  )
}

export default IconBesideInputContainer
