import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

export default function ProcurementMethodDetailPage() {
  return (
    <Section title="Procurement Method Detail" collapsible={false}>
      <FormDetail mode="detail" />
    </Section>
  );
}
