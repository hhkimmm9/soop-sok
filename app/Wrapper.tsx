import NavBar from '@/components/NavBar';

type WrapperProps = {
  children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  return (
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
  )
};

export default Wrapper;