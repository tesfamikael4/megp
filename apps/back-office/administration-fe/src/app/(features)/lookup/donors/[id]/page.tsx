import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

export default function DonorsDetailPage() {
  return (
    <Section title="Donors Detail" collapsible={false}>
      <FormDetail mode="detail" />
    </Section>
  );
}
