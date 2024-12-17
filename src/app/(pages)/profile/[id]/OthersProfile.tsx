import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { TUser } from "@/types"
import useDialogs from "@/utils/dispatcher"
import { auth } from "@/utils/firebase/firebase"
import {
  checkIsMyFriend,
  getOrCreateChatId,
  makeFriend,
} from "@/utils/firebase/firestore"

const OthersProfile = ({ profile }: { profile: TUser | null }) => {
  const [isMyFriend, setIsMyFriend] = useState(false)

  const router = useRouter()

  const { messageDialog } = useDialogs()

  useEffect(() => {
    const initCheckIsMyFriend = async () => {
      if (auth?.currentUser && profile?.uid) {
        try {
          const friends = await checkIsMyFriend(
            auth.currentUser?.uid,
            profile.uid,
          )
          if (friends) {
            setIsMyFriend(true)
          }
        } catch (err) {
          console.error(err)
          messageDialog.show("data_retrieval")
        }
      }
    }
    initCheckIsMyFriend()
  }, [messageDialog, profile?.uid])

  const redirectToDMChat = async () => {
    const myId = auth.currentUser?.uid
    const friendId = profile?.uid

    if (!myId || !friendId) return

    try {
      const chat = await getOrCreateChatId(myId, friendId)

      if (chat) {
        router.push(`/chats/private-chat/${chat.id}`)
        return
      }
    } catch (err) {
      console.error(err)
      messageDialog.show("data_retrieval")
    }
  }

  const addUserToFriendList = async () => {
    if (auth?.currentUser && profile) {
      try {
        await makeFriend(auth.currentUser?.uid, profile?.uid)
        setIsMyFriend(true)
      } catch (err) {
        console.error(err)
        messageDialog.show("data_update")
      }
    }
  }

  return (
    <div className="grid w-full grid-cols-2 gap-2">
      {isMyFriend ? (
        <button
          type="button"
          onClick={() => {}}
          className="block rounded-lg border bg-white py-2 shadow-sm"
        >
          Poke! (Say Hi!)
        </button>
      ) : (
        <button
          type="button"
          onClick={addUserToFriendList}
          className="block rounded-lg border bg-white py-2 shadow-sm"
        >
          Send Friend Request
        </button>
      )}

      <button
        type="button"
        onClick={redirectToDMChat}
        className="block rounded-lg border bg-white py-2 shadow-sm"
      >
        Send DM
      </button>
    </div>
  )
}

export default OthersProfile
