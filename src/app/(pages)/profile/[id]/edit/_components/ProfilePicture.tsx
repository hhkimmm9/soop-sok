import Image from 'next/image';
import { useCallback, ChangeEvent } from 'react';

interface ProfilePictureProps {
  photoURL: string | undefined;
  updateField: (field: string, value: any, isProfileField: boolean) => void;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ photoURL, updateField }) => {
  const handlePhotoURLChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    updateField('photoURL', e, false);
  }, [updateField]);

  return (
    <div className='flex justify-center'>
      <label htmlFor='profilePic' className='cursor-pointer'>
        <Image
          src={photoURL || '/images/default-avatar.png'}
          alt='Profile Picture'
          width={192}
          height={192}
          className='object-cover rounded-full'
        />
      </label>
      <input
        type='file'
        id='profilePic'
        onChange={handlePhotoURLChange}
        className='hidden'
      />
    </div>
  );
};

export default ProfilePicture;