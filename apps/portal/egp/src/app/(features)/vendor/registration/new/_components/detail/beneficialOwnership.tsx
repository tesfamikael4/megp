import React from 'react';
import {
  ActionIcon,
  Button,
  Card,
  Flex,
  Text,
  TextInput,
  Group,
} from '@mantine/core';
import { Select } from '@mantine/core';

import { IconMenu, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { randomId } from '@mantine/hooks';
import { PassFormDataProps } from './formShell';
import CardList from '../../../../_components/cardList';
import ActionMenu from '../../../../_components/actionMenu';
import { nationalityOptions } from '../mockup/nationality';

interface Props extends Partial<PassFormDataProps> {
  itemSchema: any;
  name: string;
}
export const BeneficialOwnership: React.FC<Props> = ({
  control,
  itemSchema,
  name,
}) => {
  return (
    <>
      <CardList
        name={name}
        control={control}
        initialValues={{
          firstName: '',
          lastName: '',
          nationality: '',
        }}
        title="Beneficial Ownership List"
        itemSchema={itemSchema}
        modalBody={(getInputProps) => (
          <>
            <Flex className="p-4 flex-col">
              <Flex className="flex-wrap">
                <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
                  <TextInput
                    className="w-full"
                    label="First Name"
                    placeholder="Enter first name"
                    required
                    {...getInputProps('firstName')}
                  />
                </Flex>
                <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
                  <TextInput
                    className="w-full"
                    label="Last Name"
                    placeholder="Enter last name"
                    required
                    {...getInputProps('lastName')}
                  />
                </Flex>
                <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
                  <Select
                    className="w-full"
                    label="Nationality"
                    searchable
                    data={nationalityOptions}
                    {...getInputProps('nationality', 'select')}
                  />
                </Flex>
              </Flex>
            </Flex>
          </>
        )}
        card={(edit, remove) => (
          <>
            {control?._formValues?.beneficialOwnership.map(
              (value: any, index: number) => (
                <Flex
                  key={index}
                  className="sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 items-center justify-center p-3"
                >
                  <Flex className="flex-col border w-56 h-40 shadow-md justify-between">
                    <Flex className="flex-col p-4">
                      <div className=" text-lg font-[600]  truncate">
                        {value.firstName} {value.lastName}
                      </div>
                      <div className=" text-sm truncate ml-2">
                        Nationality: {value.nationality}
                      </div>
                    </Flex>

                    <Flex className=" justify-end border-t p-1">
                      <ActionMenu
                        renderOpenButton={() => <IconMenu size={'1rem'} />}
                        data={[
                          {
                            label: 'Edit',
                            action: () => edit(index),
                            icon: <IconPencil size={'1rem'} />,
                          },
                          {
                            label: 'Delete',
                            action: () => remove(index),
                            icon: <IconTrash size={'1rem'} color="red" />,
                          },
                        ]}
                      />
                    </Flex>
                  </Flex>
                </Flex>
              ),
            )}
          </>
        )}
      />
    </>
  );
};
