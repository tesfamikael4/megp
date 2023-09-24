import { Button, Text } from '@mantine/core';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';
import { useState } from 'react';
import { DeleteConfirmationModal } from './delete-confirmation';
export default {
  title: 'Delete Confirmation Modal',
  component: DeleteConfirmationModal,
} as ComponentMeta<typeof DeleteConfirmationModal>;
const Template: ComponentStory<typeof DeleteConfirmationModal> = (
  args: any,
) => (
  <article>
    <section className="mt-10">
      <Text className="text-2xl font-medium">Delete Confirmation Modal</Text>
    </section>

    <DeleteConfirmationModal {...args} />
  </article>
);

const Display = () => {
  const [displayConfirm, setDisplayConfirm] = useState(false);
  <DeleteConfirmationModal
    isModalOpened={displayConfirm}
    isModalClosed={setDisplayConfirm(false)}
    modalTitle={'Delete Service'}
    confirm_message={'Are you Sure to Delete This Item?'}
  />;
  <Button className="bg-primary" onClick={() => setDisplayConfirm(true)}>
    show Confirmation
  </Button>;
};

export const Page = Template.bind({});

Page.args = {
  color: 'red',
};
