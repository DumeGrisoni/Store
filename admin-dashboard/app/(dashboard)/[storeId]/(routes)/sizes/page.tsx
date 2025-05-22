import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';

import prismadb from '@/lib/prismadb';
import { SizeColumn } from './components/colomns';
import SizeClient from './components/size-client';

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  const paramsData = await params;
  const locale = fr;
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: paramsData.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formatedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'dd MMMM yyyy', { locale }).toUpperCase(),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={formatedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
