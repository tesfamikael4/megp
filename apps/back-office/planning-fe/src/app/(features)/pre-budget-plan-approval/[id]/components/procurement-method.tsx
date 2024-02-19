import { DetailActivity } from '@/app/(features)/(app)/_components/detail-activity';
import { Alert, Box, Flex } from '@mantine/core';

export const ProcurementMethod = (activity) => {
  return (
    <Box>
      {activity.reasons?.map((reason) => (
        <Alert
          title="Justification for Procurement Method"
          color="red"
          key={reason.id}
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
      ))}
      <DetailActivity activity={activity} page="pre" hideActivity />
    </Box>
  );
};
