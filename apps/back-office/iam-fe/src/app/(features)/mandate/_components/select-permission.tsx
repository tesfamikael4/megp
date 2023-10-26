// TableComponent.jsx
import React, { useEffect, useState } from 'react';
import { useLazyListByIdQuery } from '../../applications/_api/permission.api';
import { useLazyListQuery } from '../../applications/_api/application.api';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  List,
  Title,
} from '@mantine/core';

import { logger } from '@megp/core-fe';
import { Permission } from '@/models/permission';

interface EntityListProps {
  permission: Permission[];
  setPermission: (arg) => void;
  setIsModalOpen: (boolean) => void;
}

const MandatePermission = ({
  permission,
  setPermission,
  setIsModalOpen,
}: EntityListProps) => {
  const [selectedRow, setSelectedRow] = useState<any>();

  const [trigger, { data: permissionList }] = useLazyListByIdQuery();

  const [triggerApp, { data: application }] = useLazyListQuery();

  useEffect(() => {
    trigger(selectedRow?.id);
  }, [selectedRow, trigger]);

  useEffect(() => {
    triggerApp();
  }, [triggerApp]);

  useEffect(() => {
    setSelectedRow(application?.items[0]);
  }, [application?.items]);
  logger.log(permission);
  return (
    <>
      <Divider my={'sm'} />
      <Flex gap="xl" justify="center" align="flex-start" direction="row">
        <Box>
          <Title size="h4">Application</Title>

          <List spacing="xs" size="sm" center my={'sm'} mx={'xg'}>
            {application?.items?.map((item) => (
              <List.Item
                key={item.id}
                className="cursoyyr-pointer"
                icon={
                  <Checkbox
                    color="teal"
                    onChange={() => setSelectedRow(item)}
                    checked={item.id == selectedRow?.id}
                  ></Checkbox>
                }
              >
                {item.name}
              </List.Item>
            ))}
          </List>
        </Box>
        <Box>
          <Title size="h4">
            {' '}
            {permissionList?.items?.length !== 0 ? 'Permission' : ''}
          </Title>
          <List spacing="xs" size="sm" center my={'sm'}>
            {permissionList?.items?.map((item) => (
              <List.Item
                key={item.id}
                className="cursor-pointer"
                icon={
                  <Checkbox
                    color="teal"
                    checked={permission.some(
                      (permItem) => permItem.id === item.id,
                    )}
                    onChange={() => {
                      setPermission((prev: Permission[]) => {
                        if (prev.some((permItem) => permItem.id === item.id)) {
                          return prev.filter(
                            (permItem) => permItem.id !== item.id,
                          );
                        } else {
                          return [...prev, item];
                        }
                      });
                    }}
                  />
                }
              >
                {item.name}
              </List.Item>
            ))}
          </List>
        </Box>
      </Flex>
      <Divider my={'lg'} />
      <Button onClick={() => setIsModalOpen(false)}>Done</Button>
    </>
  );
};

export default MandatePermission;
