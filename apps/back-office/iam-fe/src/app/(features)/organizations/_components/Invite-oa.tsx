import { Section } from '@megp/core-fe';
import { FormDetail } from './form';

export default function InviteOa() {
  return (
    <Section title="Invite Oa" collapsible={false}>
      <FormDetail mode="new" />
    </Section>
  );
}
