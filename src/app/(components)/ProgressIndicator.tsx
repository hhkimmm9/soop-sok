import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import type { JSX } from "react"

const ProgressIndicator = (): JSX.Element => {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress color="primary" />
    </Box>
  )
}

export default ProgressIndicator
