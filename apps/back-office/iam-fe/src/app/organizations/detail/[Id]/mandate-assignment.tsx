import { CollectionQuery } from '@/shared/core/models/collection.model';
import { Button, Card, Table } from '@mantine/core';
import { IconDeviceFloppy, IconPlus, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

import EmptyState from '@/shared/ui/empty';
import {
  useAddOrganizationMandateMutation,
  useLazyGetOrganiationMandateAssignedQuery,
} from '@/store/api/organization/organization.api';
import MandateSelector from './mandate-selector';
import { usePathname } from 'next/navigation';
import { notify } from '@/shared/ui/page';

function OrganizationMandateList({ collapsed }) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [opened, setOpened] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const pathname = usePathname();
  const parts = pathname.split('/');
  const idp = parts[parts.length - 1];
  const id = idp?.toString();

  const [AddOrganizationMandate, { isLoading: updating, data: organization }] =
    useAddOrganizationMandateMutation();

  const [
    getSubscriberMandate,
    { data: mandates, isLoading: itemsLoading, isSuccess },
  ] = useLazyGetOrganiationMandateAssignedQuery();

  const pagination = (data) => {
    setCollectionQuery({ ...collectionQuery, skip: data.skip, top: data.top });
  };

  const filter = (data) => {
    setCollectionQuery({ ...collectionQuery, filter: data });
  };

  const search = (data) => {
    setCollectionQuery({ ...collectionQuery, search: data });
  };

  const onSave = async () => {
    const dataSent = selectedRows.map((item) => {
      return {
        mandateId: item?.id,
        mandateName: item?.name,
        organizationId: '238e0457-a2f9-4521-a0c1-f9ec3f537aef',
        isSingleAssignment: item?.isSingleAssignment,
      };
    });

    try {
      await AddOrganizationMandate({ dataSent, id });
      notify('success', 'Mandate Assigned  successfully');
    } catch (err) {
      notify('error', 'errors in Assigning  mandate');
    }
  };
  const [collectionQuery, setCollectionQuery] = useState<CollectionQuery>({
    filter: [],
    skip: 0,
    top: 10,
  });

  useEffect(() => {
    if (!isCollapsed) getSubscriberMandate(id);
  }, [isCollapsed, id, getSubscriberMandate]);

  useEffect(() => {
    // setSelectedRows(mandates ? mandates?.organizationMandates?.mandate : []);
    if (isSuccess) {
      const mandate = mandates
        ? mandates?.organizationMandates?.map((org: any) => {
            return org?.mandate;
          })
        : [];
      setSelectedRows(mandate);
    }
  }, [isSuccess, mandates]);

  const onDone = (data: any[]) => {
    setOpened(false);

    setSelectedRows(data);
  };
  const onModalOpen = (
    <MandateSelector
      onDone={onDone}
      onCancel={() => setOpened(false)}
      isOpened={opened}
      openModal={() => setOpened(false)}
      selectedRows={[...selectedRows]}
    />
  );

  console.log(selectedRows);

  return (
    <Card className="mt-4 ml-2">
      <Card.Section className="-mb-4  border-b border-gray-200 p-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-base font-semibold">
              Organizational Mandate Assignment
            </div>

            <div className="text-[14px] font-light">
              List of Assigned organizational Mandates
            </div>
          </div>
          <div className="flex gap-4">
            {!isCollapsed && (
              <Button
                className="bg-primary"
                size="xs"
                onClick={() => setOpened(true)}
              >
                <IconPlus size={18} /> Add
              </Button>
            )}
            <Button
              variant="outline"
              color="dark"
              size="xs"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {!isCollapsed ? 'collapse' : 'expand'}
            </Button>
          </div>
        </div>
      </Card.Section>
      {!isCollapsed && (
        <Card.Section className="mt-8">
          <Table>
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Name </th>
                <th style={{ width: '40%' }}>Key </th>
                <th>Actions </th>
              </tr>
            </thead>
            <tbody>
              {selectedRows &&
                isSuccess &&
                selectedRows.map((row: any) => {
                  return (
                    <tr key={row?.id}>
                      <td>{row?.name}</td>
                      <td>{row?.key}</td>
                      <td>
                        <Button
                          className=" bg-red-600 hover:bg-red-800 "
                          size="xs"
                          compact
                          onClick={() => {
                            setSelectedRows(
                              selectedRows.filter((x) => x.id !== row.id),
                            );
                          }}
                        >
                          <IconTrash size={16} />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
          {!selectedRows.length && <EmptyState />}
          <div className="mt-4 ml-4 mb-2">
            <Button
              onClick={onSave}
              type="submit"
              className="bg-primary"
              loading={updating}
              leftIcon={<IconDeviceFloppy size={18} />}
              size="xs"
              disabled={!selectedRows.length}
            >
              Save
            </Button>
          </div>
        </Card.Section>
      )}
      {opened && onModalOpen}
    </Card>
  );
}

export default OrganizationMandateList;
