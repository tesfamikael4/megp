'use client';
import { ExpandableTable } from '@/app/(features)/_components/expandable-table';
import { Section } from '@megp/core-fe';
import { Button, Modal } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useLazyListByIdQuery } from '@/app/(features)/preparation/_api/tender/classification.api';
import { useDisclosure } from '@mantine/hooks';
import ClassificationSelector from './classification-selector';
import { useParams } from 'next/navigation';

export default function Classification() {
  const { id } = useParams();
  const [trigger, { data, isFetching }] = useLazyListByIdQuery();
  const [opened, { open, close }] = useDisclosure(false);
  const config = {
    columns: [
      { accessor: 'code', title: 'Code', width: 150 },
      { accessor: 'definition', title: 'Definition', width: 150 },
      { accessor: 'type', title: 'Type', width: 150 },
    ],
    isExpandable: false,
    isSearchable: true,
    isLoading: isFetching,
    primaryColumn: 'name',
  };

  const onRequestChange = (request: any) => {
    trigger({ id: id.toString(), collectionQuery: request });
  };

  return (
    <Section
      title="Classification"
      collapsible={true}
      defaultCollapsed={true}
      action={
        <Button onClick={open}>
          <IconPlus size={14} /> Add
        </Button>
      }
    >
      <ExpandableTable
        config={config}
        data={data?.items[0]?.classification ?? []}
        total={data?.total ?? 0}
        onRequestChange={onRequestChange}
      />
      <Modal
        title="Select Classification"
        opened={opened}
        size={'80%'}
        onClose={close}
        withCloseButton={false}
      >
        <ClassificationSelector closeModal={close} />
      </Modal>
    </Section>
  );
}
