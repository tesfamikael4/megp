import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

export default function NewTaxPage() {
  return (
    <Section title="New Tax" collapsible={false}>
      <FormDetail mode="new" />
    </Section>
  );
}
