"use client"

import "firebaseui/dist/firebaseui.css"

import { GoogleAuthProvider } from "firebase/auth"
import firebaseui from "firebaseui"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import Cookies from "universal-cookie"

import useDialogs from "@/utils/dispatcher"
import { auth } from "@/utils/firebase/firebase"
import {
  registerUserWithUID,
  updateUserStatus,
} from "@/utils/firebase/firestore"

type TFirebaseUI = {
  default: typeof firebaseui
  auth: typeof firebaseui.auth
}

const BACKGROUND_IMAGE_URL: string = "/images/background.png"

export default function Home() {
  const [firebaseui, setFirebaseUI] = useState<TFirebaseUI | null>(null)

  const router = useRouter()

  const { messageDialog } = useDialogs()

  const uiConfig = useMemo(() => {
    const cookies = new Cookies()

    // Initialize the FirebaseUI widget using Firebase.
    return {
      callbacks: {
        signInSuccessWithAuthResult: (authResult: any) => {
          ;(async () => {
            cookies.set("auth-token", authResult.credential.accessToken)

            const isNewUser = authResult.additionalUserInfo.isNewUser

            const displayName = authResult.user.displayName
            const email = authResult.user.email
            const photoURL = authResult.user.photoURL
            const uid = authResult.user.uid

            // If this is the first time sign in,
            if (isNewUser) {
              // Register a new user with Firebase.
              try {
                const res1 = await registerUserWithUID(
                  displayName,
                  email,
                  photoURL,
                  uid,
                )

                // Error handling: ?
                if (!res1) {
                  //
                }
              } catch (err) {
                // In case of an error, show an error message.
                console.error("Error getting document:", err)
                messageDialog.show("general")
              }
            }
            // If a user is returning,
            else {
              // Update the isOnline.
              try {
                const res2 = await updateUserStatus(uid, "signin")

                // Error handling: Wrong credential
                if (!res2) {
                  //
                }
              } catch (err) {
                // In case of an error, show an error message.
                console.error("Error getting document:", err)
                messageDialog.show("general")
              }
            }

            router.push("/channels")
          })()
          // https://firebaseopensource.com/projects/firebase/firebaseui-web/#available-callbacks
          // whether we leave that to developer to handle.
          return false
        },
      },
      signinFlow: "popup",
      // signInSuccessUrl: '/channels',
      signInOptions: [GoogleAuthProvider.PROVIDER_ID],
    }
  }, [router, messageDialog])

  useEffect(() => {
    const loadFirebaseUI = async () => {
      try {
        const firebaseui = await import("firebaseui")
        setFirebaseUI(firebaseui)
      } catch (error) {
        console.error("Error loading FirebaseUI:", error)
      }
    }
    loadFirebaseUI()
  }, [])

  useEffect(() => {
    if (firebaseui) {
      const ui =
        firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth)
      ui.start("#firebaseui-auth-container", uiConfig)
    }
  }, [firebaseui, uiConfig])

  return firebaseui ? (
    <>
      <div className="relative">
        <div className="absolute left-0 right-0 z-10 flex h-screen flex-col gap-96 py-40 text-center">
          {/* App name */}
          <h1 className="bg-gradient-to-r from-green-400 via-white to-yellow-400 bg-clip-text font-dhurjati text-7xl font-bold text-transparent">
            Soop Sok
          </h1>

          {/* Firebase UI */}
          <div id="firebaseui-auth-container" />
        </div>

        <Image
          src={BACKGROUND_IMAGE_URL}
          alt="background image"
          width={1024}
          height={1792}
          className="h-screen object-cover"
        />
      </div>
    </>
  ) : null
}
