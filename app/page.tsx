'use client';

import { useRouter } from 'next/navigation';
import { auth } from '@/app/lib/firebase/firebase';
import {
  useSignInWithGoogle,
  useSignInWithApple
} from 'react-firebase-hooks/auth';
import SignInWithGoogle from '@/app/components/(SignInWith)/SignInWithGoogle';

export default function Home() {
  const [signInWithGoogle, loadingGoogle, errorGoogle] = useSignInWithGoogle(auth);
  const [signInWithApple, loadingApple, errorApple] = useSignInWithApple(auth);

  const router = useRouter();

  const handleSignIn = async (signInWith: string) => {
    if (signInWith === 'google') {
      const result = await signInWithGoogle();

      if (!errorGoogle) {
        router.push('/channels');
      }
    }
  };

  return (
    <div className="pt-24 flex flex-col gap-64 items-center">
      <div className='text-center flex flex-col gap-4'>
        <h1 className='text-4xl'>Introverts</h1>
        <p className=''>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus laboriosam dolor maxime suscipit tempore corrupti odit. Assumenda molestias nostrum voluptatem?</p>
      </div>

      <div className='flex flex-col gap-4 text-center'>
        <div onClick={() => handleSignIn('google')}>
          <SignInWithGoogle />
        </div>
      </div>

    </div>
  );
}
