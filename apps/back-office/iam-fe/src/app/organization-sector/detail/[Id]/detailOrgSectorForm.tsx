import CollapsibleCard from '@/shared/card/collabsableCard';

import OrgSectorDetailForm from './sectorDetailForm';

const DetailOrgSector = () => {
  return (
    <>
      <div>
        <CollapsibleCard
          title={'Organization Sector Detail'}
          subTitle="Update Organization Sector"
          dropped={true}
        >
          <OrgSectorDetailForm mode="update" />
        </CollapsibleCard>
      </div>
      <div className="mt-4"></div>
    </>
  );
};

export default DetailOrgSector;
