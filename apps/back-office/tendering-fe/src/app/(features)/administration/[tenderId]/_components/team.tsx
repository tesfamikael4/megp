'use client';
import {
  ExpandableTable,
  ExpandableTableConfig,
  Section,
  notify,
} from '@megp/core-fe';
import { Button, Group, Modal, Select, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ZodType, z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateTeamMutation,
  useLazyGetTeamsByLotIdQuery,
} from '@/store/api/tendering/tendering.api';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { TeamTypeEnum } from '../../_constatnts/enums';
import { Members } from './members';

const teamSchema: ZodType<any> = z.object({
  teamType: z.string({
    required_error: 'Team Type  is required',
  }),

  memberLimit: z
    .string({
      required_error: 'Member Limit is required',
    })
    .min(1, 'Member Limit is required'),
  envelopeType: z.string().default('single envelop'),
});

export const Team = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { lotId } = useParams();
  const config: ExpandableTableConfig = {
    isExpandable: true,
    expandedRowContent: (record, collapse) => (
      <Members team={record} collapse={collapse} />
    ),
    columns: [
      {
        accessor: 'teamType',
        render: (record) => {
          return TeamTypeEnum[record.teamType];
        },
      },
    ],
  };

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(teamSchema),
  });

  //rtk
  const [createTeam, { isLoading }] = useCreateTeamMutation();
  const [getTeams, { data }] = useLazyGetTeamsByLotIdQuery();

  const onCreate = async (data: any) => {
    try {
      await createTeam({ ...data, lotId }).unwrap();
      notify('Success', 'Team created successfully');
      close();
    } catch (err) {
      notify('Error', 'Something went wrong');
    }
  };

  useEffect(() => {
    getTeams(lotId as string);
  }, [lotId]);
  return (
    <>
      <Section
        title="Teams"
        className="mt-2"
        action={<Button onClick={open}>Add</Button>}
        defaultCollapsed={false}
      >
        <ExpandableTable data={data?.items ?? []} config={config} />
      </Section>

      <Modal opened={opened} onClose={close} title="Create Team">
        <Controller
          name="teamType"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              data={[
                { label: 'Technical Opening Team', value: 'TECHNICAL_OPENER' },
                {
                  label: 'Technical Evaluation Team',
                  value: 'TECHNICAL_EVALUATOR',
                },
                { label: 'Financial Opening Team', value: 'FINANCIAL_OPENER' },
                {
                  label: 'Financial Evaluation Team',
                  value: 'FINANCIAL_EVALUATOR',
                },
              ]}
              label="Type"
              error={errors.teamType?.message?.toString()}
              withAsterisk
            />
          )}
        />
        <TextInput
          label="Member Limit"
          type="number"
          {...register('memberLimit')}
          error={errors.memberLimit?.message?.toString()}
          withAsterisk
        />
        <Group className="mt-2" justify="end">
          <Button onClick={handleSubmit(onCreate)} loading={isLoading}>
            Create
          </Button>
        </Group>
      </Modal>
    </>
  );
};
