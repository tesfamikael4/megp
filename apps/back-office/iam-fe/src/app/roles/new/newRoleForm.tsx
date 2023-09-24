import CollapsibleCard from '@/shared/card/collabsableCard';
import RoleDetailForm from '../detail/[Id]/roleDetailForm';

const DetailRole = () => {
  return (
    <>
      <div>
        <CollapsibleCard title={'Role '} subTitle="new role" dropped={true}>
          <RoleDetailForm mode="new" />
        </CollapsibleCard>
      </div>
    </>
  );
};

export default DetailRole;
