// TODO: Leverage SSR.
'use client';

import Channels from '@/components/channels/Channels';
import PrivateChats from '@/components/private-chats/PrivateChats';
import NavBar from "@/components/NavBar";

import { useAppState } from '@/utils/AppStateProvider';

type WrapperProps = {
  children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  const { state } = useAppState();

  const renderComponent = () => {
    switch (state.currentPage) {
      case 'channel':
        // TODO: change the URL
        return <Channels />;
        
      case 'private_chat':
        // TODO: change the URL
        return <PrivateChats />;
  
      case 'pages':
        return children;
  
      default:
        return null;
    }
  }

  return (
    <section className="
      relative min-w-80 w-screen max-w-[430px]
      min-h-[667px] h-screen mx-auto
      border border-black bg-white
    ">
      {/*  */}
      <main className='min-h-[calc(667px-3.5rem)] h-[calc(100vh-3.5rem)]'>
        { renderComponent() }
      </main>
      <NavBar />
    </section>
  )
};

export default Wrapper;