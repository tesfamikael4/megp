import { Badge, Box, Flex, Text } from '@mantine/core';
import { Section } from '@megp/core-fe';

export const TenderOverView = () => {
  return (
    <Section
      title="Construction of Community Center"
      subTitle="RFQ2024001"
      collapsible={false}
    >
      <Flex gap={20}>
        <Box className="w-full">
          <Flex gap={5}>
            <Box>
              <Text fw={500} size="sm">
                Envelope :
              </Text>
              <Text fw={500} size="sm">
                Bid :
              </Text>
            </Box>
            <Box>
              <Badge variant="outline" size="xs" color="gray">
                Single Envelope
              </Badge>
              <Text>
                <Badge variant="outline" size="xs" color="gray">
                  Item Based
                </Badge>
              </Text>
            </Box>
          </Flex>
        </Box>
        <Box className="w-full">
          <Flex gap={5}>
            <Box>
              <Text fw={500} size="sm">
                Evaluation method :
              </Text>
              <Text fw={500} size="sm">
                Milestone :
              </Text>
            </Box>
            <Box>
              <Text size="sm">Compliance Based</Text>
              <Text size="sm">Financial Opening - In Progress</Text>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Section>
  );
};
