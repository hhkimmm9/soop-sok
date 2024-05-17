// TODO: this shouldn't be a client component.
'use client';

import NavBar from '@/components/NavBar';
import MUIActionsDialog from '@/components/MUIActionsDialog';
import MUIMessageDialog from '@/components/MUIMessageDialog';

import { useAppState } from '@/utils/AppStateProvider';

type WrapperProps = {
  children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  const { state, dispatch } = useAppState();

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

    <MUIMessageDialog
      show={state.showMessageDialog}
      handleClose={() => { dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: false }) }}
      type={state.messageDialogType}
    />

    <MUIActionsDialog
      show={state.showActionsDialog}
      handleClose={() => { dispatch({ type: 'SHOW_ACTIONS_DIALOG', payload: false }) }}
      type={state.actionsDialogType}
    />
  </>)
};

export default Wrapper;