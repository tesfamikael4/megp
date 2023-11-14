import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

export default function NewProcurementMethodPage() {
  return (
    <Section title="Procurement Procedure Detail" collapsible={false}>
      <FormDetail mode="detail" />
    </Section>
  );
}
