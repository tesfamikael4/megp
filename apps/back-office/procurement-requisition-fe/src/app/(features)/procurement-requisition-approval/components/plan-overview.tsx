'use client';
import { useLazyListQuery } from '@/app/(features)/procurement-requisition/_api/procurement-requisition.api';
import { Section, logger } from '@megp/core-fe';
import { useEffect } from 'react';
import { DetailPr } from '../../_components/detail-requisition';
import { Accordion, Box, LoadingOverlay } from '@mantine/core';
import { ActivityMechanization } from './activity-mechanization';
import { Items } from './items';
import { Requisitioner } from './requisitioner';
import { Timeline } from './timeline';
import { Document } from './document';
import { useGetWorkflowInstanceQuery } from '@/store/api/workflow/workflow.api';

export function PlanOverview() {
  const [listById, { data: list, isLoading: isActivityLoading }] =
    useLazyListQuery();
  const {
    data: workflowInstance,
    isLoading: isWorkflowInstanceLoading,
    isSuccess: isWorkflowInstanceSuccess,
  } = useGetWorkflowInstanceQuery('0c659098-8a2c-4919-8be8-60cce7ee8f19');

  useEffect(() => {
    if (isWorkflowInstanceSuccess && workflowInstance) listById(undefined);
  }, [isWorkflowInstanceSuccess, listById, workflowInstance]);

  return (
    <Box pos="relative">
      <Section title={workflowInstance?.itemName ?? ''} collapsible={false}>
        <LoadingOverlay
          visible={isWorkflowInstanceLoading || isActivityLoading}
        />
        <Accordion variant="contained">
          {list?.items?.map((pr) => (
            <Accordion.Item key={pr.id} value={pr.id} className="bg-white">
              <Accordion.Control>{pr.title}</Accordion.Control>
              <Accordion.Panel>
                <>
                  <Accordion variant="contained" defaultValue="Definition">
                    <Accordion.Item value={'Definition'} className="bg-white">
                      <Accordion.Control>Definition</Accordion.Control>
                      <Accordion.Panel>
                        <DetailPr cell={pr} />
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value={'Method'} className="bg-white">
                      <Accordion.Control>Method</Accordion.Control>
                      <Accordion.Panel>
                        <ActivityMechanization prId={pr.id} />
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value={'Items'} className="bg-white">
                      <Accordion.Control>Items</Accordion.Control>
                      <Accordion.Panel>
                        <Items activityId={pr.id} />
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value={'Documents'} className="bg-white">
                      <Accordion.Control>Documents</Accordion.Control>
                      <Accordion.Panel>
                        <Document />
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value={'Timeline'} className="bg-white">
                      <Accordion.Control>Timeline</Accordion.Control>
                      <Accordion.Panel>
                        <Timeline activityId={pr.id} />
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value={'Budget'} className="bg-white">
                      <Accordion.Control>Budget</Accordion.Control>
                      <Accordion.Panel>
                        <ActivityMechanization prId={pr.id} />
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item
                      value={'Requisitioner'}
                      className="bg-white"
                    >
                      <Accordion.Control>Requisitioner</Accordion.Control>
                      <Accordion.Panel>
                        <Requisitioner activityId={pr.id} />
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                </>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Section>
    </Box>
  );
}
