'use client';
import { Button, Divider, Flex, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ExpandableTable, Section, logger } from '@megp/core-fe';
import { CollectionQuery } from '@megp/entity';
import {
  IconCircleCheck,
  IconCircleX,
  IconPlus,
  IconX,
} from '@tabler/icons-react';
import React from 'react';
import SpdDocumentaryModal from './spd-documentary-modal';
import { useParams } from 'next/navigation';
import { useLazyListByIdQuery } from '../_api/spd-documentary-evidence.api';

export default function SpdDocumentaryEvidence() {
  const { id } = useParams();
  const [opened, { open, close }] = useDisclosure(false);
  const [trigger, { data, isFetching }] = useLazyListByIdQuery();
  const config = {
    columns: [
      {
        accessor: 'evidenceTitle',
        title: 'Evidence Title',
        sortable: true,
      },
      {
        accessor: 'evidenceType',
        title: 'Evidence Type',
        sortable: true,
      },
      {
        accessor: 'requiredTo',
        title: 'Required To',
        render: (evidence) => (
          <Text size="sm">
            {evidence.isRequired ? evidence.requiredTo : 'Not Required'}
          </Text>
        ),
      },
      {
        accessor: 'checkOnSecondOpening',
        header: 'Documentary Check',
        render: (evidence) => (
          <Flex direction="column" gap={'sm'}>
            <Flex gap={'sm'}>
              {evidence.checkOnFirstCompliance ? (
                <IconCircleCheck className="w-4" />
              ) : (
                <IconCircleX className="w-4" />
              )}
              <Text size="sm">Check On First Compliance</Text>
            </Flex>
            <Flex gap={'sm'}>
              {evidence.checkOnFirstOpening ? (
                <IconCircleCheck className="w-4" />
              ) : (
                <IconCircleX className="w-4" />
              )}
              <Text size="sm">Check On First Opening</Text>
            </Flex>
            <Flex gap={'sm'}>
              {evidence.checkOnSecondCompliance ? (
                <IconCircleCheck className="w-4" />
              ) : (
                <IconCircleX className="w-4" />
              )}
              <Text size="sm">Check On Second Compliance</Text>
            </Flex>
            <Flex gap={'sm'}>
              {evidence.checkOnSecondOpening ? (
                <IconCircleCheck className="w-4" />
              ) : (
                <IconCircleX className="w-4" />
              )}
              <Text size="sm">Check On Second Opening</Text>
            </Flex>
          </Flex>
        ),
      },
      {
        accessor: 'sectionLink',
        title: 'Section Link',
      },
    ],
    isExpandable: false,
    isSearchable: true,
    isLoading: isFetching,
    primaryColumn: 'evidenceTitle',
  };

  const onRequestChange = (request: CollectionQuery) => {
    logger.log(id.toString() ?? '');
    trigger({
      id: id.toString() ?? '',
      collectionQuery: {
        ...request,
      },
    });
  };

  const onReturnFunction = () => {
    close();
    trigger({
      id: id.toString() ?? '',
      collectionQuery: {},
    });
  };

  return (
    <Section
      title="SPD Documentary Evidence"
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
        data={data?.items ?? []}
        total={data?.total ?? 0}
        onRequestChange={onRequestChange}
      />

      <Modal
        opened={opened}
        size={'60%'}
        onClose={close}
        withCloseButton={false}
      >
        <div className="flex justify-between">
          <h2 className="font-medium text-lg capitalize">
            Create SPD Documentary Evidence
          </h2>
          <IconX onClick={close} />
        </div>
        <Divider mt={'md'} mb={'md'} />
        <SpdDocumentaryModal returnFunction={onReturnFunction} />
      </Modal>
    </Section>
  );
}
