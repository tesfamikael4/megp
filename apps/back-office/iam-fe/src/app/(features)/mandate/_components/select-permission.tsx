// TableComponent.jsx
import React, { useEffect, useState } from 'react';
import { useLazyListByAppIdQuery } from '../../applications/_api/permission.api';
import { useLazyListQuery } from '../../applications/_api/application.api';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  ScrollArea,
  Table,
} from '@mantine/core';
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
  const [trigger, { data: permissionList, isLoading }] =
    useLazyListByAppIdQuery();

  const [isCheckAll, setIsCheckAll] = useState<boolean>(false);

  const [triggerApp, { data: application }] = useLazyListQuery();

  const checkAll = (event: any) => {
    if (event.target.checked) {
      setSelectedPermission(permissionList?.items);
      setIsCheckAll(true);
    } else {
      setSelectedPermission([]);
      setIsCheckAll(false);
    }
  };

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
      <Flex className="">
        <Box className="border-t-2 w-2/5  ">
          <Table className={styles.table} striped withColumnBorders>
            <Table.Thead>
              <Table.Tr className={styles.row}>
                <Table.Th className="font-bold  text-lg">Application</Table.Th>
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
        </Box>

        <Box className={'border-l-2 pl-2 w-3/5'}>
          {
            <Table className={styles.table} striped>
              {selectedRow === undefined && (
                <Table.Th className="font-bold  text-lg">
                  {' '}
                  Select Application
                </Table.Th>
              )}

              <Table.Thead>
                <Table.Tr>
                  {selectedRow !== undefined ? (
                    <Table.Th className="font-bold text-lg flex">
                      <Checkbox
                        size="xs"
                        className="mr-2 mt-2 "
                        checked={isCheckAll}
                        onChange={(event) => checkAll(event)}
                      />
                      Permission
                    </Table.Th>
                  ) : (
                    ''
                  )}
                </Table.Tr>
              </Table.Thead>
              <ScrollArea w={500} h={400} scrollbars="y">
                <Table.Tbody>
                  <LoadingOverlay visible={isLoading} />

                  {permissionList?.items?.map((element) => (
                    <Table.Tr key={element.id}>
                      <Table.Td>
                        <Flex>
                          <Checkbox
                            key={element.id}
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
              </ScrollArea>
            </Table>
          }
        </Box>
      </Flex>
      <Divider mb={20} />

      <Group justify="end" mt={'lg'} mb={'lg'}>
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
      </Group>
    </>
  );
};

export default MandatePermission;
