import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

export default function BudgetCategoryDetailPage() {
  return (
    <Section title="Budget Catgory Detail" collapsible={false}>
      <FormDetail mode="detail" />
    </Section>
  );
}
