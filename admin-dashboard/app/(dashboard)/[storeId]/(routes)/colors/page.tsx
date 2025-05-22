import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';

import prismadb from '@/lib/prismadb';
import { ColorColumn } from './components/colomns';
import ColorClient from './components/color-client';

const ColorsPage = async ({ params }: { params: { storeId: string } }) => {
  const paramsData = await params;
  const locale = fr;
  const colors = await prismadb.color.findMany({
    where: {
      storeId: paramsData.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formatedSizes: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'dd MMMM yyyy', { locale }).toUpperCase(),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient data={formatedSizes} />
      </div>
    </div>
  );
};

export default ColorsPage;
