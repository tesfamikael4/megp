import CollapsibleCard from '@/shared/card/collabsableCard';

import UnitDetailForm from '../detail/[Id]/typeDetailForm';

const DetailOrgType = () => {
  return (
    <>
      <div>
        <CollapsibleCard
          title={'Unit Type Detail'}
          subTitle="New Unit Type"
          dropped={true}
        >
          <UnitDetailForm mode="new" />
        </CollapsibleCard>
      </div>
      <div className="mt-4"></div>
    </>
  );
};

export default DetailOrgType;
