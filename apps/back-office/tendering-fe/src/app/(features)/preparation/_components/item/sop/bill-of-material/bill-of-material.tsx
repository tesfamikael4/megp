'use client';
import { Section, logger, notify } from '@megp/core-fe';
import { Box, Button, Divider, Modal } from '@mantine/core';
import { IconX, IconPlus, IconDeviceFloppy } from '@tabler/icons-react';
import { useGetBillOfMaterialQuery } from '../../../../_api/item/bill-of-material-tree.api';
import { useDisclosure } from '@mantine/hooks';
import { BillOfMaterialFormDetail } from './bill-of-material-form-detail';
import { BillOfMaterialTreeTable } from './bill-of-material-tree';
import { Item } from '@/models/tender/lot/item';
import DataImport from './data-import';
import { useState } from 'react';
import { useSaveBoqMutation } from '@/app/(features)/preparation/_api/item/bill-of-material-bulk-create.api';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
export default function BillOfMaterial({ item }: { item: Item }) {
  const router = useRouter();
  const { itemId } = useParams();
  const { data: billOfMaterial } = useGetBillOfMaterialQuery({
    itemId: itemId,
    collectionQuery: {
      where: [],
    },
  });
  const [saveBoq, { isLoading: isBulkSaving }] = useSaveBoqMutation();
  const [opened, { open, close }] = useDisclosure(false);
  const [boq, setBoq] = useState(null);
  const onBulkSave = async () => {
    try {
      const toApiBoq: any[] = [...(boq ?? [])];
      await saveBoq({
        boqs: toApiBoq.map((boq) => {
          boq['itemId'] = itemId;
          boq['unit'] = boq.unit ? boq.unit : '';
          boq['quantity'] = boq.quantity ? boq.quantity : 1;
          delete boq.id;

          return boq;
        }),
        itemId: itemId,
      });
      notify('Success', 'bulk bill of material saved successfully');
    } catch {
      notify('Error', 'Error in deleting bulk boq');
    }
  };
  const onReturnFunction = () => {
    close();
    router.refresh();
  };
  return (
    <Section
      title="Bill Of Material"
      collapsible={true}
      defaultCollapsed={true}
      action={
        <>
          <DataImport
            onDone={(event) => {
              logger.log(event);
              setBoq(event);
            }}
          />

          <Button onClick={open}>
            <IconPlus size={14} /> Add
          </Button>
        </>
      }
    >
      {boq && (
        <Box className="flex justify-end">
          <Button onClick={onBulkSave} loading={isBulkSaving}>
            <IconDeviceFloppy size={14} /> Save
          </Button>
        </Box>
      )}
      <BillOfMaterialTreeTable
        boq={boq ? boq : billOfMaterial ? billOfMaterial.items : []}
      />
      <Modal
        opened={opened}
        size={'xl'}
        onClose={close}
        withCloseButton={false}
      >
        <div className="flex justify-between">
          <h2 className="font-medium text-lg capitalize">Document</h2>
          <IconX onClick={close} />
        </div>
        <Divider mt={'md'} mb={'md'} />
        <Box className="bg-white rounded shadow-sm ">
          <BillOfMaterialFormDetail
            mode="new"
            returnFunction={onReturnFunction}
          />
        </Box>
      </Modal>
    </Section>
  );
}
