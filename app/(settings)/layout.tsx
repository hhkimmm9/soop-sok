const SettingsLayout = ({
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

SettingsLayout.displayName = 'SettingsLayout';

export default SettingsLayout;