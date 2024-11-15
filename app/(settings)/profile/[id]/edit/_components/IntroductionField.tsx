"use client";

import React, { useCallback, ChangeEvent } from 'react';
import { TextField } from '@mui/material';

interface IntroductionFieldProps {
  introduction: string | undefined;
  updateField: (field: string, value: any, isProfileField: boolean) => void;
}
const IntroductionField: React.FC<IntroductionFieldProps> = React.memo(({ introduction, updateField }) => {
  const handleIntroductionChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    updateField('introduction', e.target.value, true);
  }, [updateField]);
  
  return (
    <TextField
      id='outlined-basic'
      label='Introduction'
      variant='outlined'
      multiline
      maxRows={8}
      value={introduction || ''}
      onChange={handleIntroductionChange}
    />
  );
});

IntroductionField.displayName = 'IntroductionField';

export default IntroductionField;