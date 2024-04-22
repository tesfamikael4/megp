'use client';
import { useLazyGetRulesQuery } from '@/store/api/rule/rule.api';
import {
  Loader,
  Skeleton,
  Stack,
  Button,
  Flex,
  TextInput,
  Pagination,
  Group,
} from '@mantine/core';
import { Section } from './_component/section-chevron.component';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import RuleDesigner from './_component/rule-designer';
import { IconCaretDown, IconCirclePlus, IconSearch } from '@tabler/icons-react';
import { useDebouncedState } from '@mantine/hooks';
z;

function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
  if (totalItems <= 0 || itemsPerPage <= 0) {
    return 0;
  }

  return Math.ceil(totalItems / itemsPerPage);
}

export default function Rules() {
  const [getRules, { data: rules, isLoading: isGettingRules }] =
    useLazyGetRulesQuery();
  const { id } = useParams();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const totalPages = calculateTotalPages(rules?.total ?? 0, perPage);
  const [search, setSearch] = useDebouncedState('', 500);

  useEffect(() => {
    const from = (page - 1) * perPage;

    getRules({
      skip: from,
      take: perPage,
      includes: ['rules', 'possibleReasons'],
      orderBy: [
        {
          column: 'createdAt',
          direction: 'DESC',
        },
      ],
      where: search
        ? [
            [
              {
                column: 'name',
                value: search,
                operator: 'ILIKE',
              },
            ],
          ]
        : [],
    });
  }, [id, search, page]);

  if (isGettingRules || !rules) {
    return (
      <>
        <Skeleton height={48} radius="sm" />
        <Skeleton height={48} mt={18} radius="sm" />
        <Skeleton height={48} mt={18} radius={'sm'} />
        <Skeleton height={48} mt={18} radius={'sm'} />
        <Skeleton height={48} mt={18} radius={'sm'} />
      </>
    );
  }

  return (
    <Stack>
      <Flex justify={'space-between'}>
        <Button
          onClick={() => router.push('/rule-designer/new')}
          leftSection={<IconCirclePlus />}
          className="mr-auto"
        >
          Add new rule
        </Button>
        <TextInput
          className="w-1/4"
          leftSection={<IconSearch />}
          placeholder="Search here"
          onKeyUp={(e) => setSearch((e as any).target.value)}
        />
      </Flex>
      {rules &&
        rules?.items?.map((rule) => (
          <Section key={rule?.id} title={rule?.name} defaultCollapsed>
            <RuleDesigner rule={rule} mode={'detail'} />
          </Section>
        ))}
      <Group className="mt-2" justify="end">
        <Pagination
          onChange={setPage}
          size="sm"
          total={totalPages}
          value={page}
          withEdges
        />
      </Group>
    </Stack>
  );
}
