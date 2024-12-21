"use client"

import User from "@/app/(pages)/chats/[type]/[id]/user-list/User"
import useDialogs from "@/utils/dispatcher"
import { auth, firestore } from "@/utils/firebase/firebase"
import { doc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { JSX } from "react"
import { useDocument } from "react-firebase-hooks/firestore"

type userListPageProps = {
  params: {
    type: string
    id: string
  }
}

const UserListPage = ({ params }: userListPageProps): JSX.Element => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [users, setUsers] = useState([])

  const router = useRouter()

  const { messageDialog } = useDialogs()

  // Authenticate a user
  useEffect(() => {
    if (!auth) {
      router.push("/")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const chatRef = doc(firestore, "chats", params.id)
  const [snapshot, loading, error] = useDocument(
    isAuthenticated ? chatRef : null,
  )

  // Handling retrieved data
  useEffect(() => {
    if (snapshot && snapshot.exists() && !loading) {
      setUsers(snapshot.data().members)
    }
  }, [loading, snapshot])

  // Error handling
  useEffect(() => {
    if (error !== undefined) {
      messageDialog.show("data_retrieval")
      router.push(`/chats/${params.type}/${params.id}/features`)
    }
  }, [router, error, params.type, params.id, messageDialog])

  const redirectToFeaturesPage = (): void => {
    if (auth) {
      router.push(`/chats/${params.type}/${params.id}/features`)
    }
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex grow flex-col gap-4 overflow-y-auto rounded-lg bg-white p-4 shadow-sm">
        <h1 className="text-center text-2xl font-semibold capitalize text-earth-600">
          Users in this channel
        </h1>

        <ul className="flex flex-col gap-3">
          {users.map((user: any) => (
            <User key={user} uid={user} />
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={redirectToFeaturesPage}
        className="w-full rounded-lg bg-white py-4 text-xl font-semibold text-earth-400 shadow transition duration-300 ease-in-out hover:bg-earth-50"
      >
        {" "}
        Cancel{" "}
      </button>
    </div>
  )
}

UserListPage.displayName = "UserListPage"

export default UserListPage
