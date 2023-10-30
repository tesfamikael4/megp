import React from 'react';
import { TextInput, Flex } from '@mantine/core';
import { IconMenu, IconPencil, IconTrash } from '@tabler/icons-react';
import CardList from '../../../../_components/cardList';
import ActionMenu from '../../../../_components/actionMenu';
import { PassFormDataProps } from './formShell';

interface Props extends Partial<PassFormDataProps> {
  itemSchema: any;
  name: string;
}
export const ContactPersons: React.FC<Props> = ({
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
          email: '',
          mobileNumber: '',
        }}
        title="Contact Persons"
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
                  <TextInput
                    className="w-full"
                    label="Email"
                    placeholder="Enter email"
                    required
                    {...getInputProps('email')}
                  />
                </Flex>
                <Flex className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 items-center justify-center flex-col p-3">
                  <TextInput
                    className="w-full"
                    label="Phone Number"
                    placeholder="Enter phone number"
                    {...getInputProps('mobileNumber')}
                  />
                </Flex>
              </Flex>
            </Flex>
          </>
        )}
        card={(edit, remove) => (
          <>
            {control?._formValues?.contactPersons.map(
              (value: any, index: number) => (
                <Flex
                  key={index}
                  className="sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 items-center justify-center p-3"
                >
                  <Flex className="flex-col border w-56 h-40 shadow-md justify-between">
                    <Flex className="flex-col p-3 gap-1">
                      <div className=" text-lg font-[600]  truncate">
                        {value.firstName} {value.lastName}
                      </div>
                      <div className=" text-xs truncate ml-1">
                        Email: {value.email}
                      </div>

                      <div className=" text-xs  mb-[1rem] ml-1 truncate">
                        Phone: {value.mobileNumber}
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
