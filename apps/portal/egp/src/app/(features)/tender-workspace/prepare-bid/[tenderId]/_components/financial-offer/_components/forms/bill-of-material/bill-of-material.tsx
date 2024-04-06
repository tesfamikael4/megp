'use client';
import { Section } from '@megp/core-fe';
import { BillOfMaterialTreeTable } from './bill-of-material-tree';
import { Item } from '@/models/tender/lot/item';
import { useGetBillOfMaterialQuery } from '@/app/(features)/vendor/_api/item.api';
export default function BillOfMaterial({ item }: { item: Item }) {
  const { data: billOfMaterial } = useGetBillOfMaterialQuery({
    itemId: item.id,
    collectionQuery: {
      where: [],
    },
  });
  return (
    <Section
      title="Bill Of Material"
      collapsible={true}
      defaultCollapsed={true}
    >
      <BillOfMaterialTreeTable
        boq={billOfMaterial ? billOfMaterial.items : []}
      />
    </Section>
  );
}
