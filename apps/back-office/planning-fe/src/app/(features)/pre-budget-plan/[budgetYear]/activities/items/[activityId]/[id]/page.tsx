import { Box, Flex, Group, Text } from '@mantine/core';
import { Section } from '@megp/core-fe';
import { IconCoins, IconGift } from '@tabler/icons-react';
import { FormDetail } from '../_components/form-detail';

export default function ItemsDetail() {
  return (
    <Box>
      <Section
        title={
          <>
            <Flex gap="xl">
              <Text fw={500}>Activity: Alfreds Futterkiste</Text>
              <Group>
                <IconCoins />
                <Text>USD 784,451.25</Text>
              </Group>
              <Group>
                <IconGift />
                <Text>Preference: IMB</Text>
              </Group>
            </Flex>
          </>
        }
      >
        <FormDetail mode="detail" />
      </Section>
    </Box>
  );
}
