import { UserButton } from '@clerk/nextjs';

const SetupPage = () => {
  return (
    <div className="p-4 bg-black h-screen  text-3xl">
      <UserButton afterSwitchSessionUrl="/" />
    </div>
  );
};

export default SetupPage;
