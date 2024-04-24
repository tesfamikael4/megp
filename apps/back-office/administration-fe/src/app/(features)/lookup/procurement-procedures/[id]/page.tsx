import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

export default function ProcurementProcedureDetailPage() {
  return (
    <Section title="Procurement Procedure Detail" collapsible={false}>
      <FormDetail mode="detail" />
    </Section>
  );
}
