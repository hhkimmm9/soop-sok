'use client';

import ProgressIndicator from '@/components/ProgressIndicator';
import MUIMessageDialog from '@/components/MUIMessageDialog';
import Channel from '@/app/(public-chat)/channels/Channel';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { auth, db } from '@/utils/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, orderBy } from 'firebase/firestore';

import { TChannel } from '@/types';
import {
  DATA_RETRIEVAL_TITLE, DATA_RETRIEVAL_CONTENT
} from '@/utils/messageTexts';

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [errorMessageTitle, setErrorMessageTitle] = useState('');
  const [errorMessageContent, setErrorMessageContent] = useState('');

  const [channels, setChannels] = useState<TChannel[]>([]);
  
  const router = useRouter();

  /* 2. The effect of useCollection is triggered whenever the collection changes
    or when the component mounts. */
  const [firestoreSnapshot, firestoreLoading, firestoreError] = useCollection(
    query(collection(db, 'channels'),
      orderBy('order', 'asc')
    ), {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  /* 1. When the component mounts for the first time, the first useEffect hook
    runs due to the empty dependency array. */
  useEffect(() => {
    if (!auth) {
      router.push('/');
      return;
    }
  }, [router]);

  useEffect(() => {
    if (firestoreError !== undefined) {
      setErrorMessageTitle(DATA_RETRIEVAL_TITLE);
      setErrorMessageContent(DATA_RETRIEVAL_CONTENT);
      setShowMessage(true);
    }
  }, [firestoreError]);

  /* 3. Once the firestoreSnapshot is updated with the data from Firestore,
    the second useEffect hook updates the state with the retrieved channels. */
  useEffect(() => {
    const container: TChannel[] = [];
    if (firestoreSnapshot && !firestoreSnapshot.empty) {
      firestoreSnapshot.forEach((doc) => {
        container.push({
          id: doc.id,
          ...doc.data()
        } as TChannel);
      });
      setChannels(container);
    }
    setIsLoading(false);
  }, [firestoreSnapshot]);

  if (isLoading) return (
    <div className='h-full flex justify-center items-center'>
      <ProgressIndicator />
    </div>
  )
  else return (<>
    <div className='h-full bg-stone-100'>
      <div className='flex flex-col gap-3'>
        { channels.map(channel => (
          <Channel key={channel.id} channel={channel} />  
        )) }
      </div>
    </div>

    <MUIMessageDialog
      show={showMessage}
      title={errorMessageTitle}
      message={errorMessageContent}
      handleClose={() => { setShowMessage(false) }}
    />
  </>);
};

export default Page;