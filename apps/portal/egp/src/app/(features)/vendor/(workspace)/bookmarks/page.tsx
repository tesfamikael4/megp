'use client';
import React from 'react';
import { Box, Flex, Input, Select, SimpleGrid, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import TenderCard from '../../../_components/tender-card';
import { IconChevronDown, IconSearch } from '@tabler/icons-react';
import styles from '../_styles/mytenders.module.scss';
import Tenders from '../_components/list-of-tenders/tenders';

const BookmarksPage = () => {
  return <Tenders title={'Bookmarks'} />;
};

export default BookmarksPage;
