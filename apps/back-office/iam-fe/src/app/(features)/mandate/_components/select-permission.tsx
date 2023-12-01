// TableComponent.jsx
import React, { useEffect, useState } from 'react';
import { useLazyListByAppIdQuery } from '../../applications/_api/permission.api';
import { useLazyListQuery } from '../../applications/_api/application.api';
import { Box, Button, Checkbox, Divider, Flex, Table } from '@mantine/core';
import styles from '../../../page.module.scss';
import { Permission } from '@/models/permission';

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

  const [trigger, { data: permissionList }] = useLazyListByAppIdQuery();

  const [triggerApp, { data: application }] = useLazyListQuery();

  useEffect(() => {
    trigger(selectedRow?.id);
  }, [selectedRow, trigger]);

  useEffect(() => {
    triggerApp({});
  }, [triggerApp]);

  useEffect(() => {
    setSelectedPermission(permission);
  }, [permission]);

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
                <Table.Tr key={element.id}>
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
                {permissionList?.items?.map((element) => (
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
