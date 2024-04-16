import { Box, Container, Flex, LoadingOverlay, Text } from '@mantine/core';
import React, { memo, PropsWithChildren, useMemo } from 'react';
import PageHeader from './header';
import PageInfo from './info';
import PageActions from './actions';
import PageContent from './content';

interface Props extends PropsWithChildren {
  headerRight?: React.ReactNode;
  headerLeft?: React.ReactNode;
  headerBorder?: boolean;
  title?: string;
  info?: string;
  actions?: React.ReactNode;
  isLoading?: boolean;
  condition?: boolean;
  placeholder?: React.ReactNode;
  withBorder?: boolean;
  className?: string;
}

const PageWrapper = memo(({ children, ...props }: Props) => {
  const {
    isLoading,
    condition = true,
    placeholder,
    withBorder,
    headerLeft,
    headerRight,
    title,
    actions,
    info,
    className,
  } = props;

  return (
    <Container
      fluid
      bg={'white'}
      className={`p-4 min-h-screen relative ${className}`}
    >
      <Flex className={`flex-col pb-2 ${withBorder && 'border-b'} `}>
        <PageHeader title={title} left={headerLeft} right={headerRight} />
        <PageInfo text={info} />
        <PageActions actions={actions} />
      </Flex>
      <div className="">
        <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        <PageContent condition={condition} placeholder={placeholder}>
          {children}
        </PageContent>
      </div>
    </Container>
  );
});
PageWrapper.displayName = 'PageWrapper';
export default PageWrapper;
