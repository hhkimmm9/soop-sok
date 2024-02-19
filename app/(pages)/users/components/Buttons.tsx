'use client';

import Link from 'next/link';

const Buttons = ({
  yourself
} : {
  yourself: boolean
}) => {

  const addUserToFriendList = async () => {
    console.log('addUserToFriendList');
  };

  return (
    <>
      { yourself ? (
        <div className='w-72 flex flex-col gap-8'>
          <Link href={`/users/${`test`}/profile/edit`}
            className='
              border
              py-3
              rounded-lg
              text-center
          '>프로필 수정</Link>

          <Link href='#'
            className='
              border
              py-3
              rounded-lg
              text-center
          '>something else</Link>
        </div>
      ) : (
        <div className='w-72 flex flex-col gap-8'>
          <button  type='button'
            onClick={addUserToFriendList}
            className='
              border
              py-3
              rounded-lg
              text-center
          '>친구 추가</button>

          <Link href='/direct-messages'
            className='
              border
              py-3
              rounded-lg
              text-center
          '>DM 보내기</Link>
        </div>
      )}
    </>
  )
};

export default Buttons;