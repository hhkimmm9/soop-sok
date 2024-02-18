'use client';

import { useState } from 'react'

import MainComponent from './MainComponent';
import ButtonsAtBottom from './ButtonsAtBottom';

const ChatWindow = () => {
  const [showFeatures, setShowFeatures] = useState(false);
  const [showCreatePage, setShowCreatePage] = useState(false);
  const [showAttendantsList, setShowAttendantsList] = useState(false);

  return (
    <div className='h-[82vh] grid grid-rows-12 gap-3'>
      <MainComponent
        showFeatures={showFeatures} setShowFeatures={setShowFeatures}
        showCreatePage={showCreatePage} setShowCreatePage={setShowCreatePage}
        showAttendantsList={showAttendantsList} setShowAttendantsList={setShowAttendantsList}
      />

      <ButtonsAtBottom 
        showFeatures={showFeatures} setShowFeatures={setShowFeatures}
        showCreatePage={showCreatePage} setShowCreatePage={setShowCreatePage}
        showAttendantsList={showAttendantsList} setShowAttendantsList={setShowAttendantsList}
      />
    </div>
  )
};

export default ChatWindow;