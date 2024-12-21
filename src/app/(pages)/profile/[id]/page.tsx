"use client"

import OthersProfile from "./OthersProfile"
import { TUser } from "@/types"
import useDialogs from "@/utils/dispatcher"
import { auth } from "@/utils/firebase/firebase"
import { fetchUser } from "@/utils/firebase/firestore"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import type { JSX } from "react"

const ProfilePage = (): JSX.Element => {
  // const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<TUser | null>(null)

  const { id } = useParams()

  const { messageDialog } = useDialogs()

  useEffect(() => {
    const getUser = async (): Promise<void> => {
      try {
        const res = await fetchUser(id.toString())
        console.log(res)

        if (!res) {
          // Handle the case where the response is null
        } else {
          setProfile(res)
        }
      } catch (err) {
        console.error(err)
        messageDialog.show("data_retrieval")
      }
    }
    getUser()
  }, [id, messageDialog, profile?.uid])

  return (
    <div className="flex flex-col gap-4 pt-10">
      {/* pic and name */}
      <div className="grid w-full grid-cols-4">
        <div className="pl-2">
          <Image
            src={profile?.photoURL || "/images/default-avatar.png"}
            alt="Profile Picture"
            width={128}
            height={128}
            className="cols-span-1 rounded-full object-cover"
          />
        </div>

        <div className="cols-span-3 flex flex-col gap-3 pl-6">
          <p className="mx-auto whitespace-nowrap text-3xl font-medium">
            {profile?.displayName || "Anonymous"}
          </p>

          <p className="rounded-full bg-purple-300 px-2 py-1 text-center font-medium uppercase text-white">
            {profile?.profile?.mbti || "N/A"}
          </p>
        </div>
      </div>

      {auth.currentUser?.uid == profile?.uid ? (
        // if the profile is the current user's profile
        <div className="flex w-full flex-col gap-8">
          <Link
            href={`/profile/${profile?.uid}/edit`}
            className="block rounded-lg border bg-white py-2 text-center shadow-sm"
          >
            {" "}
            Edit Profile{" "}
          </Link>
        </div>
      ) : (
        // if the profile is not the current user's profile
        <OthersProfile profile={profile} />
      )}

      {/* introduction */}
      <div className="h-52 overflow-y-auto rounded-lg border bg-white p-4">
        <p>{profile?.profile.introduction}</p>
      </div>
    </div>
  )
}

ProfilePage.displayName = "ProfilePage"

export default ProfilePage
