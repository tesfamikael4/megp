import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

export default function NewDonorsPage() {
  return (
    <Section title="New Donor" collapsible={false}>
      <FormDetail mode="new" />
    </Section>
  );
}
