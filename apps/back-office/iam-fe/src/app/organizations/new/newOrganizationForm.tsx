import CollapsibleCard from '@/shared/card/collabsableCard';
import OrganizationDetailForm from '../detail/[Id]/organizationDetailForm';

const DetailOrganization = () => {
  return (
    <>
      <div>
        <CollapsibleCard
          title={'Organization '}
          subTitle="Add new Organization"
          dropped={true}
        >
          <OrganizationDetailForm mode="new" />
        </CollapsibleCard>
      </div>
    </>
  );
};

export default DetailOrganization;
