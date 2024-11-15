import React, { useCallback } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';

const MBTIOptions = [
  { value: 'istj', label: 'ISTJ' },
  { value: 'isfj', label: 'ISFJ' },
  { value: 'infj', label: 'INFJ' },
  { value: 'intj', label: 'INTJ' },
  { value: 'istp', label: 'ISTP' },
  { value: 'isfp', label: 'ISFP' },
  { value: 'infp', label: 'INFP' },
  { value: 'intp', label: 'INTP' },
  { value: 'estp', label: 'ESTP' },
  { value: 'esfp', label: 'ESFP' },
  { value: 'enfp', label: 'ENFP' },
  { value: 'entp', label: 'ENTP' },
  { value: 'estj', label: 'ESTJ' },
  { value: 'esfj', label: 'ESFJ' },
  { value: 'enfj', label: 'ENFJ' },
  { value: 'entj', label: 'ENTJ' }
];

interface MBTISelectProps {
  mbti: string | undefined;
  updateField: (field: string, value: any, isProfileField: boolean) => void;
}

const MBTISelect: React.FC<MBTISelectProps> = React.memo(({ mbti, updateField }) => {
  const handleMBTIChange = useCallback((e: SelectChangeEvent<string>) => {
    updateField('mbti', e.target.value as string, true);
  }, [updateField]);

  return (
    <div className='flex flex-col gap-2'>
      <FormControl fullWidth>
        <InputLabel id='mbti-select-label'>MBTI</InputLabel>
        <Select
          labelId='mbti-select-label'
          id='mbti-select'
          label='MBTI'
          value={mbti || ''}
          onChange={handleMBTIChange}
        >
          {MBTIOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
});

MBTISelect.displayName = 'MBTISelect';

export default MBTISelect;
