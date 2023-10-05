'use client';
import { Section } from '@megp/core-fe';
import { FormDetail } from '../_components/form-detail';

export default function UserDetailPage() {
  return (
    <Section title="User Detail">
      <FormDetail mode="detail" />
    </Section>
  );
}
