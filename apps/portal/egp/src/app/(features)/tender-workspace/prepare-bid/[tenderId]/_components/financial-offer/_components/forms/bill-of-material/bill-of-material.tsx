'use client';
import { Section } from '@megp/core-fe';
import { BillOfMaterialTreeTable } from './bill-of-material-tree';
import { Item } from '@/models/tender/lot/item';
import { useGetBillOfMaterialQuery } from '@/app/(features)/tender-workspace/_api/item.api';
import { PrepareBidContext } from '@/contexts/prepare-bid.context';
import { useSearchParams } from 'next/navigation';
import { useContext } from 'react';

export default function BillOfMaterial({ item }: Readonly<{ item: Item }>) {
  const searchParams = useSearchParams();
  const prepareBidContext = useContext(PrepareBidContext);
  const { data: billOfMaterial } = useGetBillOfMaterialQuery({
    lotId: searchParams.get('lot'),
    itemId: item.id,
    documentType: 'RESPONSE',
    key: 'BillOfMaterial',
    isTree: true,
    password: prepareBidContext?.password,
  });
  return (
    <Section
      title="Bill Of Material"
      collapsible={true}
      defaultCollapsed={true}
    >
      <BillOfMaterialTreeTable
        boq={billOfMaterial ? billOfMaterial.items : []}
        itemId={item.id}
      />
    </Section>
  );
}
