import React from 'react';

import prismadb from '@/lib/prismadb';
import BillboardsForm from '@/components/billboard-form';

const BillBoardPage = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  const billboardId = await params;

  const billboard = await prismadb.billBoard.findUnique({
    where: {
      id: billboardId.billboardId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardsForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillBoardPage;
