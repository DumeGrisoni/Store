'use client';
import { Plus } from 'lucide-react';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';

import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BillboardColumn, columns } from './colomns';
import { DataTable } from '@/components/ui/data-table';

interface BillboardClientProps {
  data: BillboardColumn[];
}

const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Bandeaux (${data.length})`}
          description="Gestion des Bandeaux"
        />
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
      <DataTable columns={columns} data={data} />
    </>
  );
};

export default BillboardClient;
