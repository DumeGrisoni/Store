import React from 'react';

import prismadb from '@/lib/prismadb';
import CategoriesForm from '@/components/category-form';

const CategoryPage = async ({
  params,
}: {
  params: { categoryId: string; storeId: string };
}) => {
  const paramaters = await params;

  const category = await prismadb.category.findUnique({
    where: {
      id: paramaters.categoryId,
    },
  });

  const billboards = await prismadb.billBoard.findMany({
    where: {
      storeId: paramaters.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoriesForm initialData={category} billboards={billboards} />
      </div>
    </div>
  );
};

export default CategoryPage;
