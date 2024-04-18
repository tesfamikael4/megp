import { Box, Flex } from '@mantine/core';

export const CustomTable = ({
  data,
  modifiedKeys,
  toBeCompare = false,
}: {
  data: any[];
  modifiedKeys: any;
  toBeCompare?: boolean;
}) => {
  const defaultHeaderBg = 'bg-slate-200 font-semibold w-1/4 p-2';
  const modifiedHeaderBg = toBeCompare
    ? 'bg-green-200 font-semibold w-1/4 p-2'
    : 'bg-red-200 font-semibold w-1/4 p-2';
  const defaultBodyBg = 'w-3/4 p-2 group-hover:bg-slate-50';
  const modifiedBodyBg = toBeCompare
    ? 'w-3/4 p-2 bg-green-100'
    : 'w-3/4 p-2 bg-red-100';
  return (
    <Box className="w-full">
      <Flex
        direction="column"
        className="border-t border-l border-r border-gray-400"
      >
        {data.map((d) => (
          <Flex
            className="border-b border-gray-400 cursor-pointer group"
            key={d.key}
          >
            <Box
              className={
                modifiedKeys?.modifiedKeys?.includes(d.key)
                  ? modifiedHeaderBg
                  : defaultHeaderBg
              }
            >
              {d.title}
            </Box>
            <Box
              className={
                modifiedKeys?.modifiedKeys?.includes(d.key)
                  ? modifiedBodyBg
                  : defaultBodyBg
              }
            >
              {d.value}
            </Box>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};
