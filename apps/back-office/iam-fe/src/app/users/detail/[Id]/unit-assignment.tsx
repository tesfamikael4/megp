import { Button, LoadingOverlay, Table } from '@mantine/core';
import { IconDeviceFloppy, IconTrash } from '@tabler/icons-react';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// import { useGetEmployeesByBranchIdQuery } from '../../branch/store/query/branch.query';
import {
  useGetUnitByUserIdQuery,
  useAssignUnitToUserMutation,
  useGetUserByIdQuery,
  useLazyGetUsersQuery,
} from '@/store/api/user/user.api';
import { useLazyGetUnitQuery } from '@/store/api/unit/unit.api';
import { usePathname } from 'next/navigation';
import { CollectionSelectorConfig } from '@/shared/collection-selector-config';
import ModalCollectionSelector from '@/shared/collection-selector/components/modal-collection-selector';
import { EmptyIcon, notify } from '@/shared/ui/page';

/* Component interface */
type EmployeeAssignmentProps = {
  employeeAssignmentModalOpened: boolean;
  setEmployeeAssignmentModalOpened: (visibility: boolean) => void;
};

/* Component definition */
const UserAssignment = (props: EmployeeAssignmentProps) => {
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
    useGetUnitByUserIdQuery(id?.toString());

  const { data: unit } = useGetUserByIdQuery(id?.toString());

  const [
    triggerUser,
    { data: units, isLoading: isUserLoading, isSuccess: isUserSuccess },
  ] = useLazyGetUnitQuery();

  const [assignEmployees, { isLoading: isAssigningEmployees }] =
    useAssignUnitToUserMutation();

  /* Variables */
  const config: CollectionSelectorConfig = {
    visibleColumn: [{ key: 'name', name: 'Name' }],
    title: 'Units',
    size: 'md',
  };

  /* Event handlers */
  const onSearch = (data: any) => {};

  const onPagination = (data) => {};

  const onDone = async (data) => {
    setCurrentAssignedEmployees(data);
    setButtonDisabled(false);
  };
  // userId: userId,
  //     unitId: unit.id,
  //     unitName: unit.name,
  //   };
  console.log(currentAssignedEmployees);
  const onSave = async () => {
    const data = currentAssignedEmployees.map((unit) => {
      return {
        userId: id?.toString(),
        unitId: unit?.id,
        unitName: unit?.name,
      };
    });
    try {
      await assignEmployees({ data, id }).unwrap();
      setButtonDisabled(true);
      notify('success', 'Unit has been assigned to user successfully.');
    } catch (err) {
      notify('error', 'Sorry, an error encountered while assigning Unit.');
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
      const data = assignedEmployees?.userUnits.map((unit: any) => unit?.unit);
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
          total={units?.items?.count}
          modalOpened={props.employeeAssignmentModalOpened}
          setModalOpened={(visibility: boolean) =>
            props.setEmployeeAssignmentModalOpened(visibility)
          }
          itemsLoading={isUserLoading}
          items={units?.items}
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
                  <th>Units</th>
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

export default UserAssignment;
