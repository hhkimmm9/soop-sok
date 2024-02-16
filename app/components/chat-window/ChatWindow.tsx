'use client';

import { useState } from 'react'

import MainComponent from './MainComponent';
import ButtonsAtBottom from './ButtonsAtBottom';

const ChatWindow = () => {
  const [activateUserInput, setActivateUserInput] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showCreatePage, setShowCreatePage] = useState(false);
  const [showAttendantList, setShowAttendantList] = useState(false);
  const [showFriendList, setShowFriendList] = useState(false);

  return (
    <div className='h-5/6 grow grid grid-rows-12 gap-3'>
      <MainComponent
        activateUserInput={activateUserInput} setActivateUserInput={setActivateUserInput}
        showFeatures={showFeatures} setShowFeatures={setShowFeatures}
        showCreatePage={showCreatePage} setShowCreatePage={setShowCreatePage}
        showAttendantList={showAttendantList} setShowAttendantList={setShowAttendantList}
        showFriendList={showFriendList} setShowFriendList={setShowFriendList}
      />

      <ButtonsAtBottom 
        activateUserInput={activateUserInput} setActivateUserInput={setActivateUserInput}
        showFeatures={showFeatures} setShowFeatures={setShowFeatures}
        showCreatePage={showCreatePage} setShowCreatePage={setShowCreatePage}
        showAttendantList={showAttendantList} setShowAttendantList={setShowAttendantList}
        showFriendList={showFriendList} setShowFriendList={setShowFriendList}
      />
    </div>
  )
};

export default ChatWindow;