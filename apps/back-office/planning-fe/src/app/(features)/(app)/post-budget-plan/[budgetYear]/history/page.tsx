import PlanningTab from '@/app/(features)/(app)/_components/planning-tab';
import { Box } from '@mantine/core';
import { ExpandableTable, Section } from '@megp/core-fe';

export default function History() {
  return (
    <Box>
      <PlanningTab page="post" />
      <Section
        title="New added Activities"
        className="mt-2"
        collapsible={false}
      >
        <ExpandableTable
          data={[]}
          config={{
            columns: [
              {
                accessor: 'name',
              },
              {
                accessor: 'description',
              },
            ],
          }}
        />
      </Section>
      <Section title="Modified Activities" className="mt-2" collapsible={false}>
        <ExpandableTable
          data={[]}
          config={{
            columns: [
              {
                accessor: 'name',
              },
              {
                accessor: 'description',
              },
            ],
          }}
        />
      </Section>
      <Section title="Deleted Activities" className="mt-2" collapsible={false}>
        <ExpandableTable
          data={[]}
          config={{
            columns: [
              {
                accessor: 'name',
              },
              {
                accessor: 'description',
              },
            ],
          }}
        />
      </Section>
    </Box>
  );
}
