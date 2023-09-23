import CollapsibleCard from '@/shared/card/collabsableCard';

import UnitDetailForm from './unitDetailForm';
import React, { useState } from 'react';
import EmployeeAssignment from './employee-assignment';
import { Button } from '@mantine/core';
import { IconCirclePlus } from '@tabler/icons-react';

const DetailUnit = () => {
  const [employeeAssignmentModalOpened, setEmployeeAssignmentModalOpened] =
    useState<boolean>(false);

  return (
    <>
      <div>
        <CollapsibleCard
          title={'Unit Detail'}
          subTitle="Update Unit"
          dropped={true}
        >
          <UnitDetailForm mode="update" />
        </CollapsibleCard>
      </div>
      <div className="mt-4">
        <CollapsibleCard
          className="my-4"
          title={'Employees Assignment'}
          subTitle="List of employees in this unit"
          customAction={
            <>
              {
                <Button
                  type="button"
                  className="bg-primary"
                  size="xs"
                  onClick={() => {
                    setEmployeeAssignmentModalOpened(true);
                  }}
                >
                  <IconCirclePlus size={18} />
                  Assign
                </Button>
              }
            </>
          }
        >
          <EmployeeAssignment
            employeeAssignmentModalOpened={employeeAssignmentModalOpened}
            setEmployeeAssignmentModalOpened={(visibility: boolean) =>
              setEmployeeAssignmentModalOpened(visibility)
            }
          />
        </CollapsibleCard>
      </div>
      <div>{/* <TreeComponent /> */}</div>
    </>
  );
};

export default DetailUnit;
