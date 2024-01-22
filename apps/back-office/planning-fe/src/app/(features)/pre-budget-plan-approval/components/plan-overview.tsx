'use client';
import { useLazyListByIdQuery } from '../../pre-budget-plan/[budgetYear]/activities/_api/activities.api';
import { Section } from '@megp/core-fe';
import { useEffect } from 'react';
import { DetailActivity } from '../../_components/detail-activity';
import { Accordion, Box, LoadingOverlay } from '@mantine/core';
import { ActivityMechanization } from './activity-mechanization';
import { Items } from './items';
import { Requisitioner } from './requisitioner';
import { Timeline } from './timeline';
import { Document } from './document';
import { useGetWorkflowInstanceQuery } from '@/store/api/workflow/workflow.api';

export function PlanOverview() {
  // const budgetYear = '0f241dbd-3aa9-40b9-9e27-8f8b644d8174';
  const [listById, { data: list, isLoading: isActivityLoading }] =
    useLazyListByIdQuery();
  const {
    data: workflowInstance,
    isLoading: isWorkflowInstanceLoading,
    isSuccess: isWorkflowInstanceSuccess,
  } = useGetWorkflowInstanceQuery('1f344819-d64d-4986-b192-ee06f5bf0e98');

  useEffect(() => {
    if (isWorkflowInstanceSuccess && workflowInstance)
      listById({ id: workflowInstance.itemId, collectionQuery: {} });
  }, [isWorkflowInstanceSuccess, listById, workflowInstance]);

  return (
    <Box pos="relative">
      <Section title={workflowInstance?.itemName ?? ''} collapsible={false}>
        <LoadingOverlay
          visible={isWorkflowInstanceLoading || isActivityLoading}
        />
        <Accordion variant="contained">
          {list?.items?.map((activity) => (
            <Accordion.Item
              key={activity.id}
              value={activity.id}
              className="bg-white"
            >
              <Accordion.Control>
                <p className="font-semibold">{activity.name}</p>
              </Accordion.Control>
              <Accordion.Panel>
                <>
                  <Accordion variant="contained" defaultValue="Identification">
                    <Accordion.Item
                      value={'Identification'}
                      className="bg-white"
                    >
                      <Accordion.Control>Identification</Accordion.Control>
                      <Accordion.Panel>
                        <DetailActivity activity={activity} page="pre" />
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item
                      value={'Procurement Methods'}
                      className="bg-white"
                    >
                      <Accordion.Control>Procurement Methods</Accordion.Control>
                      <Accordion.Panel>
                        <ActivityMechanization activityId={activity.id} />
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value={'Items'} className="bg-white">
                      <Accordion.Control>Items</Accordion.Control>
                      <Accordion.Panel>
                        <Items activityId={activity.id} />
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
                        <Timeline activityId={activity.id} />
                      </Accordion.Panel>
                    </Accordion.Item>

                    {/* <Accordion.Item value={'Budget'} className="bg-white">
                      <Accordion.Control>Budget</Accordion.Control>
                      <Accordion.Panel>
                        <ActivityMechanization activityId={activity.id} />
                      </Accordion.Panel>
                    </Accordion.Item> */}

                    <Accordion.Item
                      value={'Requisitioner'}
                      className="bg-white"
                    >
                      <Accordion.Control>Requisitioner</Accordion.Control>
                      <Accordion.Panel>
                        <Requisitioner activityId={activity.id} />
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
