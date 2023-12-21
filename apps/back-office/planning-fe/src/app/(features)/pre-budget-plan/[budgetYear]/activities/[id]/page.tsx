'use client';
import { Tabs } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { FormDetail } from '@/app/(features)/_components/activity-form-detail';
import { Documents } from '@/app/(features)/_components/documents';
import TimelineTab from '@/app/(features)/_components/timeline-tab';
import { Items } from '@/app/(features)/_components/items';
import { ActivityMechanization } from '@/app/(features)/_components/activity-mechanization';
import { useGetPreBudgetPlanQuery } from '@/store/api/pre-budget-plan/pre-budget-plan.api';
import { useParams } from 'next/navigation';

export default function NewActivity() {
  const { budgetYear } = useParams();
  const { data: preBudgetYear } = useGetPreBudgetPlanQuery(
    budgetYear as string,
  );
  const disableFields = preBudgetYear ? preBudgetYear.status != 'Draft' : false;
  return (
    <>
      <Section title="Activity">
        <Tabs defaultValue="definition">
          <Tabs.List>
            <Tabs.Tab value="definition">Definition</Tabs.Tab>
            <Tabs.Tab value="method">Method</Tabs.Tab>
            <Tabs.Tab value="items">Items</Tabs.Tab>
            <Tabs.Tab value="documents">Documents</Tabs.Tab>
            <Tabs.Tab value="timeline">Timeline</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="definition" className="pt-2">
            <FormDetail
              mode="detail"
              page="pre"
              disableFields={disableFields}
            />
          </Tabs.Panel>
          <Tabs.Panel value="method" className="pt-2">
            <ActivityMechanization page="pre" disableFields={disableFields} />
          </Tabs.Panel>

          <Tabs.Panel value="items">
            <Items page="pre" disableFields={disableFields} />
          </Tabs.Panel>

          <Tabs.Panel value="documents">
            <Documents disableFields={disableFields} />
          </Tabs.Panel>

          <Tabs.Panel value="timeline">
            <TimelineTab page="pre" disableFields={disableFields} />
          </Tabs.Panel>
        </Tabs>
      </Section>
    </>
  );
}
