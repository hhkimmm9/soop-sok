const FeaturesLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="h-full py-8">
      {children}
    </div>
  );
};

FeaturesLayout.displayName = 'FeaturesLayout';

export default FeaturesLayout;