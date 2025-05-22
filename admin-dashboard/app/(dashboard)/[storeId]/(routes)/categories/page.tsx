import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';

import prismadb from '@/lib/prismadb';
import { CategoryColumn } from './components/colomns';
import CategoryClient from './components/category-client';

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const paramsData = await params;
  const locale = fr;
  const categories = await prismadb.category.findMany({
    where: {
      storeId: paramsData.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formatedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, 'dd MMMM yyyy', { locale }).toUpperCase(),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formatedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
