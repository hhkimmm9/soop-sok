import ProgressIndicator from "@/app/_components/ProgressIndicator"
import type { JSX } from "react"

const FriendsPageLoading = (): JSX.Element => {
  return (
    <div className="flex h-full items-center justify-center">
      <ProgressIndicator />
    </div>
  )
}

FriendsPageLoading.displayName = "FriendsPageLoading"

export default FriendsPageLoading
