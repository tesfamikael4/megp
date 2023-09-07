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
import { EgpProcess } from './_shared/landing/egp-process-svg';
import { HighLightCard } from './_shared/landing/highlight-card';
import { CircleCard } from './_shared/landing/circle-card';
import { WaveSVG } from './_shared/landing/wave-svg';
import { FeaturesCard } from './_shared/landing/features-card';
export default function Home() {
  const data = [
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
  ];
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
              <Group>
                <Button variant="filled">Sign Up</Button>
                <Button variant="filled">Get Started</Button>
              </Group>
            </Box>
            <Box className="w-0 md:w-1/2">
              <EgpProcess />
            </Box>
          </Flex>
          <div className={styles.highlight}>
            <HighLightCard type="grid" data={data} />
            <HighLightCard type="grid" data={data} />
            <HighLightCard type="grid" data={data} />
          </div>

          <Center mt={30}>
            <IconChevronDown className="cursor-pointer" />
          </Center>
        </Container>
      </Box>
      {/* Features */}
      <Box>
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
              <CircleCard
                borderColor="border-blue-900"
                iconColor="text-blue-900"
                icon={IconNotes}
                title="Vendor Registration"
                subTitle="Register Your Organization"
              />
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
