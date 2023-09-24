import CollapsibleCard from '@/shared/card/collabsableCard';
import UnitDetailForm from '../detail/[Id]/LookupDetailForm';

const DetailLookup = () => {
  return (
    <>
      <div>
        <CollapsibleCard
          title={'Organization-Type Lookups'}
          subTitle="Organization-Type Lookups"
          dropped={true}
        >
          <UnitDetailForm mode="new" />
        </CollapsibleCard>
      </div>
      <div className="mt-4"></div>
    </>
  );
};

export default DetailLookup;
