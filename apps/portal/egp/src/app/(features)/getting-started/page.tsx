'use client';

import { Box, Button, Center, Container, Flex, Text } from '@mantine/core';
import Image from 'next/image';
import { StepsCard } from './steps-card';
import {
  IconBuildingBank,
  IconSettings,
  IconUserEdit,
  IconWorldWww,
} from '@tabler/icons-react';
import styles from './page.module.scss';
import { useRouter } from 'next/navigation';
import Footer from '../(landing)/_components/footer';

export default function GettingStarted() {
  const router = useRouter();
  return (
    <>
      <Container className={styles.container}>
        {/* <Box className={styles.about_card}>
        <p className={styles.about_title}>About eGP</p>
        <Text mb="md">
          eGP is a national electronic government procurement portal that uses
          an electronic system to handle transactions in the public procurement
          process. eGP is designed with innovative measures using information
          and communication technology to streamline the public procurement with
          greater efficiency that breaks down the physical barriers of space and
          time to have a transparent procurement process through a wider access
          to information and markets. eGP helps to ensure the provision of equal
          treatment to all bidders, applying same rule of law, increase
          accountability of participants in the procurement process and at the
          same time raising awareness on the general public about the expenses
          of the government.
        </Text>
        <Center>
          <Image src="/ppda.png" width={50} height={50} alt="logo " />
        </Center>
      </Box> */}

        <p className={styles.get_started_title}>Get Started</p>
        <p className={styles.get_started_description}>
          We are excited to guide you through the eGP system. The steps are
          discussed below and are easy to follow.
        </p>

        <StepsCard
          align="left"
          step="Step 1"
          title="Land on Portal"
          icon={IconWorldWww}
          isStart={true}
          description="Once you have opened the www.egp.ppa.gov.mw portal, you can access the following public information about government procurement."
          lists={[
            'Obtain annual procurement plans of government agencies so that the business community gets prepared and respond more effectively.',
            'Access tender notices of various government agencies for the procurement of goods, services and works.',
            'Provide access to tender opening minutes, evaluation reports, contract awards, and other procurement information.',
            'Register your company in the national vendors list to participate in government procurement.',
            'Access registered local and international companies and traders from the national vendors list.',
            'Identify vendors that are debarred from participating in government procurement.',
            'Access various electronic resources related to public procurement',
          ]}
        />
        <StepsCard
          align="right"
          step="Step 2"
          title="Sign Up"
          icon={IconBuildingBank}
          lists={[
            'Once you land on the e-GP portal, click on the sign-up link located at the left corner of the system.',
            'Enter a user name (valid email) and password in the required fields and click on Register button,',
            'Then you will receive a confirmation email to the address you provided, click on the Confirm button and you will be redirected to the e-GP portal as a registered user.',
          ]}
        />
        <StepsCard
          icon={IconUserEdit}
          title="Vendor Registration"
          step="Step 3"
          align="left"
          lists={[
            'If you wish to be a vendor, you will be required to register your organization as a vendor by clicking on Registration Services link at the top menu.',
            'You will find vendor registration form and you fill all the details in the provided fields and also attach required legal documents.',
            'Once you finish filling the form, click on Register and wait for the vendor approval. Once you receive the vendor registration approval notification, as a registered vendor, you can participate in public procurement.',
          ]}
        />

        <StepsCard
          title="Using vendor tools"
          icon={IconSettings}
          align="right"
          step="Step 4"
          isEnd={true}
          description="Once you have registered as a vendor and get approved by FPPA, you can use the following features to participate in public procurement."
          lists={[
            'Search for active tender opportunities, and get registered to a tender to access the bidding document free of charge or by paying participation fee. The system will provide you with a unique secrete key or keys to participate in the procurement process. If the tender is a two-envelop tender, you will receive two keys to lock (encrypt) your technical and financial documents separately. You have to protect and keep the key(s) confidential; without it your participation cannot be completed.',
            'Once you get the bidding document, you can send clarification questions, participate in pre-bid conference and conduct site visits, if it is allowed.',
            'Furnish bid security from banks before the bid closing deadline, if it is requested.',
            'Prepare your technical response and financial offer in the system and submit to the procuring entity before the bid closing deadline.',
            'Participate in the bid opening virtual session. Share you secret key with the bid opening committee so that they able to open your bid. With your secret key, your bid will remain closed (encrypted). Failure to provide the appropriate key during the opening session will invalidate your bid.',
            'Receive clarification questions, evaluation results, and award notice. File compliant if you are not satisfied with the evaluation process and results in line with the public procurement directive.',
            'Manage your contracts using the tools available to submit various documents related to inspections, clearing, delivery, receiving, and invoicing as appropriate. You can also track contractual issues, performance, and activities.',
          ]}
        />
        <Flex justify={'flex-end'} w={'100%'}>
          <Button onClick={() => router.push('/vendor/registration/new/basic')}>
            Continue
          </Button>
        </Flex>
      </Container>
      <Footer />
    </>
  );
}
