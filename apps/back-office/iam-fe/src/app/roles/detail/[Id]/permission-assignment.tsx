import { Button, Divider, LoadingOverlay, Table } from '@mantine/core';
import {
  IconAlertTriangle,
  IconDeviceFloppy,
  IconTrash,
} from '@tabler/icons-react';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  useAssignRoleToMandatePermissionsMutation,
  // useLazyGetMandatePermissionsToAssignQuery,
  useLazyGetPermissionByOrganizationIdQuery,
  useLazyGetroleByIdQuery,
  useLazyGetRolePermissionsQuery,
} from '@/store/api/role/role.api';
import { CollectionSelectorConfig } from '@/shared/collection-selector-config';
import { CollectionQuery } from '@/shared/core/models';
import ModalCollectionSelector from '@/shared/collection-selector/components/modal-collection-selector';
import EmptyState from '@/shared/ui/empty';
import { notifications } from '@mantine/notifications';

/* Component interface */
type PermissionAssignmentProps = {
  permissionAssignmentModalOpened: boolean;
  setPermissionAssignmentModalOpened: (visibility: boolean) => void;
};

/* Component definitions */
const PermissionAssignment = (props: PermissionAssignmentProps) => {
  /* Component states  */
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [currentAssignedPermissions, setCurrentAssignedPermissions] =
    useState<any>([]);

  /* collectionQuery for assigned permissions */
  const [collectionQuery, setCollectionQuery] = useState<CollectionQuery>({});

  /* collectionQuery for fetching any mandate permissions */
  const [
    mandatePermissionsCollectionQuery,
    setMandatePermissionsCollectionQuery,
  ] = useState<CollectionQuery>({
    filter: [],
    skip: 0,
    top: 10,
  });

  /* Hooks */

  const router = useRouter();
  const pathname = usePathname();
  const parts = pathname?.split('/');
  const id = parts && parts[parts?.length - 1];
  const [triggerRoleByIdFetch, { data: role, isSuccess: isRoleFetched }] =
    useLazyGetroleByIdQuery();

  const [
    triggerRolePermissionsFetch,
    {
      data: assignedPermissions,
      isLoading: isAssignedPermissionsFetching,
      isSuccess: isAssignedPermissionsFetched,
    },
  ] = useLazyGetRolePermissionsQuery();

  const [
    trigger,
    {
      data: mandatePermissions,
      isLoading: isMandatePermissionsFetching,
      isSuccess: isMandatePermissionsFetched,
    },
  ] = useLazyGetPermissionByOrganizationIdQuery();
  console.log(mandatePermissions);
  const [assignPermissions, { isLoading: isAssigningPermissions }] =
    useAssignRoleToMandatePermissionsMutation();

  /* Variables */
  const config: CollectionSelectorConfig = {
    visibleColumn: [
      { key: 'applicationName', name: 'Application' },
      { key: 'name', name: 'Permission name' },
    ],
    title: 'Mandate permissions',
    size: 'md',
  };

  /* Functions */
  const castRolePermissionToMandatePermission = (
    currentAssignedPermissions: any[],
  ) => {
    return currentAssignedPermissions?.map((item: any) => ({
      applicationId: item?.applicationId,
      applicationKey: item?.applicationKey,
      applicationName: item?.applicationName,
      id: item?.permissionId,
      key: item?.permissionKey,
      name: item?.permissionName,
      organizationId: '099454a9-bf8f-45f5-9a4f-6e9034230250',
    }));
  };

  /* Event handlers */
  const onSearch = (data: any) => {
    setMandatePermissionsCollectionQuery({
      ...mandatePermissionsCollectionQuery,
      search: data,
    });
  };

  const onPagination = (data) => {
    setMandatePermissionsCollectionQuery({
      ...mandatePermissionsCollectionQuery,
      skip: data.skip,
      top: data.top,
    });
  };

  const onDone = async (data) => {
    const dataModified = data.map((permission) => {
      return {
        roleId: id,
        permissionId: permission?.id,
        permissionName: permission?.name,
        permissionKey: permission?.key,
        applicationKey: permission?.applicationKey,
        applicationName: permission?.applicationName,
        applicationId: permission?.applicationId,
        organizationId: '099454a9-bf8f-45f5-9a4f-6e9034230250',
      };
    });
    setCurrentAssignedPermissions(dataModified);
    setButtonDisabled(false);
  };

  const onSave = async () => {
    const idParse = id?.toString();
    const data = currentAssignedPermissions;
    // .map((permission) => {
    //   return {
    //     roleId: id,
    //     permissionId: permission?.id,
    //     permissionName: permission?.name,
    //     permissionKey: permission?.key,
    //     applicationKey: permission?.applicationKey,
    //     applicationName: permission?.applicationName,
    //     applicationId: permission?.applicationId,
    //   };
    // });
    try {
      await assignPermissions({
        data,
        idParse,
      }).unwrap();
      notifications.show({
        message: 'Permissions have been assigned to role successfully',
        title: 'Success',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        message: 'Sorry, an error encountered while assigning permissions',
        title: 'Error',
        color: 'red',
      });
    }
  };

  const removePermission = (permissionId: string) => {
    setCurrentAssignedPermissions(
      currentAssignedPermissions.filter(
        (item: any) => item?.id !== permissionId,
      ),
    );
    setButtonDisabled(false);
  };

  /* useEffect hooks */
  useEffect(() => {
    if (id?.toString()) {
      triggerRoleByIdFetch(id?.toString(), true);
    }
  }, [id, triggerRoleByIdFetch]);

  useEffect(() => {
    if (id?.toString()) {
      setCollectionQuery({
        ...collectionQuery,
        filter: [
          [
            {
              field: 'roleId',
              value: id?.toString(),
              operator: '=',
            },
          ],
        ],
      });
    }
  }, [id]);

  useEffect(() => {
    triggerRolePermissionsFetch(id?.toString());
  }, []);

  useEffect(() => {
    if (assignedPermissions && isAssignedPermissionsFetched) {
      setCurrentAssignedPermissions(assignedPermissions?.rolePermissions);
    }
  }, [assignedPermissions, isAssignedPermissionsFetched]);

  useEffect(() => {
    if (props.permissionAssignmentModalOpened) {
      trigger('099454a9-bf8f-45f5-9a4f-6e9034230250');
    }
  }, [props.permissionAssignmentModalOpened, trigger]);

  return (
    <div>
      <LoadingOverlay visible={isAssignedPermissionsFetching} />
      <ModalCollectionSelector
        paginationChange={onPagination}
        onDone={onDone}
        search={onSearch}
        total={mandatePermissions?.count}
        modalOpened={props.permissionAssignmentModalOpened}
        setModalOpened={(visibility: boolean) =>
          props.setPermissionAssignmentModalOpened(visibility)
        }
        itemsLoading={isMandatePermissionsFetching}
        items={mandatePermissions?.items}
        config={config}
        buttonLoading={isAssigningPermissions}
        selectedRows={castRolePermissionToMandatePermission(
          currentAssignedPermissions,
        )}
        collectionQuery={mandatePermissionsCollectionQuery}
      />

      {currentAssignedPermissions?.length == 0 && (
        <>
          <Divider className="my-4" />
          <div className="flex items-center">
            <EmptyState />
            <IconAlertTriangle />
            <span className="ml-2">This role has no permissions assigned.</span>
          </div>
        </>
      )}

      {currentAssignedPermissions?.length > 0 && (
        <>
          <Table className="my-4">
            <thead>
              <tr className="bg-gray-200">
                <th>Application</th>
                <th>Permission name</th>
                {!role?.data?.isDefault && <th>Action</th>}
              </tr>
            </thead>
            <tbody className="border-b">
              {currentAssignedPermissions?.map((item) => (
                <tr key={item.id}>
                  <td>{item.applicationName}</td>
                  <td>{item.permissionName}</td>
                  {!role?.data?.isDefault && (
                    <td className="flex justify-end">
                      <Button
                        size="xs"
                        color={'red'}
                        type="button"
                        className="bg-danger p-1"
                        onClick={() => removePermission(item.id)}
                      >
                        {<IconTrash className="flex" size={16} />}
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {!role?.data?.isDefault && (
        <Button
          disabled={buttonDisabled}
          type="button"
          loading={isAssigningPermissions}
          className="my-4 bg-primary"
          onClick={onSave}
          leftIcon={<IconDeviceFloppy size={18} />}
          size="xs"
        >
          Save
        </Button>
      )}
    </div>
  );
};

export default PermissionAssignment;
