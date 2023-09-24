import { Button, Text } from '@mantine/core';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';
import CollapsibleCard from './card';
export default {
  title: 'Collapsible Card',
  component: CollapsibleCard,
} as ComponentMeta<typeof CollapsibleCard>;
const Template: ComponentStory<typeof CollapsibleCard> = (args: any) => (
  <article>
    <section className="mt-10">
      <Text className="text-2xl font-medium">Collapsible Card</Text>
    </section>

    <CollapsibleCard {...args} />
  </article>
);

export const Page = Template.bind({});
Page.args = {
  dropped: true,
  className: 'bg-teal-100',
  title: 'Card Test',
  subTitle: 'story book card test',
  children: (
    <Button className="h-100vh mt-12 mb-10 bg-primary">My BUtton</Button>
  ),
  isOpenedByDefault: true,
};
