"use client";

import ProgressIndicator from "@/components/ProgressIndicator";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { auth, db } from "@/utils/firebase";
import {
  collection, doc, query, where,
  getDocs, deleteDoc
} from "firebase/firestore";

import {
  PlusIcon,
  MegaphoneIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  UsersIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";

type pageProps = {
  params: {
    type: string,
    id: string
  }
}

type TFeatures = (
  | "create-chat"
  | "add-banner"
  | "chat-list"
  | "user-list"
  | "cancel"
);

const Page = ({ params }: pageProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const redirectTo = (feature: TFeatures) => {
    if (auth) {
      feature == "cancel" ?
        router.push(`/chats/${params.type}/${params.id}`) :
        router.push(`/chats/${params.type}/${params.id}/${feature}`);
    }
  };

  const leaveChat = async () => {
    if (auth) {
      try {
        // Find the document id
        const statusRef = query(collection(db, 'status_board'),
          where('cid', '==', params.id),
          where('uid', '==', auth.currentUser?.uid)
        );
        const statusSnapshot = await getDocs(statusRef);
  
        // If found, delete that document.
        if (!statusSnapshot.empty) {
          const deleteRef = doc(db, 'status_board', statusSnapshot.docs[0].id);
          await deleteDoc(deleteRef);
  
          // If you were in a chat, leave the chat.
          if (params.type == "room-chat") {
            router.push(`chats/channel-chat/${params.id}`);
          }
          // If you were in a channel, leave the channel.
          else {
            router.push("/channels");
          }
        }
      } catch(error) {
        console.error('An error occurred:', error);
      }
    }
  };

  if (isLoading) return (
    <div className='h-full flex justify-center items-center'>
      <ProgressIndicator />
    </div>
  )
  else return (
    <div className='h-full flex flex-col gap-4'>
      <div className="grow p-4 rounded-lg overflow-y-auto bg-white">
        <div className='flex flex-col gap-4'>
          { params.type === "public-chat" && (
            <>
              <div onClick={() => redirectTo('create-chat')}
                className="
                  py-6 rounded-lg bg-stone-100
                  transition duration-300 ease-in-out hover:bg-stone-200
                  flex justify-center"
              > <PlusIcon className='h-8' /> </div>
    
              <div onClick={() => redirectTo('add-banner')}
                className="
                  py-6 rounded-lg bg-stone-100
                  transition duration-300 ease-in-out hover:bg-stone-200
                  flex justify-center"
              > <MegaphoneIcon className='h-8' /> </div>
    
              <div onClick={() => redirectTo('chat-list')}
                className="
                  py-6 rounded-lg bg-stone-100
                  transition duration-300 ease-in-out hover:bg-stone-200
                  flex justify-center"
              > <ChatBubbleOvalLeftEllipsisIcon className='h-8' /> </div>
            </>
          )}

          <div onClick={() => redirectTo('user-list')}
            className="
              py-6 rounded-lg bg-stone-100
              transition duration-300 ease-in-out hover:bg-stone-200
              flex justify-center"
          > <UsersIcon className='h-8' /> </div>

          { params.type === "public-chat" && (  
            <div onClick={leaveChat}
              className="
                py-6 rounded-lg bg-stone-100
                transition duration-300 ease-in-out hover:bg-stone-200
                flex justify-center"
            > <ArrowLeftStartOnRectangleIcon className='h-8' /> </div>
          )}
        </div>

      </div>

      <button type="button" onClick={() => redirectTo("cancel")}
        className="
          w-full py-4 rounded-lg shadow-sm bg-white
          hover:bg-stone-200 transition duration-300 ease-in-out
        "
      > Cancel </button>
    </div>
  );
};

export default Page;