'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_component/form-detail';
export default function TargetGroupPage() {
  return (
    <Section title="Target Group" collapsible={false}>
      <FormDetail mode="new" />
    </Section>
  );
}
