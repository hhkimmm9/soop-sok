'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

import ProfilePicture from '@/app/(settings)/profile/[id]/edit/_components/ProfilePicture';
import UsernameField from '@/app/(settings)/profile/[id]/edit/_components/UsernameField';
import IntroductionField from '@/app/(settings)/profile/[id]/edit/_components/IntroductionField';
import MBTISelect from '@/app/(settings)/profile/[id]/edit/_components/MBTISelector';
import UpdateButton from '@/app/(settings)/profile/[id]/edit/_components/UpdateButton';

import useDialogs from '@/functions/dispatcher';
import { useAppState } from '@/utils/AppStateProvider';
import { auth } from '@/db/firebase';
import { fetchUser, updateUserProfile } from '@/db/services';
import { TUser } from '@/types';


const ProfileEdit = () => {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<TUser | null>(null);

  const { state } = useAppState();
  const { actionsDialog, messageDialog } = useDialogs();

  useEffect(() => {
    const getUser = async () => {
      const currentUser = auth.currentUser;
  
      if (currentUser) {
        try {
          const user = await fetchUser(currentUser.uid);
  
          if (!user) {
            // Handle 404 not found
            router.push('/404');
            return;
          }
  
          setUser(user);
        } catch (err) {
          console.error(err);
          messageDialog.show('data_retrieval');
        }
      }
    };

    getUser();
  }, [messageDialog, router]);

  // Update user profile when the user confirms the action dialog.
  useEffect(() => {
    const handleUpdate =async () => {
      const currentUser = auth.currentUser;
  
      if (currentUser?.uid && user) {
        try {
          await updateUserProfile(currentUser.uid, user);
  
          router.push(`/profile/${id}`);
        } catch (err) {
          console.error(err);
          messageDialog.show('data_update');
        }
      }
    };

    if (state.actionsDialogResponse) {
      handleUpdate();
      actionsDialog.hide();
    } else {
      actionsDialog.hide();
    }
  }, [state.actionsDialogResponse, actionsDialog, id, messageDialog, router, user]);


  const updateField = useCallback((field: string, value: any, isProfileField = false) => {
    setUser((prev) => {
      if (!prev) return prev;
      if (isProfileField) {
        return {
          ...prev,
          profile: {
            ...prev.profile,
            [field]: value,
          },
        } as TUser;
      } else {
        return {
          ...prev,
          [field]: value,
        } as TUser;
      }
    });
  }, []);

  return (
    <div className='pt-10 flex flex-col gap-6'>
      <ProfilePicture
        photoURL={user?.photoURL}
        updateField={updateField}
      />
      <div className='flex flex-col gap-8'>
        <UsernameField
          displayName={user?.displayName}
          updateField={updateField}
        />
        <IntroductionField
          introduction={user?.profile.introduction}
          updateField={updateField}
        />
        <MBTISelect
          mbti={user?.profile.mbti}
          updateField={updateField}
        />
      </div>
      <UpdateButton />
    </div>
  );
};

ProfileEdit.displayName = 'ProfileEdit';

export default ProfileEdit;