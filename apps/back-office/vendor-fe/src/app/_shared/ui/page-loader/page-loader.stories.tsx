import { List, Text } from '@mantine/core';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';
import { PageLoader } from './page-loader';

export default {
  title: 'page Loading indicator',
  component: PageLoader,
} as ComponentMeta<typeof PageLoader>;
const Template: ComponentStory<typeof PageLoader> = (args: any) => (
  <article>
    <section className="mt-10">
      <Text className="text-2xl font-medium">Page Loader</Text>

      <Text className="m-2">
        {' '}
        <span className="font-bold">#Have 5 property props</span>
      </Text>
      <List type={'order'} size={'sm'}>
        <List.Item>
          <span className="font-bold">size:</span> the size of the page loading
          it can be xs|sm|md|lg|xl
        </List.Item>
        <List.Item>
          {' '}
          <span className="font-bold">color:</span> the color of loader
        </List.Item>
        <List.Item>
          <span className="font-bold">variant:</span> loader type it could be
          oval or dots or bars
        </List.Item>
        <List.Item>
          <span className="font-bold">overlayOpacity:</span> Sets overlay color,
          defaults to theme.white in light theme and to theme.colors.dark[5] in
          dark theme
        </List.Item>
        <List.Item>
          {' '}
          <span className="font-bold">overlayColor:</span> Sets overlay opacity
          example 0.75
        </List.Item>
      </List>
    </section>
    <PageLoader {...args} />
  </article>
);

export const Page = Template.bind({});

Page.args = {};
