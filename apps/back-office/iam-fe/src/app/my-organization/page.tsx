'use client';
import CollapsibleCard from '@/shared/card/collabsableCard';
import OrganizationAdressForm from './organizationAdress';
import { Accordion, Button } from '@mantine/core';
import ExtendedProfile from './extendedProfile';
import BasicProfile from './basicProfile';

import { useState } from 'react';
import { IconCirclePlus } from '@tabler/icons-react';

const DetailOrganization = () => {
  const [attachmentModalOpened, setAttachmentModalOpened] =
    useState<boolean>(false);

  return (
    <>
      <div>
        <CollapsibleCard
          title={'Basic Profile'}
          subTitle="Modify Basic profile"
          dropped={true}
        >
          {' '}
          <BasicProfile />
          <Accordion>
            <Accordion.Item value="customization">
              <Accordion.Control>Organization Adress</Accordion.Control>
              <Accordion.Panel>
                <OrganizationAdressForm />
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </CollapsibleCard>
      </div>
      <div className="mt-4">
        <CollapsibleCard
          title={'Extended Profile'}
          subTitle="Modify extended profile"
          dropped={true}
        >
          <ExtendedProfile />
        </CollapsibleCard>
      </div>
    </>
  );
};

export default DetailOrganization;
