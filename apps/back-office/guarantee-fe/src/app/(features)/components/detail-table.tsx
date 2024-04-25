import { Box, Flex } from '@mantine/core';

interface DetailTableItem {
  data: Record<string, string>[];
}

export const DetailTable = ({ data }: DetailTableItem) => {
  return (
    <>
      <Box className="w-full">
        <Flex
          direction="column"
          className="border-t border-l border-r border-gray-400"
        >
          {data.map((d) =>
            d.key ? (
              <Flex
                key={d.key}
                className="border-b border-gray-400 cursor-pointer group"
              >
                <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                  {d.key}
                </Box>
                <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                  {d.value}
                </Box>
              </Flex>
            ) : null,
          )}
        </Flex>
      </Box>
    </>
  );
};
