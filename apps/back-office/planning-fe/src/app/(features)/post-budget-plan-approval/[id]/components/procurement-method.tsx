import { DetailActivity } from '@/app/(features)/(app)/_components/detail-activity';
import { Alert, Box, Flex } from '@mantine/core';

export const ProcurementMethod = (activity) => {
  return (
    <Box>
      <Alert title="Justification for Procurement Method" color="red">
        <Flex gap={2}>
          <p className="font-semibold w-1/4">Possible Reason :</p>
          <p className="w-4/5">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. At
            officiis, quae tempore necessitatibus placeat saepe.
          </p>
        </Flex>
        <Flex gap={2} mt={5}>
          <p className="font-semibold w-1/4">Remark :</p>
          <p className="w-4/5">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. At
            officiis, quae tempore necessitatibus placeat saepe. Lorem ipsum
            dolor sit, amet consectetur adipisicing elit. At officiis, quae
            tempore necessitatibus placeat saepe.
          </p>
        </Flex>
      </Alert>
      <Alert
        title="Justification for Supplier Target Group	"
        color="red"
        mt={10}
      >
        <Flex gap={2}>
          <p className="font-semibold w-1/4">Possible Reason :</p>
          <p className="w-4/5">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. At
            officiis, quae tempore necessitatibus placeat saepe.
          </p>
        </Flex>
        <Flex gap={2} mt={5}>
          <p className="font-semibold w-1/4">Remark :</p>
          <p className="w-4/5">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. At
            officiis, quae tempore necessitatibus placeat saepe. Lorem ipsum
            dolor sit, amet consectetur adipisicing elit. At officiis, quae
            tempore necessitatibus placeat saepe.
          </p>
        </Flex>
      </Alert>
      <h1>Test</h1>
      <DetailActivity activity={activity} page="pre" hideActivity />
    </Box>
  );
};
