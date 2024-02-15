import Banner from '@/app/components/Banner';
import InteractionArea from '@/app/components/InteractionArea';
import Chat from '@/app/(pages)/chat/components/Chat';

import { IChat } from '@/app/interfaces';

const page = () => {
  var chats = ([
    {
      _id: '1',
      title: '이번달에는 취뽀할 수 있을까요. 빚만 쌓어가는데',
      topic: '취업',
      capacity: 3,
      occupiedBy: 2,
      createdAt: 7
    },
    {
      _id: '2',
      title: '부트캠프 출신인데 이번에 드디어 취직햇어',
      topic: '성공',
      capacity: 3,
      occupiedBy: 2,
      createdAt: 13
    },
    {
      _id: '3',
      title: '이 상황에 이직하는게 맞는가 싶다. 어떻게 해야할지 잘 모르겟어',
      topic: '이직',
      capacity: 3,
      occupiedBy: 2,
      createdAt: 3
    },
    {
      _id: '4',
      title: 'ㅅㅂ 개발 안하련다',
      topic: '포기',
      capacity: 3,
      occupiedBy: 2,
      createdAt: 1
    }
  ]);

  return (
    <div className='
      w-screen min-h-screen my-12 px-4
      flex flex-col gap-3
    '>
      <Banner />

      <InteractionArea />

      {/* chat list */}
      <div className='flex flex-col gap-2'>
        { chats.map((chat: IChat) => (
          <Chat key={chat._id} chat={chat} />
        ))}
      </div>
    </div>
  )
};

export default page;