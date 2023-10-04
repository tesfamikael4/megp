/* eslint-disable no-prototype-builtins */
import React from 'react';
import { Flex, Group, SimpleGrid, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
// Sample user data

interface RenderAddCardProps {
  index: number;
  value: any;
  type: string;
}
interface CardViewProps {
  formConfig: {
    form: any;
    dataLocation: string;
    title: string;
  };
  renderAddCard: (
    openModal: ({ value, index }: RenderAddCardProps) => void,
  ) => React.ReactNode;
  renderCardList: (openModal: any) => React.ReactNode;
  renderModalForm: (index: number) => React.ReactNode;
  renderModalFormSaveButton: (validateModalForm: () => any) => React.ReactNode;
  renderModalFormRemoveButton: (
    index: number,
    close: () => void,
    type: string,
  ) => React.ReactNode;
}
const CardList: React.FC<CardViewProps> = ({
  formConfig,
  renderAddCard,
  renderCardList,
  renderModalForm,
  renderModalFormSaveButton,
  renderModalFormRemoveButton,
}) => {
  const [selectedData, setSelectedData] = React.useState<{
    value: any;
    index: number;
    type: string;
  }>({
    value: '',
    index: -1,
    type: '',
  });

  const [opened, { open, close }] = useDisclosure(false);
  const openModal = ({
    value,
    index,
    type,
  }: {
    value: any;
    index: number;
    type: string;
  }) => {
    setSelectedData({ value, index, type });
    open();
  };
  const closeModal = () => {
    if (selectedData.type === 'new') {
      close();
      formConfig.form.removeListItem(
        formConfig.dataLocation,
        selectedData.index,
      );
      setSelectedData({
        value: '',
        index: -1,
        type: '',
      });
    } else {
      close();
      formConfig.form.validate(
        `${formConfig.dataLocation}.${selectedData?.index}`,
      ).hasErrors;
    }
  };
  let error = false;

  const validateModalForm = () => {
    let nestedValue = formConfig.form.values;

    for (const prop of formConfig.dataLocation.split('.')) {
      if (nestedValue.hasOwnProperty(prop)) {
        nestedValue = nestedValue[prop];
      } else {
        // Handle the case where the property doesn't exist
        nestedValue = undefined;
        break;
      }
    }

    if (nestedValue && Array.isArray(nestedValue) && nestedValue.length > 0) {
      const firstObject = nestedValue[0];

      // Loop through all properties of the first object
      for (const prop in firstObject) {
        if (firstObject.hasOwnProperty(prop)) {
          const fieldToValidate = `${formConfig.dataLocation}.${selectedData?.index}.${prop}`;
          const isFieldValid = formConfig.form.isValid(fieldToValidate);

          if (!isFieldValid) {
            // Set an error message for the field
            formConfig.form.setFieldError(fieldToValidate);
            error = true;
          }
        }
      }
    }
    !error && close();
  };
  return (
    <Flex>
      <SimpleGrid
        cols={{ base: 3, sm: 1, xs: 1, md: 3, lg: 3 }}
        spacing={{ base: 'md', sm: 'sm', xs: 'sm', md: 'md' }}
        verticalSpacing={{ base: 'md', sm: 'md' }}
      >
        {renderAddCard(openModal)}
        {renderCardList(openModal)}
      </SimpleGrid>
      <Modal
        title={formConfig.title}
        onClose={closeModal}
        opened={opened}
        size="lg"
        padding="lg"
      >
        {renderModalForm(selectedData.index)}

        <Group mt={'md'} className="mt-6 justify-end">
          {renderModalFormSaveButton(validateModalForm)}
          {renderModalFormRemoveButton(
            selectedData.index,
            close,
            selectedData.type,
          )}
        </Group>
      </Modal>
    </Flex>
  );
};
export default CardList;
