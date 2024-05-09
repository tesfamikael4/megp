import { useLazyVenderByRegistrationIdQuery } from '@/app/(features)/tender-workspace/_api/bid-attribute-datas';
import { Box, Flex } from '@mantine/core';
import { useAuth } from '@megp/auth';
import { Section } from '@megp/core-fe';
import { useEffect } from 'react';

const BidderInformation = () => {
  const { user } = useAuth();
  const [trigger, { data: vendor, isLoading }] =
    useLazyVenderByRegistrationIdQuery();
  useEffect(() => {
    if (user && user.organizations) {
      trigger(user.organizations[0].organization.code);
    }
  }, [trigger, user]);
  return (
    <Section title="Bidder Information" defaultCollapsed={true}>
      <Box className="w-full">
        {vendor && (
          <Flex
            direction="column"
            className="border-t border-l border-r border-gray-400"
          >
            <Flex className="border-b border-gray-400 cursor-pointer group">
              <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                Bidder Legal Name
              </Box>
              <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                {vendor.name}
              </Box>
            </Flex>
            <Flex className="border-b border-gray-400 cursor-pointer group">
              <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                Country registration
              </Box>
              <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                {vendor.countryOfRegistration}
              </Box>
            </Flex>
            <Flex className="border-b border-gray-400 cursor-pointer group">
              <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                Year of registration
              </Box>
              <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                {vendor.registrationIssuedDate}
              </Box>
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
                    <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                      {vendor.physicalAddress}
                    </Box>
                  </Flex>
                  <Flex className="border-b border-gray-400 cursor-pointer group">
                    <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                      City
                    </Box>
                    <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                      {vendor.city}
                    </Box>
                  </Flex>
                  <Flex className="border-b border-gray-400 cursor-pointer group">
                    <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                      Region/state
                    </Box>
                    <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                      {vendor.region}
                    </Box>
                  </Flex>
                  <Flex className="border-b border-gray-400 cursor-pointer group">
                    <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                      Distinct
                    </Box>
                    <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                      {vendor.district}
                    </Box>
                  </Flex>
                  <Flex className="border-b border-gray-400 cursor-pointer group">
                    <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                      Country
                    </Box>
                    <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                      {vendor.countryOfRegistration}
                    </Box>
                  </Flex>
                  <Flex className="border-b border-gray-400 cursor-pointer group">
                    <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                      Phone number
                    </Box>
                    <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                      {vendor.telephone}
                    </Box>
                  </Flex>
                  <Flex className="border-b border-gray-400 cursor-pointer group">
                    <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                      Fax
                    </Box>
                    <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                      {vendor.fax}
                    </Box>
                  </Flex>
                  <Flex className="border-b border-gray-400 cursor-pointer group">
                    <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                      Postal Code
                    </Box>
                    <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                      {vendor.postalAddress}
                    </Box>
                  </Flex>
                  <Flex className="border-b border-gray-400 cursor-pointer group">
                    <Box className="bg-slate-200 font-semibold w-1/4 p-2 ">
                      Email
                    </Box>
                    <Box className="w-3/4 p-2 group-hover:bg-slate-50">
                      {vendor.primaryEmail}
                    </Box>
                  </Flex>
                </Box>
              </Box>
            </Flex>
          </Flex>
        )}
      </Box>
    </Section>
  );
};

export default BidderInformation;
