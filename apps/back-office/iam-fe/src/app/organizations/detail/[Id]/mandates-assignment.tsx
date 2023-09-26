import { Button, LoadingOverlay, Table } from '@mantine/core';
import { IconDeviceFloppy, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { CollectionSelectorConfig } from '@/shared/collection-selector-config';
import ModalCollectionSelector from '@/shared/collection-selector/components/modal-collection-selector';
import { EmptyIcon, notify } from '@/shared/ui/page';
import {
  useAddOrganizationMandateMutation,
  useLazyGetOrganiationMandateQuery,
} from '@/store/api/organization/organization.api';
import { useLazyGetMandateByOrganizationIdQuery } from '@/store/api/role/role.api';
/* Component interface */
type MandateAssignmentProps = {
  MandateAssignmentModalOpened: boolean;
  setMandateAssignmentModalOpened: (visibility: boolean) => void;
};

/* Component definition */
const MandateAssignment = (props: MandateAssignmentProps) => {
  /* Component states  */
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [currentAssignedMandates, setCurrentAssignedMandates] = useState<any[]>(
    [],
  );

  /* Hooks */
  const pathname = usePathname();
  const parts = pathname.split('/');
  const idp = parts[parts.length - 1];
  const id = idp?.toString();

  const [
    triggerAssigned,
    {
      data: assignedMandate,
      isLoading: isAssignedLoading,
      isSuccess: isAssignedSuccess,
    },
  ] = useLazyGetOrganiationMandateQuery();

  const [
    triggerMandates,
    {
      data: mandates,
      isLoading: ismandateLoading,
      isSuccess: isMandateSuccess,
    },
  ] = useLazyGetMandateByOrganizationIdQuery();

  const [assignMandates, { isLoading: isAssigningMandates }] =
    useAddOrganizationMandateMutation();

  /* Variables */
  const config: CollectionSelectorConfig = {
    visibleColumn: [{ key: 'name', name: 'Mandate' }],
    title: 'Mandate',
    size: 'md',
  };

  /* Event handlers */
  const onSearch = (data: any) => {};

  const onPagination = (data) => {};

  const onDone = async (data) => {
    setCurrentAssignedMandates(data);
    setButtonDisabled(false);
  };

  const onSave = async () => {
    const dataSent = currentAssignedMandates.map((item) => {
      return {
        mandateId: item?.id,
        mandateName: item?.name,
        organizationId: id,
        isSingleAssignment: item?.isSingleAssignment,
      };
    });

    try {
      await assignMandates({ dataSent, id }).unwrap();
      setButtonDisabled(true);
      notify(
        'success',
        'Mandate has been assigned to organization successfully.',
      );
    } catch (err) {
      notify('error', 'Sorry, an error encountered while assigining mandate.');
    }
  };

  const removeMandate = (mandateId: string) => {
    setCurrentAssignedMandates(
      currentAssignedMandates.filter((item: any) => item?.id !== mandateId),
    );
    setButtonDisabled(false);
  };

  useEffect(() => {
    triggerMandates(id);
  }, [id, triggerMandates]);
  useEffect(() => {
    triggerAssigned(id);
  }, [id, triggerAssigned]);
  useEffect(() => {
    if (assignedMandate) {
      const data = assignedMandate?.organizationMandates?.map(
        (manda: any) => manda?.mandate,
      );

      setCurrentAssignedMandates(data);
    }
  }, [assignedMandate]);

  return (
    <div>
      <LoadingOverlay visible={isAssignedLoading} />
      <>
        <ModalCollectionSelector
          paginationChange={onPagination}
          onDone={onDone}
          search={onSearch}
          total={mandates?.items?.count}
          modalOpened={props.MandateAssignmentModalOpened}
          setModalOpened={(visibility: boolean) =>
            props.setMandateAssignmentModalOpened(visibility)
          }
          itemsLoading={ismandateLoading}
          items={mandates?.items}
          config={config}
          buttonLoading={isAssigningMandates}
          selectedRows={currentAssignedMandates}
        />

        {currentAssignedMandates?.length == 0 && (
          <>
            <EmptyIcon />
          </>
        )}

        {currentAssignedMandates?.length > 0 && (
          <>
            <Table className="my-4">
              <thead>
                <tr className="bg-gray-200">
                  <th>Name</th>
                  <th className="flex justify-end">Action</th>
                </tr>
              </thead>
              <tbody className="border-b">
                {currentAssignedMandates?.map((item: any) => (
                  <tr key={item.id}>
                    <td>{item.name} </td>

                    <td className="flex justify-end">
                      <Button
                        size="xs"
                        color={'red'}
                        type="button"
                        className="bg-danger p-1"
                        onClick={() => removeMandate(item.id)}
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
          loading={isAssigningMandates}
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

export default MandateAssignment;
