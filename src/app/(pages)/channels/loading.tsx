import ProgressIndicator from "@/app/_components/ProgressIndicator"
import type { JSX } from "react"

const PublicChatLoading = (): JSX.Element => {
  return (
    <div className="flex h-full items-center justify-center">
      <ProgressIndicator />
    </div>
  )
}

export default PublicChatLoading
