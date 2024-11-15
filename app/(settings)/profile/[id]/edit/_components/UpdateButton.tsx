import React, { useCallback } from 'react';
import Link from 'next/link';
import useDialogs from '@/functions/dispatcher';
import { auth } from '@/db/firebase';
import { Button } from '@mui/material';

const UpdateButtons: React.FC = React.memo(() => {
  const { actionsDialog } = useDialogs();

  const askConfirm = useCallback(() => { actionsDialog.show('confirm'); }, []);

  return (
    <div className='mt-4 grid grid-cols-2 gap-3'>
      <Link href={`/profile/${auth.currentUser?.uid}`}>
        <Button variant='outlined' className='w-full'> Cancel </Button>
      </Link>
      <Button onClick={askConfirm} variant='outlined'> Update </Button>
    </div>
  );
});

UpdateButtons.displayName = 'UpdateButtons';

export default UpdateButtons;