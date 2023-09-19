import { Box, Collapse, Flex, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import styles from './style.module.css';
function convertToObject(input: any, keyToCheck: string) {
  const result = {};
  for (const key in input) {
    if (input.hasOwnProperty(key)) {
      const keys = key.split('.');
      let current: any = result;
      keys.forEach((subKey, index) => {
        if (index === keys.length - 1) {
          current[subKey] = '';
        } else {
          current[subKey] = current[subKey] || {};
          current = current[subKey];
        }
      });
    }
  }
  return keyToCheck in result;
}
export const CollapsePanel = (props: any) => {
  if (!props.hasErrors) props = { ...props, hasErrors: {} };
  const [opened, { toggle }] = useDisclosure(false);
  return (
    <Box
      className={`${styles.collapsePanelRoot} ${
        convertToObject(props.hasErrors, props.id) ? styles['borderRed'] : ''
      }`}
      // sx={{
      //   borderLeft: '10px solid #3d692c',
      // }}
    >
      <Flex
        className={`${
          opened ? '' : 'border-l-8 border-l-[#3d692c]'
        } border rounded-lg p-4`}
        justify={'space-between'}
        onClick={toggle}
      >
        <Text className="font-semibold">{props.label}</Text>
        {opened ? <IconMinus size={'1rem'} /> : <IconPlus size={'1rem'} />}
      </Flex>
      <Box className={`${opened ? 'p-4' : ''}`}>
        <Collapse
          in={opened}
          transitionDuration={200}
          transitionTimingFunction="linear"
        >
          {props.children}
        </Collapse>
      </Box>
    </Box>
  );
};
