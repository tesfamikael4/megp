'use client';
import { Box, Flex, Tabs } from '@mantine/core';
import { useRouter } from 'next/navigation';
import React from 'react';
import { AuthSlug } from '../../_model/auth';
import classes from './auth-card-styles.module.scss';
import LoginForm from '../auth-form/login';
import RegistrationForm from '../auth-form/register';
import OtpForm from '../auth-form/otp';
import ResetPasswordForm from '../auth-form/reset-password';

interface AuthCardProps {
  type: AuthSlug;
}
const AuthCard = ({ type }: AuthCardProps) => {
  const router = useRouter();

  return (
    <Box className={classes.root}>
      <Flex className="py-4">
        <Box>
          <Tabs
            classNames={{
              tab: classes.tab,
              list: classes.tabList,
              panel: classes.tabPanel,
            }}
            variant="pills"
            value={type}
            onChange={(value) => router.push(`${value}`)}
          >
            {type === 'login' || type === 'register' ? (
              <Tabs.List>
                <Tabs.Tab data-direction="left" value="login" fw={500}>
                  Login
                </Tabs.Tab>
                <Tabs.Tab data-direction="right" value="register" fw={500}>
                  Sign up
                </Tabs.Tab>
              </Tabs.List>
            ) : (
              ''
            )}

            <Tabs.Panel value="login">
              <LoginForm />
            </Tabs.Panel>
            <Tabs.Panel value="register">
              <RegistrationForm />
            </Tabs.Panel>
            <Tabs.Panel value="otp">
              <OtpForm />
            </Tabs.Panel>
            <Tabs.Panel value="reset-password">
              <ResetPasswordForm />
            </Tabs.Panel>
          </Tabs>
        </Box>
      </Flex>
    </Box>
  );
};

export default AuthCard;
