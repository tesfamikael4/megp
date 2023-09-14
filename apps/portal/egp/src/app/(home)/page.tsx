'use client';

import styles from './page.module.scss';
import {
  IconChevronDown,
  IconInbox,
  IconNews,
  IconArchive,
  IconUserEdit,
  IconCircleCheck,
  IconNotes,
  IconUserPlus,
  IconClipboardList,
  IconPackage,
  IconCalendarEvent,
  IconFiles,
  IconCheckupList,
  IconSquareLetterX,
  IconAward,
  IconSignature,
  IconUsers,
  IconUsersGroup,
  IconBuilding,
} from '@tabler/icons-react';
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Group,
  Text,
} from '@mantine/core';
import { CircleCard } from '@/shared/landing/circle-card';
import { EgpProcess } from '@/shared/landing/egp-process-svg';
import { FeaturesCard } from '@/shared/landing/features-card';
import { HighLightCard } from '@/shared/landing/highlight-card';
import { WaveSVG } from '@/shared/landing/wave-svg';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  const gettingStarted = () => {
    router.push('/egp/cms/getting-started');
  };
  const SignUp = () => {
    router.push('/auth/signup');
  };
  return (
    <Box>
      <Box className="bg-cyan-50">
        <Container size="xl" py={30}>
          <Flex>
            <Box className="w-full md:w-1/2">
              <p className={styles.heroTitle}>
                Transform public procurement through digitalization
              </p>
              <p className={styles.heroSubtitle}>
                Create more efficient and simplified procurement processes,
                realize fast time to value, promote equal opportunities for the
                business community, and better regulatory compliance.
              </p>
              <Box className="flex justify-center md:justify-start">
                <Button variant="filled" onClick={SignUp} mr={10}>
                  Sign Up
                </Button>
                <Button variant="filled" onClick={gettingStarted}>
                  Get Started
                </Button>
              </Box>
            </Box>
            <Box className="w-0 md:w-1/2">
              <EgpProcess />
            </Box>
          </Flex>
          <div className={styles.highlight}>
            <HighLightCard
              type="grid"
              data={[
                {
                  title: '0',
                  subTitle: 'Total Active Tenders',
                  icon: <IconInbox />,
                },
                {
                  title: '0',
                  subTitle: 'Tender Published Today',
                  icon: <IconNews />,
                },
                {
                  title: '0',
                  subTitle: 'Tenders Closing Today',
                  icon: <IconArchive />,
                },
                {
                  title: '0',
                  subTitle: 'Tenders Opening Today',
                  icon: <IconArchive />,
                },
              ]}
            />
            <HighLightCard
              type="grid"
              data={[
                {
                  title: '0',
                  subTitle: 'Tenders Under Evaluation',
                  icon: <IconCheckupList />,
                },
                {
                  title: '0',
                  subTitle: 'Tenders Cancelled',
                  icon: <IconSquareLetterX />,
                },
                {
                  title: '0',
                  subTitle: 'Tenders Awarded',
                  icon: <IconAward />,
                },
                {
                  title: '0',
                  subTitle: 'Contracts Signed',
                  icon: <IconSignature />,
                },
              ]}
            />
            <HighLightCard
              type="list"
              data={[
                {
                  title: '0',
                  subTitle: 'Tenders Published to Date',
                  icon: <IconInbox />,
                },
                {
                  title: '0',
                  subTitle: 'Registered Vendors',
                  icon: <IconUsersGroup />,
                },
                {
                  title: '0',
                  subTitle: 'Procuring Entities',
                  icon: <IconBuilding />,
                },
              ]}
            />
          </div>

          <Center mt={30}>
            <Link href="#features">
              <IconChevronDown className="cursor-pointer" />
            </Link>
          </Center>
        </Container>
      </Box>
      {/* Features */}
      <Box id="features">
        <Container className={styles.featureContainer}>
          <p className={styles.featureTitle}>What can we do for you today</p>
          <p className={styles.featureSubtitle}>
            The eGP platform avails various online services and solutions to
            help you participate in government procurement.
          </p>

          <Flex className={styles.featuresList}>
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
          </Flex>
          <Flex className={styles.featuresList}>
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
          </Flex>
        </Container>
      </Box>
      {/* Be a vendor */}
      <Box>
        <WaveSVG />
        <Box className="bg-cyan-50">
          <Container size="lg" p={10}>
            <Text className="text-center" fw="500" size="lg">
              STEPS TO BE A VENDOR
            </Text>
            <Flex className={styles.vendor}>
              <CircleCard
                borderColor="border-zinc-400"
                iconColor="text-zinc-400"
                icon={IconUserEdit}
                title="Sign Up"
                subTitle="Create your account"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="my-auto hidden w-12 h-12 fill-current md:block text-zinc-400"
              >
                <path d="M23.8125 9.28125L22.40625 10.71875L26.6875 15L14 15L14 17L26.6875 17L22.40625 21.28125L23.8125 22.71875L29.8125 16.71875L30.5 16L29.8125 15.28125 Z M 2 15L2 17L4 17L4 15 Z M 6 15L6 17L8 17L8 15 Z M 10 15L10 17L12 17L12 15Z"></path>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 50"
                className="block w-12 h-12 mx-auto my-2 fill-current md:hidden text-zinc-400"
              >
                <path d="M44.988281 7.984375C44.726563 7.992188 44.476563 8.101563 44.292969 8.292969L25 27.585938L5.707031 8.292969C5.519531 8.097656 5.261719 7.992188 4.992188 7.992188C4.582031 7.992188 4.21875 8.238281 4.0625 8.613281C3.910156 8.992188 4 9.421875 4.292969 9.707031L25 30.414063L45.707031 9.707031C46.003906 9.421875 46.09375 8.980469 45.9375 8.601563C45.777344 8.222656 45.402344 7.976563 44.988281 7.984375 Z M 44.988281 20.984375C44.726563 20.992188 44.476563 21.101563 44.292969 21.292969L25 40.585938L5.707031 21.292969C5.519531 21.097656 5.261719 20.992188 4.992188 20.988281C4.582031 20.992188 4.21875 21.238281 4.0625 21.613281C3.910156 21.992188 4 22.421875 4.292969 22.707031L25 43.414063L45.707031 22.707031C46.003906 22.421875 46.09375 21.980469 45.9375 21.601563C45.777344 21.222656 45.402344 20.976563 44.988281 20.984375Z"></path>
              </svg>
              <CircleCard
                borderColor="border-blue-900"
                iconColor="text-blue-900"
                icon={IconNotes}
                title="Vendor Registration"
                subTitle="Register Your Organization"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="my-auto hidden w-12 h-12 fill-current md:block text-blue-900"
              >
                <path d="M23.8125 9.28125L22.40625 10.71875L26.6875 15L14 15L14 17L26.6875 17L22.40625 21.28125L23.8125 22.71875L29.8125 16.71875L30.5 16L29.8125 15.28125 Z M 2 15L2 17L4 17L4 15 Z M 6 15L6 17L8 17L8 15 Z M 10 15L10 17L12 17L12 15Z"></path>
              </svg>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 50"
                className="block w-12 h-12 mx-auto my-2 fill-current md:hidden text-blue-900"
              >
                <path d="M44.988281 7.984375C44.726563 7.992188 44.476563 8.101563 44.292969 8.292969L25 27.585938L5.707031 8.292969C5.519531 8.097656 5.261719 7.992188 4.992188 7.992188C4.582031 7.992188 4.21875 8.238281 4.0625 8.613281C3.910156 8.992188 4 9.421875 4.292969 9.707031L25 30.414063L45.707031 9.707031C46.003906 9.421875 46.09375 8.980469 45.9375 8.601563C45.777344 8.222656 45.402344 7.976563 44.988281 7.984375 Z M 44.988281 20.984375C44.726563 20.992188 44.476563 21.101563 44.292969 21.292969L25 40.585938L5.707031 21.292969C5.519531 21.097656 5.261719 20.992188 4.992188 20.988281C4.582031 20.992188 4.21875 21.238281 4.0625 21.613281C3.910156 21.992188 4 22.421875 4.292969 22.707031L25 43.414063L45.707031 22.707031C46.003906 22.421875 46.09375 21.980469 45.9375 21.601563C45.777344 21.222656 45.402344 20.976563 44.988281 20.984375Z"></path>
              </svg>
              <CircleCard
                borderColor="border-green-300"
                iconColor="text-green-300"
                icon={IconCircleCheck}
                title="Get Approved"
                subTitle="Great! you are approved"
              />
            </Flex>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
