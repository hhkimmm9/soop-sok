"use client"

import { TUser } from "@/types"
import { auth } from "@/utils/firebase/firebase"
import { fetchUser } from "@/utils/firebase/firestore"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { JSX } from "react"

type UserProps = {
  uid: string
}

const User = (props: UserProps): JSX.Element => {
  const [user, setUser] = useState<TUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getuser = async (): Promise<void> => {
      const user = await fetchUser(props.uid)
      setUser(user)
    }
    getuser()
  }, [props.uid])

  const redirectToProfile = (uid: string | undefined): void => {
    if (uid && auth) {
      router.push(`/profile/${uid}`)
    }
  }

  return (
    <li
      onClick={() => redirectToProfile(user?.uid)}
      className="flex cursor-pointer items-center justify-between rounded-lg bg-stone-200 p-3 shadow-sm"
    >
      <div className="flex w-full items-center gap-3 px-2 py-1">
        <Image
          // TODO: Add a default profile picture
          src={user?.photoURL || "/default-profile.png"}
          alt="Profile Picture"
          width={64}
          height={64}
          className="rounded-full object-cover"
        />
        <p className="text-lg">{user?.displayName}</p>
      </div>
    </li>
  )
}

export default User
