import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Divider, Textarea, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import DeleteConfirmationModal from '@/shared/confirmation';
import * as Icon from '@tabler/icons-react';
import Style from './organizationDetailForm.module.scss';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { Select, Card } from '@mantine/core';
import {
  useLazyGetOrganizationByIdQuery,
  useAddOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
} from '@/store/api/organization/organization.api';
import { useLazyGetOrganizationTypeQuery } from '@/store/api/lookUps/lookups.api';
import { useLazyGetOrganizationSectorsQuery } from '@/store/api/orgSector/orgSector.api';

import { notify } from '@/shared/ui/notification/utility/notify';

/* Form schema */

type Organization = {
  name: string;
  typeId?: string;
  code?: string | null;
  sectorId?: string;
  shortName?: string;
  description: string;
};

/* Component props type */
type OrganizationDetailFormProps = {
  mode: 'new' | 'update';
};

/* Component definition */
const OrganizationDetailForm = (props: OrganizationDetailFormProps) => {
  /* Router hooks */
  const router = useRouter();
  const pathname = usePathname();
  const parts = pathname?.split('/');
  const id = parts && parts[parts?.length - 1];

  /* Hooks */

  const organizationSchema: ZodType<Organization> = z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    typeId: z.string(),
    code: z.string().optional().nullable(),

    sectorId: z.string(),
    shortName: z.string().min(1, { message: 'This field is required' }),
    description: z.string().min(1, { message: 'This field is required' }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<Organization>({ resolver: zodResolver(organizationSchema) });

  /* Component states */

  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);

  const [triggerOrgType, { data: orgType, isLoading: isTypeLoading }] =
    useLazyGetOrganizationTypeQuery();
  const [triggerOrgSector, { data: orgSector, isLoading: isSectorLoading }] =
    useLazyGetOrganizationSectorsQuery();

  const [
    trigger,
    {
      data: organization,
      isLoading: isFetchedOrganizationLoading,
      isSuccess: isFetchedOrganizationSuccess,
    },
  ] = useLazyGetOrganizationByIdQuery();

  const [
    createOrganization,
    { isLoading: isCreating, isSuccess: isCreatedSuccessfully },
  ] = useAddOrganizationMutation();
  const [
    updateOrganization,
    { isLoading: isUpdating, isSuccess: isUpdatedSuccessfully },
  ] = useUpdateOrganizationMutation();
  const [
    deleteOrganization,
    { isLoading: isDeleting, isSuccess: isDeletedSuccessfully },
  ] = useDeleteOrganizationMutation();

  const handleCreate = async (data: any) => {
    const DataSent = {
      name: data.name,
      type: data.type,
      sector: data.sector,
      shortName: data.shortName,
      description: data.description,
      typeId: data?.typeId,
      sectorId: data?.sectorId,
    };
    try {
      const response = await createOrganization(DataSent).unwrap();
      notify('success', 'organization created successfully');
      await router.push(`/organizations/detail/${response.id}`);
    } catch (err) {
      notify('error', 'errors in creating organization');
    }
  };

  const handleUpdate = async (data: any) => {
    const DataSent = {
      name: data.name,
      shortName: data.shortName,
      description: data.description,
      typeId: data?.typeId,
      sectorId: data?.sectorId,
    };

    try {
      await updateOrganization({ ...DataSent, id: id?.toString() });
      notify('success', 'organization updating successfully');
    } catch (err) {
      notify('error', 'errors in updating organization');
    }
  };

  const handleActivation = async () => {
    if (organization) {
      const DataSent = {
        ...organization,
        isActive: organization?.isActive ? false : true,
      };

      try {
        await updateOrganization({ ...DataSent });
        notify('success', 'organization updating successfully');
      } catch (err) {
        notify('error', 'errors in updating organization');
      }
    }
  };

  const submitDelete = async () => {
    try {
      await deleteOrganization(id?.toString()).unwrap();

      router.push('/organizations');
    } catch (err) {
      notify('error', 'errors in deleting organization');
    }
    setDisplayConfirmationModal(false);
  };

  /*Show delete modal when delete button is clicked */
  const showDeleteModal = () => {
    setDisplayConfirmationModal(true);
  };
  // close delete modal after an item is deleted */
  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  /* Event handlers */
  const onSubmit = async (data: any) => {
    props?.mode === 'new' ? handleCreate(data) : handleUpdate(data);
  };

  useEffect(() => {
    if (props.mode == 'update') {
      trigger(id?.toString());
    }
  }, [id, props.mode, trigger]);

  useEffect(() => {
    if (
      props.mode === 'update' &&
      isFetchedOrganizationSuccess &&
      organization !== undefined
    ) {
      reset({
        name: organization?.name,
        code: organization?.code,
        shortName: organization?.shortName,
        description: organization?.description,
        typeId: organization?.typeId,
        sectorId: organization?.sectorId,
      });
    }
  }, [isFetchedOrganizationSuccess, organization, props.mode, reset]);
  /*  */
  useEffect(() => {
    triggerOrgType(true);
  }, [triggerOrgType]);

  useEffect(() => {
    triggerOrgSector(true);
  }, [triggerOrgSector]);

  return (
    <Card className="ml-2">
      <Card.Section className={Style.Section}></Card.Section>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="my-4">
          <TextInput
            placeholder={'Name'}
            label="Name"
            error={errors?.name ? errors?.name?.message?.toString() : ''}
            required
            {...register('name')}
          />
        </div>

        <Divider className="mt-2" />

        <div className="my-4">
          <TextInput
            placeholder={'shortName'}
            label="Short name"
            error={
              errors?.shortName ? errors?.shortName?.message?.toString() : ''
            }
            required
            {...register('shortName')}
          />
        </div>

        <Divider className="mt-2" />

        <div className="my-4">
          <Textarea
            placeholder={'description'}
            label="Description"
            error={
              errors?.description
                ? errors?.description?.message?.toString()
                : ''
            }
            {...register('description')}
          />
        </div>

        <Divider className="mt-2" />

        <div className="my-4">
          <Controller
            name="typeId"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                label="Organization Type"
                value={value}
                onChange={onChange}
                data={
                  orgType?.items?.map((type) => ({
                    value: type?.id,
                    label: type?.name,
                  })) || []
                }
              />
            )}
          />
        </div>
        <Divider className="mt-2" />

        <div className="my-4">
          <Controller
            name="sectorId"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                label="Organization Sector"
                value={value}
                onChange={onChange}
                data={
                  orgSector?.items?.map((type) => ({
                    value: type?.id,
                    label: type?.name,
                  })) || []
                }
              />
            )}
          />
        </div>
        <Divider className="mt-2" />

        <div className="my-4">
          <TextInput
            label={'External Organization Code'}
            placeholder={'Code'}
            disabled
            {...register('code')}
          />
        </div>
        <Divider className="mt-2 " />

        {props.mode == 'new' && (
          <div className="mt-4 ">
            <Button type="submit" size="xs">
              <Icon.IconDeviceFloppy size={18} />
              Save
            </Button>
          </div>
        )}

        {props.mode == 'update' && (
          <div className={Style.flexdisplay}>
            <>
              <Button
                type="submit"
                size="xs"
                className={Style.buttonprimary}
                leftIcon={
                  <Icon.IconDeviceFloppy
                    size={18}
                    className="active-icon mr-1"
                  />
                }
              >
                Update
              </Button>

              <Button
                type="button"
                size="xs"
                className={Style.buttonprimary}
                leftIcon={
                  <Icon.IconToggleLeft size={18} className="active-icon mr-1" />
                }
                onClick={() => handleActivation()}
              >
                {organization?.isActive ? 'Deactivate' : 'Activate'}
              </Button>

              <Button
                type="button"
                color="red"
                className={Style.buttonprimary}
                component="button"
                onClick={showDeleteModal}
                size="xs"
              >
                <Icon.IconTrash size="18" className="mr-1" />
                Delete
              </Button>
            </>
          </div>
        )}
      </form>
      <DeleteConfirmationModal
        isModalOpened={displayConfirmationModal}
        confirmModal={submitDelete}
        isModalClosed={hideConfirmationModal}
        id={id?.toString()}
        isConfirmLoading={isDeleting}
        modalTitle={'Delete Organization'}
        confirm_message={'Are you Sure to Delete This Organization ?'}
      />
    </Card>
  );
};

export default OrganizationDetailForm;
