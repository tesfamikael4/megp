'use client';
import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import logger from '../../utility/logger';
import { toTitleCase } from '../../utility/string';
import { Section } from '../section/section';
import type { EntityConfig } from './models/entity';

interface EntityListProps {
  config?: EntityConfig;
  mode?: 'list' | 'detail';
}

const defaultConfig: EntityConfig = {
  entity: 'list',
  canAdd: true,
  addPath: '/list/new',
  title: <>List</>,
};

export function EntityList({
  config,
  mode = 'list',
}: EntityListProps): React.ReactElement {
  const pathname = usePathname();

  const options = { ...defaultConfig, ...config };
  logger.log(pathname);
  return (
    <Section
      action={
        options.canAdd ? (
          <Button
            component={Link}
            href={options.addPath ?? `${pathname}/new`}
            leftIcon={<IconPlus size={16} stroke={2.2} />}
          >
            Add {toTitleCase(options.entity)}
          </Button>
        ) : null
      }
      isCollapsible={false}
      mh="400px"
      title={options.title}
    >
      {mode}aas
    </Section>
  );
}
