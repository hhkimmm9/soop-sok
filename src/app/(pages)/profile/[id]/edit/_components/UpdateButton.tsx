import { Button } from "@mui/material"
import Link from "next/link"
import React, { useCallback } from "react"

import useDialogs from "@/utils/dispatcher"
import { auth } from "@/utils/firebase/firebase"

const UpdateButtons: React.FC = React.memo(() => {
  const { actionsDialog } = useDialogs()

  const askConfirm = useCallback(() => {
    actionsDialog.show("confirm")
  }, [actionsDialog])

  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      <Link href={`/profile/${auth.currentUser?.uid}`}>
        <Button variant="outlined" className="w-full">
          {" "}
          Cancel{" "}
        </Button>
      </Link>
      <Button onClick={askConfirm} variant="outlined">
        {" "}
        Update{" "}
      </Button>
    </div>
  )
})

UpdateButtons.displayName = "UpdateButtons"

export default UpdateButtons
