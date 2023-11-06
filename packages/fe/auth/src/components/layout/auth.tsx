'use client';
import { Box, Divider, Flex, MantineProvider, Title } from '@mantine/core';
import '@mantine/core/styles.css';
import { theme as baseTheme } from '@megp/theme/mantine';
import Image from 'next/image';
import ForgotPassword from '../auth/forgot-password/forgot-password';
import Signin from '../auth/login/login';
import SecurityQPassReset from '../auth/questions-reset/questions-reset';
import PasswordReset from '../auth/reset-password/reset-password';
import SetSecurity from '../auth/setSecurity/set-security';
import SignUp from '../auth/signup/signup';
import Otp from '../auth/verification/otp';
import styles from './auth.module.scss';
import workflow from './workflow.png';

const page = {
  login: <Signin />,
  signup: <SignUp />,
  questions: <SecurityQPassReset />,
  'reset-password': <PasswordReset />,
  'forgot-password': <ForgotPassword />,
  'set-security': <SetSecurity />,
};

export function Auth({
  path,
  theme = baseTheme,
}: {
  path: string;
  theme?: any;
}): JSX.Element {
  const render = path[0].startsWith('verification') ? (
    <Otp id={path[1]} />
  ) : (
    page[path]
  );
  return (
    <MantineProvider theme={theme}>
      <div className="flex flex-row">
        <div className={styles.left_content}>
          <Image
            alt="Malawi Republic"
            className={styles.logo}
            height={100}
            src="/ppda.png"
            width={100}
          />
          <Box>{render}</Box>
          <div className="absolute bottom-0">
            <p className={styles.footer_text}>
              Copyright &copy; 2023, Procurement and Disposal of Assets
              Authority.
            </p>
            <Flex className={styles.footer_text}>
              <p className="mt-2">Powered by </p>
              <Image
                alt="logo"
                className="mt-2 ml-1"
                height={30}
                src="/perago.png"
                width={80}
              />
            </Flex>
          </div>
        </div>
        <div className={styles.right_content}>
          <div
            className={styles.workflow}
            style={{ backgroundImage: `url(${workflow.src})` }}
          />
          <Title className={styles.welcome}>Welcome to eGP Malawi</Title>
          <Divider my="sm" />
          <div className="w-2/3 bg-white rounded-sm">
            <p className="text-center justify-center text-lg">
              The eGP Malawi Platform is a web-based, collaborative system to
              manage the full lifecycle of a tendering and contract management
              process, for both government agencies and suppliers. It offers a
              secure, interactive, dynamic environment for procurements of any
              nature, complexity or value, enforcing compliance to regulations,
              and encouraging recognized best practices.
            </p>
          </div>
        </div>
      </div>
    </MantineProvider>
  );
}
