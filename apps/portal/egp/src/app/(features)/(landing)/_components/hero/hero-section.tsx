'use client';

import {
  Container,
  Title,
  Text,
  Button,
  Flex,
  Input,
  Box,
} from '@mantine/core';
import classes from './HeroImageRight.module.css';
import { IconSearch } from '@tabler/icons-react';
import { useAuth } from '@megp/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import InputWithButton from './input-with-button';
import { useGetVendorStatusQuery } from '@/app/(features)/my-workspace/registration/_api/query';

export function HeroSection() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // const { data } = useGetApproveVendorInfoQuery({});
  const { data, isLoading, isError, error } = useGetVendorStatusQuery({});

  // if (isAuthenticated) {
  //   getVendorInfo({});
  // }

  return (
    <Box className={classes.root}>
      <Box className={classes.inner}>
        <Box className={classes.content}>
          <Title className={classes.title}>
            Transform Public Procurement Through Digitalization
          </Title>
          <Text
            className={classes.description}
            mt={'md'}
            ta={{
              md: 'left',
            }}
            fz={{
              base: 'sm',
              xs: 'lg',
            }}
          >
            Empower Your Business Through MANEPS
          </Text>

          <Flex
            direction={'column'}
            rowGap={'md'}
            mt={40}
            className="w-full md:w-1/2"
          >
            <InputWithButton />
            <Flex className="w-full gap-4 items-start justify-start">
              {(data?.status === 'Initial' || data?.status === 'Draft') && (
                <Button
                  bg={'#1D8E3F'}
                  size="sm"
                  className={classes.btn}
                  onClick={() => {
                    isAuthenticated
                      ? router.push('getting-started')
                      : router.push('/auth/login');
                  }}
                >
                  Get Started
                </Button>
              )}
              {!isAuthenticated && (
                <Button
                  bg={'transparent'}
                  variant="outline"
                  size="sm"
                  color="white"
                  className={classes.btn}
                  onClick={() => router.push('/auth/login')}
                >
                  Login
                </Button>
              )}
            </Flex>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
