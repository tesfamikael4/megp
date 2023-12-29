import { Box, Flex } from '@mantine/core';
export default function PreBudgetPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex gap="md">
      <Box className="w-3/5">{children}</Box>
      <Box className="w-2/5">
        <h1>work flow</h1>
      </Box>
    </Flex>
  );
}
