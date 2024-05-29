import Link from 'next/link';

const MyProfile = ({ profileId }: { profileId: string }) => {
  return (
    <div className='w-full flex flex-col gap-8'>
      <Link href={`/profile/${profileId}/edit`}
        className='border rounded-lg py-2 block shadow-sm text-center bg-white'
      > Edit Profile </Link>
    </div>
  );
};

export default MyProfile;