import CollapsibleCard from '@/shared/card/collabsableCard';
import InviteOaDetailForm from '../detail/[Id]/inviteOaDetailForm';

const NewInviteOa = () => {
  return (
    <>
      <div>
        <CollapsibleCard
          title={'New Personnel'}
          subTitle="Register new personnel"
          dropped={true}
        >
          <InviteOaDetailForm mode="new" />
        </CollapsibleCard>
      </div>
      <div className="mt-4"></div>
    </>
  );
};

export default NewInviteOa;
