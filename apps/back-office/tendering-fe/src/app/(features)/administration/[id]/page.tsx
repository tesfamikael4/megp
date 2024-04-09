import { Button } from '@mantine/core';
import { ExpandableTable, Section } from '@megp/core-fe';
import { TenderOverView } from '../../opening/_components/tender-overview';

export default function BidAdministrationDetail() {
  return (
    <>
      <TenderOverView />
      <Section
        title="Bid Openers"
        className="mt-2"
        action={<Button>Add</Button>}
      >
        <ExpandableTable
          data={[]}
          config={{
            columns: [
              {
                accessor: 'fullName',
              },
            ],
          }}
        />
      </Section>
      <Section
        title="Bid Evaluators"
        className="mt-2"
        action={<Button>Add</Button>}
      >
        <ExpandableTable
          data={[]}
          config={{
            columns: [
              {
                accessor: 'fullName',
              },
            ],
          }}
        />
      </Section>
    </>
  );
}
