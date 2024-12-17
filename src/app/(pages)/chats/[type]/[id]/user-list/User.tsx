"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { TUser } from "@/types"
import { auth } from "@/utils/firebase/firebase"
import { fetchUser } from "@/utils/firebase/firestore"

type UserProps = {
  uid: string
}

const User = ({ uid }: UserProps) => {
  const [user, setUser] = useState<TUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getuser = async () => {
      const user = await fetchUser(uid)
      setUser(user)
    }
    getuser()
  }, [uid])

  const redirectToProfile = (uid: string) => {
    if (auth) {
      router.push(`/profile/${uid}`)
    }
  }

  if (user)
    return (
      <li
        onClick={() => redirectToProfile(user.uid)}
        className="flex items-center justify-between rounded-lg bg-stone-200 p-3 shadow-sm"
      >
        <div className="flex w-full items-center gap-3 px-2 py-1">
          {/* <Avatar src={user.profilePicUrl} alt='Profile Picture' sx={{ width: 52, height: 52 }} /> */}
          <Image
            src={user.photoURL}
            alt="Profile Picture"
            width={64}
            height={64}
            className="rounded-full object-cover"
          />
          <p className="text-lg">{user.displayName}</p>
        </div>
      </li>
    )
}

export default User
