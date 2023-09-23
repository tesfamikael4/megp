import CollapsibleCard from '@/shared/card/collabsableCard';
import { Button } from '@mantine/core';
import { useEffect, useState } from 'react';
import * as Icon from '@tabler/icons-react';
import RoleDetailForm from './roleDetailForm';
import PermissionAssignment from './permission-assignment';
import { useLazyGetroleByIdQuery } from '@/store/api/role/role.api';
import { usePathname } from 'next/navigation';

const DetailRole = () => {
  // const [roleAssignmentModalOpened, setRoleAssignmentModalOpened] =
  //   useState<boolean>(false);

  const pathname = usePathname();
  const parts = pathname?.split('/');
  const id = parts && parts[parts?.length - 1];

  const [permissionAssignmentModalOpened, setPermissionAssignmentModalOpened] =
    useState<boolean>(false);

  const [
    trigger,
    {
      data: role,
      isLoading: isFetchedRoleLoading,
      isSuccess: isFetchedRoleSuccess,
    },
  ] = useLazyGetroleByIdQuery();

  useEffect(() => {
    trigger(id?.toString());
  }, [id, trigger]);

  return (
    <>
      <div>
        <CollapsibleCard
          title={'Role Detail'}
          subTitle={
            !role?.isSystemRole ? 'Update Role' : 'View System Role detail'
          }
          dropped={true}
        >
          {' '}
          <RoleDetailForm mode="update" />
        </CollapsibleCard>
      </div>
      {!role?.isSystemRole && (
        <div className="mt-4">
          <CollapsibleCard
            className="my-4"
            title={'Role permissions'}
            subTitle="Role permissions"
            customAction={
              <>
                {
                  <Button
                    type="button"
                    className="bg-primary"
                    size="xs"
                    onClick={() => {
                      setPermissionAssignmentModalOpened(true);
                    }}
                  >
                    <Icon.IconCirclePlus size={18} />
                    Assign
                  </Button>
                }
              </>
            }
          >
            <PermissionAssignment
              permissionAssignmentModalOpened={permissionAssignmentModalOpened}
              setPermissionAssignmentModalOpened={(visibility: boolean) =>
                setPermissionAssignmentModalOpened(visibility)
              }
            />
          </CollapsibleCard>
        </div>
      )}
    </>
  );
};

export default DetailRole;
