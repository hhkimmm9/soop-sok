import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"

const ProgressIndicator = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress color="primary" />
    </Box>
  )
}

export default ProgressIndicator
