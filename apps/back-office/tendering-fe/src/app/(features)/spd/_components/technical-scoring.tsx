'use client';
import { Section } from '@megp/core-fe';
import { Box, Button, Divider, LoadingOverlay, Modal } from '@mantine/core';
import { IconX, IconPlus } from '@tabler/icons-react';
import { useLazyGetTechnicalScoringQuery } from '../_api/technical-scoring-tree.api';
import { useDisclosure } from '@mantine/hooks';
import { SpdTechnicalScoringFormDetail } from './technical-scoring-form-detail';
import { ScoringTable } from '../../_components/scoring-table';
import { useParams } from 'next/navigation';

export default function SpdTechnicalScoring() {
  const { id } = useParams();
  const [trigger, { data, isFetching }] = useLazyGetTechnicalScoringQuery({
    where: [],
  } as any);
  const [opened, { open, close }] = useDisclosure(false);
  const onRequestChange = (request: any) => {
    trigger({
      ...request,
      where: [
        [
          {
            column: 'spdId',
            value: id,
            operator: '=',
          },
        ],
      ],
    });
  };

  const onReturnFunction = () => {
    close();
    trigger({
      where: [
        [
          {
            column: 'spdId',
            value: id,
            operator: '=',
          },
        ],
      ],
    });
  };
  return (
    <Section
      title="Technical Scoring"
      collapsible={true}
      defaultCollapsed={true}
      action={
        <Button onClick={open}>
          <IconPlus size={14} /> Add
        </Button>
      }
    >
      <LoadingOverlay visible={isFetching} />
      <ScoringTable
        scoring={data ? data.items : []}
        onRequestChange={onRequestChange}
      />
      <Modal
        opened={opened}
        size={'xl'}
        onClose={close}
        withCloseButton={false}
      >
        <div className="flex justify-between">
          <h2 className="font-medium text-lg capitalize">Technical Scoring</h2>
          <IconX onClick={close} />
        </div>
        <Divider mt={'md'} mb={'md'} />
        <Box className="bg-white rounded shadow-sm ">
          <SpdTechnicalScoringFormDetail
            mode="new"
            returnFunction={onReturnFunction}
          />
        </Box>
      </Modal>
    </Section>
  );
}
