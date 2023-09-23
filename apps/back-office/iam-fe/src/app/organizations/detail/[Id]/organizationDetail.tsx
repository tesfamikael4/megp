import CollapsibleCard from '@/shared/card/collabsableCard';
import OrganizationDetailForm from './organizationDetailForm';
import OrgAdminList from './manageOrgAdmin';
import { useState } from 'react';
import ResetPassword from './resetPassword';
import LogoAttachmentForm from './logo';
import MandateAssignment from './mandate-assignment';

import { usePathname } from 'next/navigation';

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
      <div>
        <CollapsibleCard
          title={'Organization Logo'}
          subTitle="Add organization logo"
          dropped={true}
        >
          {' '}
          <LogoAttachmentForm attachmentId={id?.toString()} status={'update'} />
        </CollapsibleCard>
      </div>

      <div className="mt-4">
        <MandateAssignment collapsed={true} />
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
