import { List, Text } from '@mantine/core';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';
import { PageLoadingIndicator } from './next-progress-bar';
export default {
  title: 'page progress indicator',
  component: PageLoadingIndicator,
} as ComponentMeta<typeof PageLoadingIndicator>;
const Template: ComponentStory<typeof PageLoadingIndicator> = (args: any) => (
  <article>
    <section className="mt-10">
      <Text className="text-2xl font-medium">Page Progress Indicator</Text>
      <Text className="m-2">
        <span className="font-bold">#Have 4 property props</span>
      </Text>
      <List type={'order'} size={'sm'}>
        <List.Item>
          <span className="font-bold">color</span>: the color of page loading
          indicator
        </List.Item>
        <List.Item>
          {' '}
          <span className="font-bold">height:</span> the height of page loading
          indicator
        </List.Item>
        <List.Item>
          <span className="font-bold">speed</span>: the speed of page loading
          indicator
        </List.Item>
        <List.Item>
          <span className="font-bold">showOnShallow:</span> true/false
        </List.Item>
      </List>
    </section>

    <PageLoadingIndicator {...args} />
  </article>
);

export const Page = Template.bind({});

Page.args = {
  color: 'red',
};
