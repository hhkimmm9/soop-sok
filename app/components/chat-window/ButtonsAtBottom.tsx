import React from 'react'

import SearchBar from '../SearchBar';

const ButtonsAtBottom = ({
  activateUserInput, setActivateUserInput,
  showFeatures, setShowFeatures,
  showCreatePage, setShowCreatePage,
  showAttendantList, setShowAttendantList,
  showFriendList, setShowFriendList,
} : {
  activateUserInput: boolean, setActivateUserInput: any,
  showFeatures: boolean, setShowFeatures: any,
  showCreatePage: boolean, setShowCreatePage: any,
  showAttendantList: boolean, setShowAttendantList: any,
  showFriendList: boolean, setShowFriendList: any,
}) => {
  return (
    // button(s) at bottom
    <div className='row-span-1'>
      { !showFeatures ? (
        <>
          { !activateUserInput ? (
            <div className='grid grid-cols-2 gap-2'>
              <button onClick={() => setActivateUserInput(true)}
                className='
                  bg-white
                  border
                  border-black
                  py-2
                  rounded-lg
                  shadow-sm
              '>메세지 보내기</button>
              <button onClick={() => setShowFeatures(true)}
                className='
                  bg-white
                  border
                  border-black
                  py-2
                  rounded-lg
                  shadow-sm
              '>기능 보기</button>
            </div>
          ) : (
            <SearchBar goBack={() => setActivateUserInput(false)} />
          )}
        </>
      ) : (
        <>
          { !showCreatePage && !showAttendantList && !showFriendList && (
            <button onClick={() => setShowFeatures(false)}
              className='
              w-full py-2 bg-white
              border border-black rounded-lg shadow-sm
            '>뒤로 가기</button>
          )}

          { showCreatePage && (
            <div className='grid grid-cols-2 gap-2.5'>
              <button onClick={() => {}}
                className='
                w-full py-2 bg-white
                border border-black rounded-lg shadow-sm
              '>만들기</button>
              <button onClick={() => setShowCreatePage(false)}
                className='
                w-full py-2 bg-white
                border border-black rounded-lg shadow-sm
              '>취소</button>
            </div>
          )}
          
          { showAttendantList && (
            <button onClick={() => setShowAttendantList(false)}
              className='
              w-full py-2 bg-white
              border border-black rounded-lg shadow-sm
            '>뒤로 가기</button>
          )}

          { showFriendList && (
            <button onClick={() => setShowFriendList(false)}
              className='
              w-full py-2 bg-white
              border border-black rounded-lg shadow-sm
            '>뒤로 가기</button>
          )}
        </>
      )}
    </div>
  )
}

export default ButtonsAtBottom