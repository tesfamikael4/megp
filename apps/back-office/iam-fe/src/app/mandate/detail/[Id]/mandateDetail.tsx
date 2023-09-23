import CollapsibleCard from '@/shared/card/collabsableCard';
import { Accordion, Button } from '@mantine/core';
import ExtendedProfile from './extendedProfile';
import MandateDetailForm from './mandateDetailForm';
import { useState } from 'react';
import HouseRuleAssignment from '../../../organizations/detail/[Id]/mandate-assignment';
import * as Icon from '@tabler/icons-react';

const DetailMandate = () => {
  const [houseRuleAssignmentModalOpened, setHouseRuleAssignmentModalOpened] =
    useState<boolean>(false);

  return (
    <>
      <div>
        <CollapsibleCard
          title={'Mandate Detail'}
          subTitle="Update Mandate"
          dropped={true}
        >
          {' '}
          <MandateDetailForm mode="update" />
        </CollapsibleCard>
      </div>
      <div className="mt-4">
        <CollapsibleCard
          className="my-2 grow "
          title="Application Permission Assignment"
          subTitle="List of Application Permissions"
          customAction={
            <Button
              type="button"
              className="bg-primary"
              size="xs"
              onClick={() => {
                setHouseRuleAssignmentModalOpened(true);
              }}
            >
              <Icon.IconCirclePlus size="18" />
              Assign
            </Button>
          }
        >
          {/* <HouseRuleAssignment
            houseRuleAssignmentModalOpened={houseRuleAssignmentModalOpened}
            setHouseRuleAssignmentModalOpened={(visibility: boolean) =>
              setHouseRuleAssignmentModalOpened(visibility)
            }
          /> */}
        </CollapsibleCard>
      </div>
    </>
  );
};

export default DetailMandate;
