'use client';

import { CircleCard } from './_components/circle-card';
import { EgpProcess } from './_components/egp-process-svg';
import { FeaturesCard } from './_components/features-card';
import { HighLightCard } from './_components/highlight-card';
import { WaveSVG } from './_components/wave-svg';
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  SimpleGrid,
  Text,
} from '@mantine/core';
import {
  IconArchive,
  IconArrowRight,
  IconAward,
  IconBuilding,
  IconCalendarEvent,
  IconCheckupList,
  IconChevronDown,
  IconCircleCheck,
  IconClipboardList,
  IconFiles,
  IconInbox,
  IconNews,
  IconNotes,
  IconPackage,
  IconSignature,
  IconSquareLetterX,
  IconUserEdit,
  IconUserPlus,
  IconUsersGroup,
} from '@tabler/icons-react';
import Link from 'next/link';
import styles from './page.module.scss';
import { HeroSection } from './_components/hero/hero-section';
import { StepsSection } from './_components/steps/steps-section';
import TenderCard from './_components/tender-card';
import { useAuth } from '@megp/auth';

export default function Home() {
  const { getUserInfo, isAuthenticated, logOut, user } = useAuth();

  return (
    <Box>
      <HeroSection />
      {!user && (
        <>
          <Box id="features">
            <Flex
              direction={'column'}
              justify={'center'}
              my={40}
              // className="px-10 xl:px-5 w-full xl:w-[80%] mx-auto"
            >
              <Container size={'xl'}>
                <p className={styles.featureTitle}>
                  Access Business Opportunities{' '}
                </p>
                <p className={styles.featureSubtitle}>
                  The eGP platform avails various online services and solutions
                  to help you participate in government procurement.
                </p>
                <SimpleGrid
                  mt={60}
                  cols={{ base: 1, sm: 2, md: 3 }}
                  spacing={{ base: 'xl', md: 60 }}
                  verticalSpacing={{ base: 'xl', md: 50 }}
                  className="mb-3"
                >
                  <FeaturesCard
                    icon={<IconUserPlus />}
                    color="red"
                    title="Vendor Registration"
                    description=" Register your company in the national suppliers list to be able to identify government procurement opportunities and participate in tenders. "
                  />
                  <FeaturesCard
                    icon={<IconClipboardList />}
                    color="cyan"
                    title="Registered Vendor List"
                    description=" Access registered companies from the national suppliers list. Identify suppliers that are debarred from participating in government procurement. "
                  />
                  <FeaturesCard
                    icon={<IconCalendarEvent />}
                    color="green"
                    title="Procurement Plans"
                    description=" Publish annual procurement plans of government agencies so that the business community gets prepared and respond more effectively. "
                  />

                  <FeaturesCard
                    icon={<IconNotes />}
                    color="yellow"
                    title="Tenders"
                    description=" Access tender notices of various government agencies for the procurement of goods, services and works. "
                  />
                  <FeaturesCard
                    icon={<IconFiles />}
                    color="red"
                    title="Procurement Information"
                    description=" Provide access to tender statistics, tender opening minutes, evaluation reports, contract awards, and other procurement information. "
                  />
                  <FeaturesCard
                    icon={<IconPackage />}
                    color="cyan"
                    title="Resources"
                    description=" Access various electronic resources related public procurement legislation, standard bidding documents, eGP materials and the like.   "
                  />
                </SimpleGrid>
              </Container>
            </Flex>
          </Box>
        </>
      )}
      <StepsSection />
      {/* Latest tenders */}
      <Box bg={'#F5FBFE'} pt={60}>
        <Container size={'xl'}>
          <CardWrapper title="Latest Tenders">
            {Array.from({ length: 4 }).map((_, index) => (
              <TenderCard key={index} color={'orange'} />
            ))}
          </CardWrapper>
          <CardWrapper title="Last Offers">
            {Array.from({ length: 4 }).map((_, index) => (
              <TenderCard key={index} color={'#F0FFF3'} textColor={'black'} />
            ))}
          </CardWrapper>
          <CardWrapper title="Least Biders">
            {Array.from({ length: 4 }).map((_, index) => (
              <TenderCard key={index} color={'red'} register />
            ))}
          </CardWrapper>
        </Container>
      </Box>
    </Box>
  );
}

const CardWrapper = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <Flex direction={'column'} justify={'center'} py={20}>
        <Text
          className=" pl-3 border-l-4 border-green-300 flex items-center font-semibold text-xl leading-6 tracking-tight "
          h={40}
        >
          {title}
        </Text>
        <SimpleGrid
          mt={20}
          cols={{ base: 1, sm: 1, md: 2, lg: 2 }}
          spacing={{ base: 'xl', sm: 60, md: 30 }}
          verticalSpacing={{ base: 'xl', md: 50 }}
        >
          {children}
        </SimpleGrid>

        <Button
          variant="subtle"
          rightSection={<IconArrowRight size={18} color="green" stroke={1.6} />}
          className="self-end mt-5"
        >
          View All
        </Button>
      </Flex>
    </>
  );
};
