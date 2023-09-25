import CollapsibleCard from '@/shared/card/collabsableCard';
import InviteOaDetailForm from './inviteOaDetailForm';
import { Card } from '@mantine/core';

const PersonnelDetail = () => {
  return (
    <>
      <div>
        <CollapsibleCard
          title={'Personnel detail'}
          subTitle="Modify personnel"
          dropped={true}
        >
          {' '}
          <InviteOaDetailForm mode="update" />
        </CollapsibleCard>
      </div>

      <Card className="mt-4 ml-2">{/* <UserInvitation /> */}</Card>
    </>
  );
};

export default PersonnelDetail;
