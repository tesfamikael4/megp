'use client';

import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

export default function PreBudgetPlanPage() {
  return (
    <Section title="New Pre Budget Plan" collapsible={false}>
      <FormDetail mode="new" />
    </Section>
  );
}
