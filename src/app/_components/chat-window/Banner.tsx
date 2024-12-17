"use client"

import "@/app/_components/Marquee.css"

import { useEffect } from "react"

import { useAppState } from "@/utils/AppStateProvider"
import useDialogs from "@/utils/dispatcher"
import { getBanner } from "@/utils/firebase/firestore"

const Banner = () => {
  const { state } = useAppState()
  const { bannerState } = useDialogs()

  useEffect(() => {
    const fetchBanner = async () => {
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
