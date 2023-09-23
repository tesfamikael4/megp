import CollapsibleCard from '@/shared/card/collabsableCard';

import UnitDetailForm from '../detail/[Id]/unitDetailForm';

const DetailUnit = () => {
  return (
    <>
      <div>
        <CollapsibleCard
          title={'Unit Detail'}
          subTitle="New Unit"
          dropped={true}
        >
          <UnitDetailForm mode="new" />
        </CollapsibleCard>
      </div>
      <div className="mt-4"></div>
    </>
  );
};

export default DetailUnit;
