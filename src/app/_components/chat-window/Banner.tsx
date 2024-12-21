"use client"

import "@/app/_components/Marquee.css"

import { useAppState } from "@/utils/AppStateProvider"
import useDialogs from "@/utils/dispatcher"
import { getBanner } from "@/utils/firebase/firestore"
import { useEffect } from "react"
import type { JSX } from "react"

const Banner = (): JSX.Element => {
  const { state } = useAppState()
  const { bannerState } = useDialogs()

  useEffect(() => {
    const fetchBanner = async (): Promise<void> => {
      try {
        const res = await getBanner()
        bannerState.set(res)
      } catch (err) {
        console.error(err)
      }
    }
    fetchBanner()
  }, [bannerState])

  return (
    <div className="h-min overflow-hidden rounded-lg bg-white py-2">
      <div className="marquee">
        <p className="inline-block px-4">{state.currentBanner?.content}</p>
      </div>
    </div>
  )
}

export default Banner
