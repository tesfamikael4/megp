'use client';
import { useLazyListByIdQuery } from '../../../(app)/pre-budget-plan/[budgetYear]/activities/_api/activities.api';
import { Section } from '@megp/core-fe';
import { useEffect } from 'react';
import { DetailActivity } from '../../../(app)/_components/detail-activity';
import { Accordion, Box, LoadingOverlay } from '@mantine/core';
import { Items } from './items';
import { Requisitioner } from './requisitioner';
import { Timeline } from './timeline';
import { Document } from './document';
import { useParams } from 'next/navigation';
import { ProcurementMethod } from './procurement-method';
import { useGetPreBudgetPlansQuery } from '@/store/api/pre-budget-plan/pre-budget-plan.api';
import { ActivityDetailWrapper } from './activity-detail-wrapper';

export function PlanOverview() {
  // const budgetYear = '0f241dbd-3aa9-40b9-9e27-8f8b644d8174';
  const { id } = useParams();
  const [listById, { data: list, isLoading: isActivityLoading }] =
    useLazyListByIdQuery();
  const { data: preBudgetPlan, isLoading: isPreBudgetPlanLoading } =
    useGetPreBudgetPlansQuery({
      where: [[{ column: 'id', value: id, operator: '=' }]],
    });

  useEffect(() => {
    listById({ id: id as string, collectionQuery: { includes: ['reasons'] } });
  }, [id, listById]);

  return (
    <Box pos="relative">
      <Section
        title={preBudgetPlan?.items?.[0].app.planName ?? ''}
        collapsible={false}
      >
        <LoadingOverlay visible={isPreBudgetPlanLoading || isActivityLoading} />
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
                      <Accordion.Control>
                        Activity Identification
                      </Accordion.Control>
                      <Accordion.Panel>
                        <ActivityDetailWrapper type="activityIdentification">
                          <DetailActivity
                            activity={activity}
                            page="pre"
                            hideMethods
                          />
                        </ActivityDetailWrapper>
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item
                      value={'Procurement Methods'}
                      className="bg-white"
                    >
                      <Accordion.Control>Procurement Methods</Accordion.Control>
                      <Accordion.Panel>
                        <ActivityDetailWrapper
                          type="activityMethods"
                          className="pt-6"
                        >
                          <ProcurementMethod activity={activity} />
                        </ActivityDetailWrapper>
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value={'Items'} className="bg-white">
                      <Accordion.Control>Items</Accordion.Control>
                      <Accordion.Panel>
                        <ActivityDetailWrapper
                          type="activityItems"
                          className="pt-6"
                        >
                          <Items activityId={activity.id} />
                        </ActivityDetailWrapper>
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value={'Documents'} className="bg-white">
                      <Accordion.Control>Documents</Accordion.Control>
                      <Accordion.Panel>
                        <ActivityDetailWrapper
                          type="activityDocuments"
                          className="pt-6"
                        >
                          <Document activityId={activity.id} />
                        </ActivityDetailWrapper>
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value={'Timeline'} className="bg-white">
                      <Accordion.Control>Timeline</Accordion.Control>
                      <Accordion.Panel>
                        <ActivityDetailWrapper
                          type="activityTimeline"
                          className="pt-6"
                        >
                          <Timeline activityId={activity.id} />
                        </ActivityDetailWrapper>
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
                        <ActivityDetailWrapper
                          type="activityIdentification"
                          className="pt-6"
                        >
                          <Requisitioner activityId={activity.id} />
                        </ActivityDetailWrapper>
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
