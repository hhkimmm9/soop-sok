import MyProfile from './MyProfile';
import OthersProfile from './OthersProfile';

import { useState, useEffect } from 'react';

import { auth } from '@/db/firebase';

import { TUser } from '@/types';

type ProfileButtonGroupProps = {
  profile: TUser | null
};

const ProfileButtonGroup = ({ profile }: ProfileButtonGroupProps) => {
  const [isMyProfile, setIsMyProfile] = useState(false);

  useEffect(() => {
    if (auth.currentUser?.uid == profile?.uid)
      setIsMyProfile(true);
  }, [profile]);

  if (profile) return isMyProfile ?
    <MyProfile profileId={profile.uid} /> : <OthersProfile profile={profile} />;
};

export default ProfileButtonGroup;