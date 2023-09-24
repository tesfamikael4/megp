import CollapsibleCard from '@/shared/card/collabsableCard';
import { Accordion } from '@mantine/core';

import MandateDetailForm from '../detail/[Id]/mandateDetailForm';

const DetailMandate = () => {
  return (
    <>
      <div>
        <CollapsibleCard
          title={'Organization Detail'}
          subTitle="Update Organization"
          dropped={true}
        >
          {' '}
          <MandateDetailForm mode="new" />
        </CollapsibleCard>
      </div>
    </>
  );
};

export default DetailMandate;
