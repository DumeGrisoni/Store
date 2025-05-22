'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type BillboardColumn = {
  id: string;
  label: string;
  createdAt: string;
};

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: 'label',
    header: 'Titre',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date de création',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
