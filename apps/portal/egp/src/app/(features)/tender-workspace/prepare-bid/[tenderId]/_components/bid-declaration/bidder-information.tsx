import { Box, Flex } from '@mantine/core';
import { Section } from '@megp/core-fe';

const BidderInformation = () => {
  return (
    <Section title="Bidder Information" defaultCollapsed={true}>
      <Box className="w-full">
        <Flex
          direction="column"
          className="border-t border-l border-r border-gray-400"
        >
          <Flex className="border-b border-gray-400 cursor-pointer group">
            <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
              Bidder Legal Name
            </Box>
            <Box className="w-3/4 p-2 group-hover:bg-slate-50"></Box>
          </Flex>
          <Flex className="border-b border-gray-400 cursor-pointer group">
            <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
              Country registration
            </Box>
            <Box className="w-3/4 p-2 group-hover:bg-slate-50"></Box>
          </Flex>
          <Flex className="border-b border-gray-400 cursor-pointer group">
            <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
              Year of registration
            </Box>
            <Box className="w-3/4 p-2 group-hover:bg-slate-50"></Box>
          </Flex>
          <Flex className="border-b border-gray-400 cursor-pointer group">
            <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
              <Box className="flex justify-between">
                <Box>Bidder Address</Box>
              </Box>
            </Box>
            <Box className="w-3/4 p-2 group-hover:bg-slate-50">
              <Box className="my-2">
                <Flex className="border-b border-gray-400 cursor-pointer group">
                  <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                    Physical address
                  </Box>
                  <Box className="w-3/4 p-2 group-hover:bg-slate-50"></Box>
                </Flex>
                <Flex className="border-b border-gray-400 cursor-pointer group">
                  <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                    City
                  </Box>
                  <Box className="w-3/4 p-2 group-hover:bg-slate-50"></Box>
                </Flex>
                <Flex className="border-b border-gray-400 cursor-pointer group">
                  <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                    Region/state
                  </Box>
                  <Box className="w-3/4 p-2 group-hover:bg-slate-50"></Box>
                </Flex>
                <Flex className="border-b border-gray-400 cursor-pointer group">
                  <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                    Country
                  </Box>
                  <Box className="w-3/4 p-2 group-hover:bg-slate-50"></Box>
                </Flex>
                <Flex className="border-b border-gray-400 cursor-pointer group">
                  <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                    Phone number
                  </Box>
                  <Box className="w-3/4 p-2 group-hover:bg-slate-50"></Box>
                </Flex>
                <Flex className="border-b border-gray-400 cursor-pointer group">
                  <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                    Fax
                  </Box>
                  <Box className="w-3/4 p-2 group-hover:bg-slate-50"></Box>
                </Flex>
                <Flex className="border-b border-gray-400 cursor-pointer group">
                  <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                    Email
                  </Box>
                  <Box className="w-3/4 p-2 group-hover:bg-slate-50"></Box>
                </Flex>
              </Box>
            </Box>
          </Flex>
        </Flex>
      </Box>
    </Section>
  );
};

export default BidderInformation;
