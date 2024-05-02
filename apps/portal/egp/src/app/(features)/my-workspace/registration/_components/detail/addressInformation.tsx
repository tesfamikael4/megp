import { Group, Select, Stack, TextInput } from '@mantine/core';
import React, { useEffect } from 'react';
import { PassFormDataProps } from './formShell';
import { malawianDistricts } from '../../_constants';
import {
  useGetRegionsQuery,
  useLazyGetDistrictsByRegionQuery,
} from '@/store/api/administrationApi';
import { NotificationService } from '../../../_components/notification';

export const AddressInformation: React.FC<PassFormDataProps> = ({
  register,
  control,
}) => {
  const { data: regions, isError } = useGetRegionsQuery({});
  const [fetchDistricts, { data: districts, isError: isDistrictError }] =
    useLazyGetDistrictsByRegionQuery();

  useEffect(() => {
    if (!regions && isError)
      NotificationService.requestErrorNotification('Can not fetch regions');
    if (
      register(`address.region`, 'select').value &&
      !districts &&
      isDistrictError
    )
      NotificationService.requestErrorNotification('Can not fetch districts');
  }, [districts, regions, register(`address.region`, 'select').value]);

  useEffect(() => {
    if (control._getWatch(`basic.countryOfRegistration`) === 'Malawi') {
      const value = control._getWatch(`address.region`);
      const region = regions.items.find((_region) => _region.name === value);
      fetchDistricts({ regionId: region.id });
    }
  }, [
    control._getWatch(`address.region`),
    control._getWatch(`basic.countryOfRegistration`),
  ]);

  return (
    <Stack>
      <Group grow>
        <TextInput
          label={`Physical Address ${register(`basic.countryOfRegistration`, 'select').value === 'Malawi' ? '(from MBRS)' : ''}`}
          withAsterisk
          {...register(`address.physicalAddress`)}
          disabled={
            register('basic.countryOfRegistration', 'select').value === 'Malawi'
          }
        />
        <TextInput
          label="Primary Email"
          withAsterisk
          {...register(`address.primaryEmail`)}
        />
      </Group>
      {register(`basic.countryOfRegistration`, 'select').value === 'Malawi' && (
        <Group grow>
          <Select
            withAsterisk
            label="Region"
            data={
              regions && regions.items
                ? regions.items.map((region) => region.name)
                : []
            }
            placeholder="Select region"
            {...register(`address.region`, 'select')}
            onChange={(value) => {
              if (value) {
                register(`address.region`, 'select').onChange(value);
                const region = regions.items.find(
                  (_region) => _region.name === value,
                );
                fetchDistricts({ regionId: region.id });
              }
            }}
          />
          <Select
            withAsterisk
            label="Districts"
            data={
              districts && districts.items
                ? districts.items.map((district) => district.name)
                : []
            }
            placeholder="Select district"
            {...register(`address.district`, 'select')}
            disabled={!register(`address.region`, 'select').value}
          />
        </Group>
      )}
      <Group grow>
        <TextInput
          label="Alternate Email"
          {...register(`address.alternateEmail`)}
        />
        <TextInput
          label="Telephone"
          {...register(`address.telephone`)}
          withAsterisk
        />
      </Group>
      <Group grow>
        <TextInput
          label={`Postal Address/Zip code ${register(`basic.countryOfRegistration`, 'select').value === 'Malawi' ? '(from MBRS)' : ''}`}
          withAsterisk
          {...register(`address.postalAddress`)}
          disabled={
            register('basic.countryOfRegistration', 'select').value === 'Malawi'
          }
        />
        <TextInput label="Fax" {...register(`address.fax`)} />
      </Group>
      <Group grow>
        <TextInput label="Website" {...register(`address.website`)} />
      </Group>
    </Stack>
  );
};
