'use client';
import { PageLayout, Section } from '@megp/core-fe';
import { FormDetail } from './_components/form-detail';
import { Accordion } from '@mantine/core';
import OrganizationAdressForm from './_components/organizationAdress';

export default function MyOrganizationPage() {
  return (
    <PageLayout>
      <Section title="Basic Profile">
        <FormDetail />

        <Accordion>
          <Accordion.Item value="customization">
            <Accordion.Control>Organization Adress</Accordion.Control>
            <Accordion.Panel>
              <OrganizationAdressForm />
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Section>
    </PageLayout>
  );
}
