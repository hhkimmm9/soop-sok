'use client';

import { useState } from 'react'

import MainComponent from './MainComponent';
import ButtonsAtBottom from './ButtonsAtBottom';

const ChatWindow = () => {
  const [activateUserInput, setActivateUserInput] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showCreatePage, setShowCreatePage] = useState(false);
  const [showAttendantsList, setShowAttendantsList] = useState(false);

  return (
    <div className='h-[82vh] grid grid-rows-12 gap-3'>
      <MainComponent
        activateUserInput={activateUserInput} setActivateUserInput={setActivateUserInput}
        showFeatures={showFeatures} setShowFeatures={setShowFeatures}
        showCreatePage={showCreatePage} setShowCreatePage={setShowCreatePage}
        showAttendantsList={showAttendantsList} setShowAttendantsList={setShowAttendantsList}
      />

      <ButtonsAtBottom 
        activateUserInput={activateUserInput} setActivateUserInput={setActivateUserInput}
        showFeatures={showFeatures} setShowFeatures={setShowFeatures}
        showCreatePage={showCreatePage} setShowCreatePage={setShowCreatePage}
        showAttendantsList={showAttendantsList} setShowAttendantsList={setShowAttendantsList}
      />
    </div>
  )
};

export default ChatWindow;