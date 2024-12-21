"use client"

import { TextField } from "@mui/material"
import React, { ChangeEvent, useCallback } from "react"

interface IntroductionFieldProps {
  introduction: string | undefined
  updateField: (field: string, value: any, isProfileField: boolean) => void
}
const IntroductionField = React.memo(
  ({ introduction, updateField }: IntroductionFieldProps) => {
    const handleIntroductionChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        updateField("introduction", e.target.value, true)
      },
      [updateField],
    )

    return (
      <TextField
        id="outlined-basic"
        label="Introduction"
        variant="outlined"
        multiline
        maxRows={8}
        value={introduction || ""}
        onChange={handleIntroductionChange}
      />
    )
  },
)

IntroductionField.displayName = "IntroductionField"

export default IntroductionField
