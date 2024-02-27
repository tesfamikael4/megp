'use client';
import { PageLayout, Section } from '@megp/core-fe';
import { FormDetail } from './_components/form-detail';
import { Accordion, Text } from '@mantine/core';
import OrganizationAdressForm from './_components/organizationAdress';

export default function MyOrganizationPage() {
  return (
    <PageLayout>
      <Section title="Basic Profile">
        <FormDetail />

        <Accordion>
          <Accordion.Item value="customization">
            <Accordion.Control>
              <Text size="lg" className="font-medium">
                Organization Address
              </Text>
            </Accordion.Control>
            <Accordion.Panel>
              <OrganizationAdressForm />
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Section>
    </PageLayout>
  );
}
