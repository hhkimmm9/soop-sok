import User from '@/app/(pages)/users/(components)/User';

const UserListPage = () => {
  var users = [
    {
      _id: '1',
      name: 'User 1',
    },
    {
      _id: '2',
      name: 'User 2',
    },
    {
      _id: '3',
      name: 'User 3',
    },
  ];
  
  return (
    <div className='flex flex-col gap-2'>
      { users.map((user: any) => (
        <User key={user.id} user={user} />
      )) }
    </div>
  )
};

export default UserListPage;