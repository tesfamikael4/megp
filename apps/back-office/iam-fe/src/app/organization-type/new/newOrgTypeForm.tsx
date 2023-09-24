import CollapsibleCard from '@/shared/card/collabsableCard';

import UnitDetailForm from '../detail/[Id]/typeDetailForm';

const DetailOrgType = () => {
  return (
    <>
      <div>
        <CollapsibleCard
          title={'Organization Type Detail'}
          subTitle="New Organization Type"
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
