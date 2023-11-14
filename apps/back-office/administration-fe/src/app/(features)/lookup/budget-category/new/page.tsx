import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

export default function NewProcurementMethodPage() {
  return (
    <Section title="New Budget Catgory " collapsible={false}>
      <FormDetail mode="new" />
    </Section>
  );
}
