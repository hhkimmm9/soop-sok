"use client"

import { TextField } from "@mui/material"
import { ChangeEvent, useCallback } from "react"
import type { JSX } from "react"

interface UsernameFieldProps {
  displayName: string | undefined
  updateField: (field: string, value: any, isProfileField: boolean) => void
}

const UsernameField = (props: UsernameFieldProps): JSX.Element => {
  const handleDisplayNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      props.updateField("displayName", e.target.value, false)
    },
    [props],
  )

  return (
    <div className="flex flex-col gap-2">
      <TextField
        id="outlined-basic"
        label="Username"
        variant="outlined"
        value={props.displayName}
        onChange={handleDisplayNameChange}
      />
    </div>
  )
}

export default UsernameField
