'use client';
import { Box, Divider, Flex, Title } from '@mantine/core';
import Image from 'next/image';
import { ForgotPassword } from '../auth/forgot-password/forgot-password';
import { SecurityQPassReset } from '../auth/questions-reset/questions-reset';
import { PasswordReset } from '../auth/otp-reset/otp-reset';
import { SetSecurity } from '../auth/setSecurity/set-security';
import { SignUp } from '../auth/signup/signup';
import { Otp } from '../auth/verification/otp';
import { Login } from '../auth/login/login';
import styles from './auth.module.scss';
import workflow from './workflow.png';
import ppda from './ppda.png';
import perago from './perago.png';

interface Config {
  app?: 'portal' | 'bo';
  basePath?: string;
}

const defaultConfig = {
  app: 'bo',
  basePath: '/',
};

const page = {
  login: <Login app="portal" />,
  signup: <SignUp />,
  questions: <SecurityQPassReset />,
  'forgot-password': <ForgotPassword />,
  setSecurity: <SetSecurity />,
};

export function Auth({
  path,
  config,
}: {
  path: string;
  config: Config;
}): JSX.Element {
  const options = { ...defaultConfig, ...config };
  const render = () => {
    if (options.app === 'bo' && path[0].startsWith('login')) {
      return <Login app="bo" basePath={options.basePath} />;
    } else if (options.app === 'bo' && path !== 'login') {
      return null;
    }
    if (path[0].startsWith('verification')) {
      return <Otp id={path[1]} mode="verify" />;
    } else if (path[0].startsWith('otp-reset')) {
      return <Otp id={path[1]} mode="reset" />;
    } else if (path.length > 1 && path[1].startsWith('otp-reset')) {
      return <PasswordReset otp={path[3]} verificationId={path[2]} />;
    }
    return page[path];
  };
  return (
    <div className="flex flex-row">
      <div className={styles.left_content}>
        <Image
          alt="Malawi Republic"
          className={styles.logo}
          height={100}
          src={ppda.src}
          width={100}
        />
        <Box>{render()}</Box>
        <div className="bottom-0">
          <p className={styles.footer_text}>
            Copyright &copy; 2023, Procurement and Disposal of Assets Authority.
          </p>
          <Flex className={styles.footer_text}>
            <p className="mt-2">Powered by </p>
            <Image
              alt="logo"
              className="mt-2 ml-1"
              height={30}
              src={perago.src}
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
  );
}
