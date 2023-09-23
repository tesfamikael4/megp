import CollapsibleCard from '@/shared/card/collabsableCard';

import UnitDetailForm from '../detail/[Id]/sectorDetailForm';

const DetailOrgSector = () => {
  return (
    <>
      <div>
        <CollapsibleCard
          title={'Organization Sector '}
          subTitle="New Organization Sector"
          dropped={true}
        >
          <UnitDetailForm mode="new" />
        </CollapsibleCard>
      </div>
      <div className="mt-4"></div>
    </>
  );
};

export default DetailOrgSector;
