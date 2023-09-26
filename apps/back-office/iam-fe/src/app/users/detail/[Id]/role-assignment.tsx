import { Button, LoadingOverlay, Table } from '@mantine/core';
import { IconDeviceFloppy, IconTrash } from '@tabler/icons-react';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  useGetRoleByUserIdQuery,
  useAssignRoleToUserMutation,
} from '@/store/api/user/user.api';
import { useLazyGetrolesQuery } from '@/store/api/role/role.api';
import { usePathname } from 'next/navigation';
import { CollectionSelectorConfig } from '@/shared/collection-selector-config';
import ModalCollectionSelector from '@/shared/collection-selector/components/modal-collection-selector';
import { EmptyIcon, notify } from '@/shared/ui/page';
import { notifications } from '@mantine/notifications';

/* Component interface */
type RoleAssignmentProps = {
  roleAssignmentModalOpened: boolean;
  setRoleAssignmentModalOpened: (visibility: boolean) => void;
};

/* Component definition */
const RoleAssignment = (props: RoleAssignmentProps) => {
  /* Component states  */
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [currentAssignedEmployees, setCurrentAssignedEmployees] = useState<
    any[]
  >([]);

  /* Hooks */
  const router = useRouter();
  const pathname = usePathname();
  const parts = pathname?.split('/');
  const id = parts && parts[parts?.length - 1].toString();
  const { data: assignedEmployees, isLoading: isAssignedEmployeesFetching } =
    useGetRoleByUserIdQuery(id?.toString());

  const [
    triggerUser,
    { data: roles, isLoading: isUserLoading, isSuccess: isUserSuccess },
  ] = useLazyGetrolesQuery();

  const [assignEmployees, { isLoading: isAssigningEmployees }] =
    useAssignRoleToUserMutation();

  /* Variables */
  const config: CollectionSelectorConfig = {
    visibleColumn: [{ key: 'name', name: 'Name' }],
    title: 'Roles',
    size: 'md',
  };

  /* Event handlers */
  const onSearch = (data: any) => {};

  const onPagination = (data) => {};

  const onDone = async (data) => {
    setCurrentAssignedEmployees(data);
    setButtonDisabled(false);
  };

  const onSave = async () => {
    const data = currentAssignedEmployees.map((unit) => {
      return {
        userId: id?.toString(),
        roleId: unit?.id,
        roleName: unit?.name,
      };
    });
    try {
      await assignEmployees({ data, id }).unwrap();
      setButtonDisabled(true);
      notifications.show({
        message: 'Role has been assigned to user successfully',
        title: 'Sucess',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        message: 'Sorry, an error encountered while assigining role',
        title: 'Sucess',
        color: 'red',
      });
    }
  };

  const removeEmployee = (employeeId: string) => {
    setCurrentAssignedEmployees(
      currentAssignedEmployees.filter((item: any) => item?.id !== employeeId),
    );
    setButtonDisabled(false);
  };

  /* useEffect hooks */

  useEffect(() => {
    if (assignedEmployees) {
      const data = assignedEmployees?.userRoles.map((role: any) => role?.role);
      setCurrentAssignedEmployees(data);
    }
  }, [assignedEmployees]);

  useEffect(() => {
    triggerUser(true);
  }, [triggerUser]);

  return (
    <div>
      <LoadingOverlay visible={isAssignedEmployeesFetching} />
      <>
        <ModalCollectionSelector
          paginationChange={onPagination}
          onDone={onDone}
          search={onSearch}
          total={roles?.items?.count}
          modalOpened={props.roleAssignmentModalOpened}
          setModalOpened={(visibility: boolean) =>
            props.setRoleAssignmentModalOpened(visibility)
          }
          itemsLoading={isUserLoading}
          items={roles?.items}
          config={config}
          buttonLoading={isAssigningEmployees}
          selectedRows={currentAssignedEmployees}
        />

        {currentAssignedEmployees?.length == 0 && (
          <>
            <EmptyIcon />
          </>
        )}

        {currentAssignedEmployees?.length > 0 && (
          <>
            <Table className="my-4">
              <thead>
                <tr className="bg-gray-200">
                  <th>Roles</th>
                  <th className="flex justify-end">Action</th>
                </tr>
              </thead>
              <tbody className="border-b">
                {currentAssignedEmployees?.map((item: any) => (
                  <tr key={item?.id}>
                    <td>{item?.name}</td>
                    <td className="flex justify-end">
                      <Button
                        size="xs"
                        color={'red'}
                        type="button"
                        className="bg-danger p-1"
                        onClick={() => removeEmployee(item?.id)}
                      >
                        {<IconTrash className="flex" size={16} />}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}

        <Button
          disabled={buttonDisabled}
          type="button"
          loading={isAssigningEmployees}
          className="my-4 bg-primary"
          onClick={onSave}
          leftIcon={<IconDeviceFloppy size={18} />}
          size="xs"
        >
          Save
        </Button>
      </>
    </div>
  );
};

export default RoleAssignment;
