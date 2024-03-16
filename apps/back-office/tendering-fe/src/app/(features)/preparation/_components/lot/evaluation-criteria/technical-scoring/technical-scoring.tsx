'use client';
import { Section } from '@megp/core-fe';
import { Box, Button, Divider, Modal } from '@mantine/core';
import { IconX, IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { TechnicalScoringFormDetail } from './technical-scoring-form-detail';
import { ScoringTable } from './scoring-table';
import { useListByIdQuery } from '@/app/(features)/preparation/_api/lot/technical-scoring.api';

export default function TechnicalScoring({ lotId }: { lotId: string }) {
  const { data: technicalScoring } = useListByIdQuery({
    id: lotId,
    collectionQuery: { where: [] },
  });
  const [opened, { open, close }] = useDisclosure(false);
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
      <ScoringTable
        scoring={technicalScoring ? technicalScoring.items : []}
        lotId={lotId}
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
          <TechnicalScoringFormDetail mode="new" lotId={lotId} />
        </Box>
      </Modal>
    </Section>
  );
}
