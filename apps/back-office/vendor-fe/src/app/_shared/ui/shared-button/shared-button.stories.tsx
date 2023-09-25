// Button.stories.js|jsx|ts|tsx
import { action } from '@storybook/addon-actions';
import * as React from 'react';
import { SharedButton } from './shared-button';
export default {
  title: 'Button',
  component: SharedButton,
};

export const defaultView = () => (
  <SharedButton onClick={action('button-click')}>Button</SharedButton>
);

const Template = (args) => ({
  //👇 Your template goes here
});

export const Primary = Template.bind({});
Primary.args = {
  variant: 'primary',
};
