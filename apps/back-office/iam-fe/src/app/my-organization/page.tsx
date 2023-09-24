'use client';
import CollapsibleCard from '@/shared/card/collabsableCard';
import OrganizationAdressForm from './organizationAdress';
import { Accordion, Button } from '@mantine/core';
import ExtendedProfile from './extendedProfile';
import BasicProfile from './basicProfile';
import UnitTypeForm from './unit-type';
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
      {/* <div className="mt-4">
        <CollapsibleCard
          title={'Unit Type'}
          subTitle="Define Unit Type"
          customAction={
            <Button
              type="button"
              size="xs"
              className="bg-primary "
              onClick={() => {
                setAttachmentModalOpened(true);
              }}
            >
              <IconCirclePlus size={18} />
              Add
            </Button>
          }
        >
          <UnitTypeForm
            status="update"
            attachmentModalOpened={attachmentModalOpened}
            setAttachmentModalOpened={(event: boolean) =>
              setAttachmentModalOpened(event)
            }
            unitstatus={'update'}
          />
        </CollapsibleCard>
      </div> */}
    </>
  );
};

export default DetailOrganization;
