/* eslint-disable no-lone-blocks */
import { Button, Text } from '@mantine/core';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useState } from 'react';
import { CollectionSelectorConfig } from '../model/collection-selector-config';
import { ModalCollectionSelector } from './modal-collection-selector';
import React from 'react';
export default {
  title: 'Modal Collection Selector',
  component: ModalCollectionSelector,
} as ComponentMeta<typeof ModalCollectionSelector>;
const Template: ComponentStory<typeof ModalCollectionSelector> = (
  args: any,
) => (
  <article>
    <section className="mt-10">
      <Text className="text-2xl font-medium">Modal Collection Selector</Text>
    </section>

    <ModalCollectionSelector {...args} />
  </article>
);
const config: CollectionSelectorConfig = {
  visibleColumn: [{ key: 'name', name: 'Name', hasLocale: true }],
  title: 'Organizations',
  size: 'md',
};
const Display = () => {
  const [displayConfirm, setDisplayConfirm] = useState(false);
  <Button
    className="bg-gray-300 text-red-400"
    onClick={() => setDisplayConfirm(true)}
  >
    open selector
  </Button>;
};
const data = [
  {
    id: 'b94d7d9a-9bfe-4b2e-8560-9ec93039102a',
    platformId: '64eef0c3-4148-4e00-9adf-3bf412defbcf',
    subscriptionRoleId: '87ab59a8-8560-4529-8626-2b7b16392eb4',
    name: {
      am: 'Organization administrator',
      en: 'Organization administrator',
    },
    organizationId: '70dc1489-30bc-4cfa-854f-89ed62e18cfe',
    description: 'Roles assumed to head of organization.',
    key: 'organization_administrator',
    isDefault: true,
    rolePermissions: [],
    createdAt: '2022-12-26T12:27:42.665Z',
    createdBy: null,
    updatedAt: '2022-12-26T15:33:38.423Z',
    updatedBy: null,
    deletedAt: null,
    deletedBy: null,
  },
];
export const Page = Template.bind({});
Page.args = {
  items: data,
  total: data?.length,
  paginationChange: (skip: number, top: number) => {
    console.log(skip, top);
  },
  config: config,
  hasSort: true,
  onDone: (data: any) => {
    console.log(data);
  },
};
