import CollapsibleCard from '@/shared/card/collabsableCard';

import OrgTypeDetailForm from './typeDetailForm';

const DetailUnitType = () => {
  return (
    <>
      <div>
        <CollapsibleCard
          title={'Unit Type Detail'}
          subTitle="Update Unit Type"
          dropped={true}
        >
          <OrgTypeDetailForm mode="update" />
        </CollapsibleCard>
      </div>
      <div className="mt-4"></div>
    </>
  );
};

export default DetailUnitType;
