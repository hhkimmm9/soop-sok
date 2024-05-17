import NavBar from '@/components/NavBar';
import DialogWrapper from '@/components/dialogs/DialogWrapper';

// import dynamic from 'next/dynamic';

type WrapperProps = {
  children: React.ReactNode;
}

// const DialogWrapper = dynamic(() => import('@/components/dialogs/DialogWrapper'), { ssr: false });

const Wrapper = ({ children }: WrapperProps) => {
  return (<>
    {/* TODO: doesn't fit on iphones. */}
    <section className='
      relative min-w-80 w-screen max-w-[430px]
      min-h-[667px] h-screen mx-auto
      border border-black bg-white
    '>
      {/*  */}
      <main className='min-h-[calc(667px-3.5rem)] h-[calc(100vh-3.5rem)]'>
        { children }
      </main>
      <NavBar />
    </section>

    <DialogWrapper />
  </>)
};

export default Wrapper;