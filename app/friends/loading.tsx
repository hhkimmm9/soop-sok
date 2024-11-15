import ProgressIndicator from '@/components/ProgressIndicator';

const FriendsPageLoading = () => {
  return (
    <div className='h-full flex justify-center items-center'>
      <ProgressIndicator />
    </div>
  );
};

FriendsPageLoading.displayName = 'FriendsPageLoading';

export default FriendsPageLoading;