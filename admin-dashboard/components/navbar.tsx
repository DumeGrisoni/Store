import React from 'react';
import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import MainNav from './main-nav';
import StoreSwitcher from './store-switcher';
import prismadb from '@/lib/prismadb';

const Navbar = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <nav className="border-b ">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton
            afterSwitchSessionUrl="/"
            appearance={{ elements: { avatarBox: 'h-8 w-8' } }}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
