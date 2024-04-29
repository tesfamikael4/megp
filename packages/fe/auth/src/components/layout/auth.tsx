'use client';
import { Box, Flex, Tabs } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { ForgotPassword } from '../auth/forgot-password/forgot-password';
import { SecurityQPassReset } from '../auth/questions-reset/questions-reset';
import { PasswordReset } from '../auth/otp-reset/otp-reset';
import { SetSecurity } from '../auth/setSecurity/set-security';
import { SignUp } from '../auth/signup/signup';
import { Otp } from '../auth/verification/otp';
import { Login } from '../auth/login/login';
import { PageWrapper } from '../page-wrapper';
import classes from './auth.module.scss';

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

  const router = useRouter();
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
    <PageWrapper app={options.app as any}>
      <Flex className="w-full flex-col items-center">
        {options.app !== 'bo' ? (
          <Box className={classes.root}>
            {(options.app !== 'bo' && path[0].startsWith('login')) ||
            path[0].startsWith('signup') ? (
              <Tabs
                classNames={{
                  root: classes.tabRoot,
                  tab: classes.tab,
                  list: classes.tabList,
                  panel: classes.tabPanel,
                }}
                onChange={(value) => {
                  router.push(`${value}`);
                }}
                orientation="horizontal"
                value={path[0]}
                variant="pills"
              >
                <Tabs.List>
                  <Tabs.Tab data-direction="left" fw={500} value="login">
                    Login
                  </Tabs.Tab>
                  <Tabs.Tab data-direction="right" fw={500} value="signup">
                    Sign up
                  </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value={path[0]}>
                  <Box className="w-full">{render()}</Box>
                </Tabs.Panel>
              </Tabs>
            ) : (
              <Box className="w-full">{render()}</Box>
            )}
          </Box>
        ) : (
          <Box className={classes.root}>
            <Box className="w-full">{render()}</Box>
          </Box>
        )}
      </Flex>
    </PageWrapper>
  );
}
