import Image from 'next/image';
import { TUser } from '@/types';

type ProfileHeaderProps = {
  children: any,
  profile: TUser | null
};

const ProfileHeader = ({ children, profile }: ProfileHeaderProps) => {
  if (profile) return (
    <div className='pt-10 flex flex-col gap-4'>
      {/* pic and name */}
      <div className='w-full grid grid-cols-4'>
        <div className='pl-2'>
          <Image
            src={profile.photoURL}
            alt=''
            width={128}
            height={128}
            className={`
              cols-span-1 object-cover rounded-full
            `}
          />
        </div>

        <div className='cols-span-3 pl-6 flex flex-col gap-3'>
          <p className='mx-auto font-medium text-3xl whitespace-nowrap'>
            { profile.displayName }
          </p>

          <p className='
            px-2 py-1 rounded-full bg-purple-300
            font-medium text-center uppercase text-white
          '>
            { profile.profile.mbti }
          </p>
        </div>
      </div>

      { children }

      {/* introduction */}
      <div className='h-52 p-4 border rounded-lg overflow-y-auto bg-white'>
        <p>{ profile.profile.introduction }</p>
      </div>
    </div>
  );
};

export default ProfileHeader;