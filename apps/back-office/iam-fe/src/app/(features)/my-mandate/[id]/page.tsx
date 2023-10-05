'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

export default function MyMandatePage() {
  return (
    <Section title="My Mandate Detail">
      <FormDetail mode="detail" />
    </Section>
  );
}
