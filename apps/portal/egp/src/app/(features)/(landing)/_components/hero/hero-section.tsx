'use client';

import { Container, Title, Text, Button, Flex, Input } from '@mantine/core';
import classes from './HeroImageRight.module.css';
import { IconSearch } from '@tabler/icons-react';
import { useAuth } from '@megp/auth';
import { useRouter } from 'next/navigation';

export function HeroSection() {
  const { user } = useAuth();
  const router = useRouter();
  return (
    <div className={classes.root}>
      <Container size="xl">
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              Transform public procurement through digitalization
            </Title>
            <Text className={classes.description} mt={16}>
              Empower Your Business Through Electronic Public Procurement
            </Text>

            <Flex direction={'column'} rowGap={32} mt={80}>
              <Flex>
                <Input
                  placeholder="Search Tenders Here"
                  leftSection={<IconSearch />}
                  className="w-1/2 flex-end"
                  rightSectionWidth={100}
                  rightSectionPointerEvents="all"
                  rightSection={
                    <Button
                      className={'-mr-6 rounded-none rounded-r cursor-pointer'}
                      bg={'green'}
                      size="sm"
                    >
                      Search
                    </Button>
                  }
                />
              </Flex>
              <Flex columnGap={16}>
                <Button
                  bg={'green'}
                  size="sm"
                  w={'208px'}
                  onClick={() => {
                    user
                      ? router.push('/vendor/registration/new/basic')
                      : router.push('/auth/login');
                  }}
                >
                  Get Started
                </Button>
                {!user && (
                  <Button
                    bg={'transparent'}
                    variant="outline"
                    size="sm"
                    color="white"
                    w={'208px'}
                    onClick={() => router.push('/auth/login')}
                  >
                    Login
                  </Button>
                )}
              </Flex>
            </Flex>
          </div>
        </div>
      </Container>
    </div>
  );
}
