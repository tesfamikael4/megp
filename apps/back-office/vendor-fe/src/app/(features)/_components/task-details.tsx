import { useGetVendorQuery } from '@/store/api/vendor_request_handler/new-registration-api';
import { GeneratePdf, Section } from '@megp/core-fe';
import { Button, Paper, Skeleton, Box, Flex, Grid, Text } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import FormPreview from '@/shared/review/review';

export default function TaskDetails({
  tracker,
  setContent,
  data,
}: {
  tracker: any;
  setContent: React.Dispatch<React.SetStateAction<'details' | 'tasks'>>;
  data: any;
}) {
  if (tracker.task.taskType === 'ISR') {
    return (
      <Section collapsible={false} title={'Completed Tasks'}>
        <Flex className="bg-gray-100 p-4 justify-between">
          <Text className="text-primary-900">{tracker.task.label}</Text>
          <Button
            onClick={() => {
              setContent('tasks');
            }}
          >
            Back
          </Button>
        </Flex>
        <FormPreview data={data} />
      </Section>
    );
  }

  if (tracker.task.taskType === 'Certificate') {
    return (
      <Section
        collapsible={false}
        title={'Completed Tasks'}
        action={
          <Button
            onClick={() => {
              setContent('tasks');
            }}
          >
            Back
          </Button>
        }
      >
        <GeneratePdf
          label="Cerficate"
          selector="#qr"
          templateUrl={`${process.env.NEXT_PUBLIC_VENDOR_DOMAIN}/certificate`}
          className=""
          mode="view"
          apiUrl={`${process.env.NEXT_PUBLIC_VENDOR_API}/api/`}
        />
      </Section>
    );
  }

  return (
    <Section
      collapsible={false}
      title={'Completed Tasks'}
      action={
        <Button
          onClick={() => {
            setContent('tasks');
          }}
        >
          Back
        </Button>
      }
    >
      <Box>
        <Text>{tracker.task.label}</Text>
        <Flex direction="column">
          <Grid className="mb-4">
            <Grid.Col span={6}>Action Taken</Grid.Col>
            <Grid.Col span={6}>{tracker.action}</Grid.Col>
          </Grid>
          <Grid className="mb-4">
            <Grid.Col span={6}>Remark</Grid.Col>
            <Grid.Col span={6}>{tracker.remark}</Grid.Col>
          </Grid>
          <Grid className="mb-4">
            <Grid.Col span={6}>Executed by</Grid.Col>
            <Grid.Col span={6}>{tracker.handlerName}</Grid.Col>
          </Grid>
          <Grid className="mb-4">
            <Grid.Col span={6}>Executed time</Grid.Col>
            <Grid.Col span={6}>{tracker.executedAt?.split('T')[0]}</Grid.Col>
          </Grid>
        </Flex>
      </Box>
    </Section>
  );
}
