const ChatLayout = ({
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

ChatLayout.displayName = 'ChatLayout';

export default ChatLayout;