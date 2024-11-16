const PublicChatLayout = ({
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

PublicChatLayout.displayName = 'PublicChatLayout';

export default PublicChatLayout;