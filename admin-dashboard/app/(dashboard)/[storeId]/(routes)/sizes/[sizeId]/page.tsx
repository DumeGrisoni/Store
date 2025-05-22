import React from 'react';

import prismadb from '@/lib/prismadb';
import SizeForm from '@/components/size-form';

const SizePage = async ({ params }: { params: { sizeId: string } }) => {
  const parameters = await params;

  const sizes = await prismadb.size.findUnique({
    where: {
      id: parameters.sizeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={sizes} />
      </div>
    </div>
  );
};

export default SizePage;
