import React from 'react';

import prismadb from '@/lib/prismadb';
import ColorForm from '@/components/color-form';

const ColorPage = async ({ params }: { params: { colorId: string } }) => {
  const parameters = await params;

  const colors = await prismadb.color.findUnique({
    where: {
      id: parameters.colorId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={colors} />
      </div>
    </div>
  );
};

export default ColorPage;
