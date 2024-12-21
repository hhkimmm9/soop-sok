"use client"

import { auth } from "@/utils/firebase/firebase"
import { updateUserStatus } from "@/utils/firebase/firestore"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { JSX } from "react"
import { useSignOut } from "react-firebase-hooks/auth"

const Settings = (): JSX.Element => {
  const router = useRouter()

  const [signOut] = useSignOut(auth)

  const handleSignout = async (): Promise<void> => {
    if (!auth?.currentUser) return

    try {
      const res = await updateUserStatus(auth.currentUser.uid, "signout")
      if (!res) {
        console.error("Session expired or update failed")
        return
      }

      await signOut()
      router.push("/")
    } catch (err) {
      console.error("Error during sign out:", err)
    }
  }

  return (
    <>
      <h1 className="my-8 text-center text-3xl font-semibold text-earth-600">
        Settings
      </h1>
      <div className="flex flex-col items-center gap-4">
        <Link
          href={`/profile/${auth.currentUser?.uid}`}
          className="w-full rounded-lg border border-earth-300 bg-white py-3 text-center text-base font-semibold text-earth-500 shadow transition duration-300 ease-in-out hover:border-earth-500 hover:bg-earth-500 hover:text-white"
        >
          {" "}
          Profile{" "}
        </Link>

        <button
          onClick={handleSignout}
          className="w-full rounded-lg border border-earth-300 bg-white py-3 text-base font-semibold text-earth-500 shadow transition duration-300 ease-in-out hover:border-red-500 hover:bg-red-500 hover:text-white"
        >
          {" "}
          Sign Out{" "}
        </button>
      </div>
    </>
  )
}

export default Settings
