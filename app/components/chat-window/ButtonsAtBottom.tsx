import { useState } from 'react';

import SearchBar from '../SearchBar';

const ButtonsAtBottom = ({
  showFeatures, setShowFeatures,
  showCreatePage, setShowCreatePage,
  showAttendantsList, setShowAttendantsList
} : {
  showFeatures: boolean, setShowFeatures: any,
  showCreatePage: boolean, setShowCreatePage: any,
  showAttendantsList: boolean, setShowAttendantsList: any
}) => {
  const [activateUserInput, setActivateUserInput] = useState(false);

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
          { !showCreatePage && !showAttendantsList && (
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

          { showAttendantsList && (
            <button onClick={() => setShowAttendantsList(false)}
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