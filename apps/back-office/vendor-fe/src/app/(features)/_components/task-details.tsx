import { useGetVendorQuery } from '@/store/api/vendor_request_handler/new-registration-api';
import { GeneratePdf, Section } from '@megp/core-fe';
import { Button, Paper, Skeleton, Box, Flex, Grid } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import FormPreview from '@/shared/review/review';

export default function TaskDetails({
  tracker,
  setContent,
}: {
  tracker: any;
  setContent: React.Dispatch<React.SetStateAction<'details' | 'tasks'>>;
}) {
  const id = tracker.id as string;
  const [skip, setSkip] = useState(true);
  const { data: vendorInfo } = useGetVendorQuery({ id }, { skip: skip });

  useEffect(() => {
    if (tracker.task.taskType === 'ISR') {
      setSkip(false);
    }
  }, []);

  if (tracker.task.taskType === 'ISR' && vendorInfo == undefined) {
    return (
      <Paper className="p-5 w-full mt-4">
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={10} radius="xl" />
        <Skeleton height={8} mt={10} radius="xl" />
        <Skeleton height={8} mt={10} width="70%" radius="xl" />
      </Paper>
    );
  }

  if (tracker.task.taskType === 'ISR' && vendorInfo != undefined) {
    return (
      <Section
        collapsible={false}
        title={tracker.task.label}
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
        <FormPreview data={vendorInfo} />;
      </Section>
    );
  }

  if (tracker.task.taskType === 'Certificate') {
    return (
      <Section
        collapsible={false}
        title={tracker.task.label}
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
      title={tracker.task.label}
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
