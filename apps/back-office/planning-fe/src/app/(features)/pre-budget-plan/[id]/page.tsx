'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

export default function PreBudgetPlanPage() {
  return (
    <>
      <Section title="Prebudget Plan Detail">
        <FormDetail mode="detail" />
      </Section>
    </>
  );
}
