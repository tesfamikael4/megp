'use client';
import { useLazyListByIdQuery } from '../../../(app)/post-budget-plan/[budgetYear]/activities/_api/activities.api';
import { Section } from '@megp/core-fe';
import { useEffect } from 'react';
import { DetailActivity } from '../../../(app)/_components/detail-activity';
import { Accordion, Box, LoadingOverlay } from '@mantine/core';
import { Items } from './items';
import { Requisitioner } from './requisitioner';
import { Timeline } from './timeline';
import { Document } from './document';
import { Budget } from './budget';
import { useParams } from 'next/navigation';
import { useGetPostBudgetPlansQuery } from '@/store/api/post-budget-plan/post-budget-plan.api';

export function PlanOverview() {
  // const budgetYear = '0f241dbd-3aa9-40b9-9e27-8f8b644d8174';
  const { id } = useParams();
  const [listById, { data: list, isLoading: isActivityLoading }] =
    useLazyListByIdQuery();
  const { data: postBudgetPlan, isLoading: isPostBudgetPlanLoading } =
    useGetPostBudgetPlansQuery({
      where: [[{ column: 'id', value: id, operator: '=' }]],
    });

  useEffect(() => {
    listById({ id: id as string, collectionQuery: {} });
  }, [listById, id]);

  return (
    <Box pos="relative">
      <Section
        title={postBudgetPlan?.items?.[0].app.planName ?? ''}
        collapsible={false}
      >
        <LoadingOverlay
          visible={isPostBudgetPlanLoading || isActivityLoading}
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
                        <DetailActivity
                          activity={activity}
                          page="pre"
                          hideMethods
                        />
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item
                      value={'Procurement Methods'}
                      className="bg-white"
                    >
                      <Accordion.Control>Procurement Methods</Accordion.Control>
                      <Accordion.Panel>
                        <DetailActivity
                          activity={activity}
                          page="post"
                          hideActivity
                        />
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
                        <Document activityId={activity.id} />
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value={'Timeline'} className="bg-white">
                      <Accordion.Control>Timeline</Accordion.Control>
                      <Accordion.Panel>
                        <Timeline activityId={activity.id} />
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value={'Budget'} className="bg-white">
                      <Accordion.Control>Budget</Accordion.Control>
                      <Accordion.Panel>
                        <Budget activity={activity} postBudgetId={id} />
                      </Accordion.Panel>
                    </Accordion.Item>

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
