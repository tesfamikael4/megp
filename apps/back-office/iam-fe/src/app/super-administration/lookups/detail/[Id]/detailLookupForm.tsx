import CollapsibleCard from '@/shared/card/collabsableCard';
import UnitDetailForm from './LookupDetailForm';

const DetailLookup = () => {
  return (
    <>
      <div>
        <CollapsibleCard
          title={'Organization-Type Lookups'}
          subTitle="Organization-Type Lookups"
          dropped={true}
        >
          <UnitDetailForm mode="update" />
        </CollapsibleCard>
      </div>
      <div className="mt-4"></div>
    </>
  );
};

export default DetailLookup;
