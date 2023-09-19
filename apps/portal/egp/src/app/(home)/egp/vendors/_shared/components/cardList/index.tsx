import React from 'react';
import { Flex, Group, SimpleGrid, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
// Sample user data

interface RenderAddCardProps {
  index: number;
  value: any;
}
interface CardViewProps {
  formConfig: {
    form: any;
    dataLocation: string;
    schema: any;
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
  }>({
    value: '',
    index: -1,
  });

  const [opened, { open, close }] = useDisclosure(false);
  const openModal = ({ value, index }: { value: any; index: number }) => {
    setSelectedData({ value, index });
    open();
  };
  const closeModal = () => {
    close();
    formConfig.form.validate(
      `${formConfig.dataLocation}.${selectedData?.index}`,
    ).hasErrors &&
      formConfig.form.removeListItem(
        formConfig.dataLocation,
        selectedData.index,
      );
    setSelectedData({
      value: '',
      index: -1,
    });
  };

  // const validateModalForm = () =>
  //   !formConfig.form.validate(
  //     `${formConfig.dataLocation}.${selectedData?.index}`,
  //   ).hasErrors && close();
  const validateModalForm = () => {
    //   formConfig.form.setFieldError(
    //     `${formConfig.dataLocation}.${selectedData?.index}.email`,
    //     'Invalid email',
    //   );

    // console.log(
    //   formConfig.form.isValid(
    //     `${formConfig.dataLocation}.${selectedData?.index}.email`,
    //   ),
    // );
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

    console.log(nestedValue);
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
          }
        }
      }
    }
  };
  return (
    <Flex align={'center'} justify={'center'}>
      <SimpleGrid
        cols={4}
        spacing="lg"
        breakpoints={[
          { maxWidth: 'md', cols: 3, spacing: 'md' },
          { maxWidth: 'sm', cols: 2, spacing: 'sm' },
          { maxWidth: 'xs', cols: 1, spacing: 'sm' },
        ]}
      >
        {renderAddCard(openModal)}
        {renderCardList(openModal)}
      </SimpleGrid>
      <Modal
        title="Add New User"
        onClose={closeModal}
        opened={opened}
        size="sm"
        padding="lg"
      >
        {renderModalForm(selectedData.index)}

        <Group mt={'md'} position={'right'}>
          {renderModalFormSaveButton(validateModalForm)}
          {renderModalFormRemoveButton(selectedData.index, close)}
        </Group>
      </Modal>
    </Flex>
  );
};
export default CardList;
