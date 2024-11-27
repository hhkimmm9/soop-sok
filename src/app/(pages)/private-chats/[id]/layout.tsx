const PrivateChatLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="p-4">
      {children}
    </div>
  );
};

PrivateChatLayout.displayName = 'PrivateChatLayout';

export default PrivateChatLayout;