'use client';
import React from 'react';

import Heading from './ui/heading';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { Separator } from './ui/separator';
import { useParams, useRouter } from 'next/navigation';

const BillboardClient = () => {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Panneaux (0)" description="Gestion des panneaux" />
        <Button
          onClick={() => {
            router.push(`/${params.storeId}/billboards/new`);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </div>
      <Separator />
    </>
  );
};

export default BillboardClient;
