import TenderCard from '@/app/(features)/_components/tender-card';
import { CardWrapper } from '@/app/(features)/_components/tender-card/card-wrapper';
import { Container, Flex } from '@mantine/core';
import React from 'react';
import EmptyPlaceholder from './empty-placeholder';

const TenderOffers = () => {
  const { data, isLoading } = (() => ({
    data: Array.from({ length: 0 }), // Empty array for now
    isLoading: false,
  }))();
  return (
    <React.Fragment>
      {data.length > 0 ? (
        <Container size={'xl'} pt={60} px={'xs'}>
          <Flex className="flex-col gap-10">
            <CardWrapper title="Latest Tenders">
              {data.map((_, index) => (
                <TenderCard key={index} color={'orange'} textColor={'white'} />
              ))}
            </CardWrapper>
            <CardWrapper title="Last Offers">
              {data.map((_, index) => (
                <TenderCard key={index} color={'yellow'} textColor={'white'} />
              ))}
            </CardWrapper>
            <CardWrapper title="Least Biders">
              {data.map((_, index) => (
                <TenderCard
                  key={index}
                  color={'red'}
                  register
                  textColor={'white'}
                />
              ))}
            </CardWrapper>
          </Flex>
        </Container>
      ) : (
        <EmptyPlaceholder />
      )}
    </React.Fragment>
  );
};

export default TenderOffers;
