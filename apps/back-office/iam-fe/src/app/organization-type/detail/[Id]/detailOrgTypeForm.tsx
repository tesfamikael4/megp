import CollapsibleCard from '@/shared/card/collabsableCard';

import OrgTypeDetailForm from './typeDetailForm';

const DetailOrgType = () => {
  return (
    <>
      <div>
        <CollapsibleCard
          title={'Organization Type Detail'}
          subTitle="Update Organization Type"
          dropped={true}
        >
          <OrgTypeDetailForm mode="update" />
        </CollapsibleCard>
      </div>
      <div className="mt-4"></div>
    </>
  );
};

export default DetailOrgType;
