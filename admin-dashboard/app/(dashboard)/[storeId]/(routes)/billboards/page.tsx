import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';

import BillboardClient from '@/app/(dashboard)/[storeId]/(routes)/billboards/components/billboard-client';
import prismadb from '@/lib/prismadb';
import { BillboardColumn } from './components/colomns';

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const paramsData = await params;
  const locale = fr;
  const billboards = await prismadb.billBoard.findMany({
    where: {
      storeId: paramsData.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formatedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, 'dd MMMM yyyy', { locale }).toUpperCase(),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formatedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
