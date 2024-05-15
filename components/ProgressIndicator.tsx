import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const ProgressIndicator = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress color="primary" />
    </Box>
  )
};

export default ProgressIndicator;