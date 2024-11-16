const PublicChatLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="h-full p-4">
      {children}
    </div>
  );
};

PublicChatLayout.displayName = 'PublicChatLayout';

export default PublicChatLayout;