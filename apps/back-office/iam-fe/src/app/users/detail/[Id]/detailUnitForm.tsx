import CollapsibleCard from '@/shared/card/collabsableCard';

import UnitDetailForm from './unitDetailForm';
import React, { useState } from 'react';

import { Button } from '@mantine/core';
import { IconCirclePlus } from '@tabler/icons-react';
import UnitAssignment from './unit-assignment';
import RoleAssignment from './role-assignment';
import ExtendedProfile from './extendedProfile';

const DetailUnit = () => {
  const [employeeAssignmentModalOpened, setEmployeeAssignmentModalOpened] =
    useState<boolean>(false);

  const [roleAssignmentModalOpened, setRoleAssignmentModalOpened] =
    useState<boolean>(false);
  return (
    <>
      <div>
        <CollapsibleCard
          title={'User Detail'}
          subTitle="Update User"
          dropped={true}
        >
          <UnitDetailForm mode="update" />
        </CollapsibleCard>
      </div>
      <div className="mt-4">
        <CollapsibleCard
          className="my-4"
          title={'Unit Assignment'}
          subTitle="List of unit"
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
          <UnitAssignment
            employeeAssignmentModalOpened={employeeAssignmentModalOpened}
            setEmployeeAssignmentModalOpened={(visibility: boolean) =>
              setEmployeeAssignmentModalOpened(visibility)
            }
          />
        </CollapsibleCard>
      </div>

      <div className="mt-4">
        <CollapsibleCard
          className="my-4"
          title={'Role Assignment'}
          subTitle="List of role"
          customAction={
            <>
              {
                <Button
                  type="button"
                  className="bg-primary"
                  size="xs"
                  onClick={() => {
                    setRoleAssignmentModalOpened(true);
                  }}
                >
                  <IconCirclePlus size={18} />
                  Assign
                </Button>
              }
            </>
          }
        >
          <RoleAssignment
            roleAssignmentModalOpened={roleAssignmentModalOpened}
            setRoleAssignmentModalOpened={(visibility: boolean) =>
              setRoleAssignmentModalOpened(visibility)
            }
          />
        </CollapsibleCard>
      </div>
    </>
  );
};

export default DetailUnit;
