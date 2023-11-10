import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

export default function NewApp() {
  return (
    <Section title="New">
      <FormDetail mode="new" />
    </Section>
  );
}
