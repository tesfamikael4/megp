import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

export default function TaxDetailPage() {
  return (
    <Section title="Taxs Detail" collapsible={false}>
      <FormDetail mode="detail" />
    </Section>
  );
}
