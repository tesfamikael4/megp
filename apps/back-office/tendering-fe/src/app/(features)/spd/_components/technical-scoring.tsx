'use client';
import { Section } from '@megp/core-fe';
import { Box, Button, Divider, Modal } from '@mantine/core';
import { IconX, IconPlus } from '@tabler/icons-react';
import { useGetTechnicalScoringQuery } from '../_api/technical-scoring-tree.api';
import { useDisclosure } from '@mantine/hooks';
import { SpdTechnicalScoringFormDetail } from './technical-scoring-form-detail';
import { ScoringTable } from '../../_components/scoring-table';

export default function SpdTechnicalScoring() {
  const { data: technicalScoring } = useGetTechnicalScoringQuery({
    where: [],
  } as any);
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
      <ScoringTable scoring={technicalScoring ? technicalScoring.items : []} />
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
          <SpdTechnicalScoringFormDetail mode="new" />
        </Box>
      </Modal>
    </Section>
  );
}
