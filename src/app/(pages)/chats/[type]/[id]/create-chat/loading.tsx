import ProgressIndicator from "@/app/(components)/ProgressIndicator"
import type { JSX } from "react"

const CreateChatPageLoading = (): JSX.Element => {
  return (
    <div className="flex h-full items-center justify-center">
      <ProgressIndicator />
    </div>
  )
}

export default CreateChatPageLoading
