"use client";

import { useCallback, ChangeEvent } from 'react';
import { TextField } from '@mui/material';

interface UsernameFieldProps {
  displayName: string | undefined;
  updateField: (field: string, value: any, isProfileField: boolean) => void;
};


const UsernameField = ({ displayName, updateField }: UsernameFieldProps) => {
  const handleDisplayNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    updateField('displayName', e.target.value, false);
  }, [updateField]);

  return (
    <div className='flex flex-col gap-2'>
      <TextField
        id='outlined-basic'
        label='Username'
        variant='outlined'
        value={displayName}
        onChange={handleDisplayNameChange}
      />
    </div>
  );
};

export default UsernameField;