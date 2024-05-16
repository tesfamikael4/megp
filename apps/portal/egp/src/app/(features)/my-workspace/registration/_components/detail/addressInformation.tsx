import { Flex, Group, Select, Stack, Text, TextInput } from '@mantine/core';
import React, { useEffect } from 'react';
import { PassFormDataProps } from './formShell';
import { malawianDistricts } from '../../_constants';
import {
  useGetRegionsQuery,
  useLazyGetDistrictsByRegionQuery,
} from '@/store/api/administrationApi';
import { NotificationService } from '../../../_components/notification';
import { Controller } from 'react-hook-form';
import { IconInfoCircle } from '@tabler/icons-react';

export const AddressInformation: React.FC<PassFormDataProps> = ({
  register,
  control,
}) => {
  const { data: regions, isError, isFetching } = useGetRegionsQuery({});
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

  const value = control._getWatch(`address.region`);
  useEffect(() => {
    if (
      register(`basic.countryOfRegistration`, 'select').value === 'Malawi' &&
      !isFetching
    ) {
      const region = (regions ? regions.items : []).find(
        (_region) => _region.name === value,
      );
      if (region?.id) fetchDistricts({ regionId: region.id });
    }
  }, [value, isFetching]);

  return (
    <Stack>
      <Group grow>
        <TextInput
          label={
            <Flex>
              Physical Address <Text c="red">*</Text>
              {register(`basic.countryOfRegistration`, 'select').value ===
              'Malawi' ? (
                <Text title="From MBRS">
                  <IconInfoCircle
                    color="blue"
                    stroke={1.5}
                    style={{ marginLeft: '5px' }}
                  />
                </Text>
              ) : (
                ''
              )}
            </Flex>
          }
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
          <Controller
            name="address.district"
            control={control}
            render={({ field }) => {
              return (
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
                  onChange={field.onChange}
                  disabled={!register(`address.region`, 'select').value}
                />
              );
            }}
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
          label={
            <Flex>
              Postal Address/Zip code <Text c="red">*</Text>
              {register(`basic.countryOfRegistration`, 'select').value ===
              'Malawi' ? (
                <Text title="From MBRS">
                  <IconInfoCircle
                    color="blue"
                    stroke={1.5}
                    style={{ marginLeft: '5px' }}
                  />
                </Text>
              ) : (
                ''
              )}
            </Flex>
          }
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
