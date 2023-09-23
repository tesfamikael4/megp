import CollapsibleCard from '@/shared/card/collabsableCard';
import UnitDetailForm from '../detail/[Id]/unitDetailForm';
const DetailUnit = () => {
  return (
    <>
      <div>
        <CollapsibleCard title={'User'} subTitle="New User" dropped={true}>
          <UnitDetailForm mode="new" />
        </CollapsibleCard>
      </div>
    </>
  );
};

export default DetailUnit;
