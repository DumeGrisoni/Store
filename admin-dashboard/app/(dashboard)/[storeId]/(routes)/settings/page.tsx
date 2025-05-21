import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

import prismadb from '@/lib/prismadb';
import SettingsForm from '@/components/settings-form';

interface SettingsPageProps {
  params: { storeId: string };
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
  const { userId } = await auth();
  const storeId = await params;

  if (!userId) {
    redirect('/sign-in');
  }

  if (!storeId) {
    redirect('/');
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: storeId.storeId,
      userId,
    },
  });

  if (!store) {
    redirect('/');
  }

  return (
    <div className="flex-col flex">
      <div className="flex flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingsPage;
