// TableComponent.jsx
import React, { useEffect, useState } from 'react';
import { useLazyListByAppIdQuery } from '../../applications/_api/permission.api';
import { useLazyGetPermissionByOrganizationIdQuery } from '../../roles/_api/others.api';
import { useLazyApplicationUnderOrganizationQuery } from '../_api/others.api';
import { Box, Button, Checkbox, Divider, Flex, Table } from '@mantine/core';
import styles from '../../../page.module.scss';
import { Permission } from '@/models/permission';

import { useAuth } from '@megp/auth';

interface EntityListProps {
  permission: Permission[];
  setPermission: (arg) => void;
  setIsModalOpen: (boolean) => void;
  handleCloseModal: () => void;
}

const MandatePermission = ({
  permission,
  setPermission,
  handleCloseModal,
}: EntityListProps) => {
  const [selectedRow, setSelectedRow] = useState<any>();
  const [selectedPermission, setSelectedPermission] = useState<any>([]);
  const [filteredPermission, setFilteredPermission] = useState<any>([]);
  const { organizationId } = useAuth();

  const [trigger, { data: permissionList }] = useLazyListByAppIdQuery();
  const [triggerPermission, { data: permissionListUnderOrganization }] =
    useLazyGetPermissionByOrganizationIdQuery();

  const [triggerApp, { data: application }] =
    useLazyApplicationUnderOrganizationQuery();

  useEffect(() => {
    trigger(selectedRow?.id);
  }, [selectedRow, trigger]);

  useEffect(() => {
    triggerPermission(organizationId);
  }, [organizationId, triggerPermission]);

  useEffect(() => {
    triggerApp({ id: organizationId, collectionQuery: undefined });
  }, [triggerApp, organizationId]);

  useEffect(() => {
    setSelectedPermission(permission);
  }, [permission]);

  useEffect(() => {
    const ids = permissionListUnderOrganization?.items.map((item) => item.id);
    const list = permissionList?.items.filter((per) => ids?.includes(per.id));
    setFilteredPermission(list);
  }, [permissionList, permissionListUnderOrganization]);

  return (
    <>
      <Box h={400}>
        <Divider mb={20} />
        <Flex justify="center" align="flex-start" direction="row" gap={'sm'}>
          <Table className={styles.table} striped withColumnBorders>
            <Table.Thead>
              <Table.Tr className={styles.row}>
                <Table.Th>Application</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {application?.items?.map((element) => (
                <Table.Tr key={element.id} className="cursor-pointer">
                  <Table.Td onClick={() => setSelectedRow(element)}>
                    {element.name}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          {
            <Table className={styles.table} striped>
              {selectedRow === undefined && (
                <Table.Th> Select application</Table.Th>
              )}
              <Table.Thead>
                <Table.Tr>
                  {selectedRow !== undefined ? (
                    <Table.Th>Permission</Table.Th>
                  ) : (
                    ''
                  )}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredPermission?.map((element) => (
                  <Table.Tr key={element.id}>
                    <Table.Td>
                      <Flex>
                        <Checkbox
                          className="mr-2 "
                          size="xs"
                          checked={selectedPermission.some(
                            (permItem) => permItem.id === element.id,
                          )}
                          onChange={() => {
                            setSelectedPermission((prev: Permission[]) => {
                              if (
                                prev.some(
                                  (permItem) => permItem.id === element.id,
                                )
                              ) {
                                return prev.filter(
                                  (permItem) => permItem.id !== element.id,
                                );
                              } else {
                                return [...prev, element];
                              }
                            });
                          }}
                        />

                        {element.name}
                      </Flex>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          }
        </Flex>
      </Box>
      <Box className="flex justify-end mt-2 mb-4">
        <Button
          onClick={() => (
            setPermission(selectedPermission), handleCloseModal()
          )}
        >
          Done
        </Button>
        <Button color="red" ml={3} onClick={() => handleCloseModal()}>
          Cancel
        </Button>
      </Box>
    </>
  );
};

export default MandatePermission;
