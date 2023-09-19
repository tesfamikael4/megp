'use client';
import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import logger from '../../utility/logger';
import { Section } from '../section/section';
import type { EntityConfig } from './models/entity';

interface EntityListProps {
  config?: EntityConfig;
}

const defaultConfig: EntityConfig = {
  entity: 'list',
  canAdd: true,
  addPath: '/list/new',
  title: <>List</>,
};

export function EntityList({ config }: EntityListProps): React.ReactElement {
  const pathname = usePathname();

  const options = { ...defaultConfig, ...config };
  const mode = pathname === `/${options.entity}` ? 'list' : 'detail';

  logger.log(mode, options);

  const [count, setCount] = useState(0);

  // Function to increment the counter
  const increment = () => {
    setCount(count + 1);
  };

  // Function to decrement the counter
  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <Section
      action={
        options.canAdd ? (
          <Button
            component={Link}
            href={options.addPath ?? `${pathname}/new`}
            leftIcon={<IconPlus size={16} stroke={2.2} />}
          >
            Add
          </Button>
        ) : null
      }
      isCollapsible={false}
      mh="400px"
      title={options.title}
      w={mode === 'list' ? '100%' : '40%'}
    >
      {mode}

      <div>Detail form</div>
      <h1>Counter: {count}</h1>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </Section>
  );
}
