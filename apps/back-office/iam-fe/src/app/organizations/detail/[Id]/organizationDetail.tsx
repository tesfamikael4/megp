import CollapsibleCard from '@/shared/card/collabsableCard';
import OrganizationDetailForm from './organizationDetailForm';
import OrgAdminList from './manageOrgAdmin';
import { useState } from 'react';
import MandateAssignment from './mandates-assignment';
import { usePathname } from 'next/navigation';
import { Button } from '@mantine/core';

const DetailOrganization = () => {
  const [mandateAssignmentModalOpened, setMandateAssignmentModalOpened] =
    useState<boolean>(false);

  const pathname = usePathname();
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];
  return (
    <>
      <div>
        <CollapsibleCard
          title={'Organization Detail'}
          subTitle="Update Organization"
          dropped={true}
        >
          {' '}
          <OrganizationDetailForm mode="update" />
        </CollapsibleCard>
      </div>
      {/* <div>
        <CollapsibleCard
          title={'Organization Logo'}
          subTitle="Add organization logo"
          dropped={true}
        >
          {' '}
          <LogoAttachmentForm attachmentId={id?.toString()} status={'update'} />
        </CollapsibleCard>
      </div> */}

      {/* <div className="mt-4">
        <MandateAssignment collapsed={true} />
      </div> */}
      <div className="mt-4">
        <CollapsibleCard
          className="my-4"
          title={'Mandate Assignment'}
          subTitle="List of assigned mandates in this organization"
          customAction={
            <>
              {
                <Button
                  type="button"
                  className="bg-primary"
                  size="xs"
                  onClick={() => {
                    setMandateAssignmentModalOpened(true);
                  }}
                >
                  Assign
                </Button>
              }
            </>
          }
        >
          <MandateAssignment
            MandateAssignmentModalOpened={mandateAssignmentModalOpened}
            setMandateAssignmentModalOpened={(visibility: boolean) =>
              setMandateAssignmentModalOpened(visibility)
            }
          />
        </CollapsibleCard>
      </div>
      <div className="mt-4">
        <CollapsibleCard
          title={'Manage Administrators'}
          subTitle="Manage Organization Administrators"
          dropped={false}
        >
          <OrgAdminList />
        </CollapsibleCard>
      </div>

      {/* <div className="mt-4">
        <CollapsibleCard
          title={'Reset Organization Password'}
          subTitle="Reset Default Organization Password"
          dropped={true}
        >
          <ResetPassword />
        </CollapsibleCard>
      </div> */}
    </>
  );
};

export default DetailOrganization;
