'use client';

import ProgressIndicator from '@/components/ProgressIndicator';
import {
  TextField, Button,
} from '@mui/material';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/utils/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import {
  BackspaceIcon
} from '@heroicons/react/24/outline';

type pageProps = {
  params: {
    type: string,
    id: string,
  }
};

const Page = ({ params }: pageProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');
  const [tagOption, setTagOption] = useState('');
  const [tagOptions, setTagOptions] = useState<string[]>([]);

  const router = useRouter();

  const { state, dispatch } = useAppState();

  const addToList = () => {
    if (tagOptions.length < 5) {
      setTagOptions((prev) => {
        if (!prev.includes(tagOption)) {
          return [ ...prev, tagOption ];
        } else return [ ...prev ];
      });
    }
    else {
      // too many tag options
    }
  };

  const deleteFromList = (tagOption: string) => {
    if (auth && tagOptions.length > 0) {
      setTagOptions((prev) => prev.filter(option => option !== tagOption));
    }
  };

  const redirectToFeaturesPage = () => {
    if (auth) {
      router.push(`/chats/${params.type}/${params.id}/features`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (auth && auth.currentUser && content.length > 0) {
      try {
        const bannerRef = await addDoc(collection(db, 'banners'), {
          cid: params.id,
          content,
          createdAt: serverTimestamp(),
          selected: false,
          tagOptions,
        });

        if (bannerRef) {
          router.push(`/chats/public-chat/${params.id}`);
        }
      } catch (err) {
        console.error(err);
        dispatch({ type: 'SET_MESSAGE_DIALOG_TYPE', payload: 'general' });
        dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: true });
      }
    }
  };

  if (isLoading) return (
    <div className='h-full flex justify-center items-center'>
      <ProgressIndicator />
    </div>
  )
  else return (
    <form onSubmit={(e) => handleSubmit(e)} className='h-full flex flex-col gap-4'>
      <div className='
        grow p-4 overflow-y-auto rounded-lg bg-white
        flex flex-col gap-2
      '>
        {/* name */}
        <TextField id='outlined-basic' label='Banner' variant='outlined'
          value={content} onChange={(e) => setContent(e.target.value)}
        />

        {/* tag options */}
        <div className='flex flex-col gap-4'>
          <div className='mt-2 flex gap-2'>
            <TextField id='outlined-basic' label='Tag Option' variant='outlined'
              value={tagOption} onChange={(e) => setTagOption(e.target.value)}
              className='grow'
            />
            <Button variant='outlined' onClick={() => { addToList(); setTagOption(''); }}>
              Add
            </Button>
          </div>

          {/* container for tag options */}
          <div>
            <div className='min-h-14 p-3 border border-gray-300 rounded-sm'>
              <div className='flex flex-col items-start gap-3'>
                { tagOptions.map((tagOption, index) => (
                  <div key={tagOption} className='w-full flex items-center justify-between'>
                    <p className='whitespace-nowrap'>
                      { `${index+1}. ${tagOption}` }
                    </p>
                    <div onClick={() => deleteFromList(tagOption)}>
                      <BackspaceIcon className='h-5 text-gray-500' />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* instruction */}
            { tagOptions.length > 0 && (
              <p className='mt-2 px-1 text-gray-400 text-sm'>Other users would only be able to choose one of the avilable options</p>
            )}
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-2.5'>
        <button type='button' onClick={redirectToFeaturesPage} className='
          w-full py-4 rounded-lg shadow-sm bg-white
          transition duration-300 ease-in-out hover:bg-stone-200
        '> Cancel </button>

        <button type='submit' className='
          w-full py-4 rounded-lg shadow-sm bg-white
          transition duration-300 ease-in-out hover:bg-stone-200
        '> Create </button>
      </div>
    </form>
  );
};

export default Page;