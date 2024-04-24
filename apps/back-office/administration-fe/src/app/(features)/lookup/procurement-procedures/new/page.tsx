import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

export default function NewProcurementProcedurePage() {
  return (
    <Section title="New Procurement Procedure" collapsible={false}>
      <FormDetail mode="new" />
    </Section>
  );
}
