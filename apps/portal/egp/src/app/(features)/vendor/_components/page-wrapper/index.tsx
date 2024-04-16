import { Box, Container, Flex, LoadingOverlay, Text } from '@mantine/core';
import React, { PropsWithChildren } from 'react';
import EmptyDataPlaceholder from '../empty-data-placeholder';

interface Props extends PropsWithChildren {
  header?: React.ReactNode;
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
}

const PageWrapper = (props: Props) => {
  return (
    <Container
      fluid
      bg={'white'}
      className="p-4 min-h-screen rounded-md relative"
    >
      <Flex className={`flex-col ${props.headerBorder && 'border-b'}`}>
        {props.header
          ? props.header
          : (props.title || props.headerLeft || props.headerLeft) && (
              <Flex className=" justify-between items-center p-4 ">
                <div className="w-fit">
                  {props.title && (
                    <Text fw={600} fz={20} c={'primary.7'}>
                      {props.title}
                    </Text>
                  )}
                  {props.headerLeft && props.headerLeft}
                </div>
                <div className="w-fit">
                  {props.headerRight && props.headerRight}
                </div>
              </Flex>
            )}
        {props.info && (
          <div className="px-4">
            <Text fz={14} c="#37415199">
              {props.info}
            </Text>
          </div>
        )}
        {props.actions && (
          <Flex className="p-4" justify="flex-end">
            {props.actions}
          </Flex>
        )}
      </Flex>
      <div className="relative w-full">
        <LoadingOverlay
          visible={props.isLoading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />

        {props.condition !== undefined ? (
          props.condition === true ? (
            <div className="p-4">{props.children}</div>
          ) : (
            props.placeholder ?? <EmptyDataPlaceholder />
          )
        ) : (
          <div className="p-4">{props.children}</div>
        )}
      </div>
    </Container>
  );
};

export default PageWrapper;
