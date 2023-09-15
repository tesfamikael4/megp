'use client';
import { Box } from '@mantine/core';
import Link from 'next/link';
import { useState } from 'react';
import { useSelectedLayoutSegment } from 'next/navigation';
import logger from '../../utility/logger';

interface EntityListProps {
  config: any;
  mode?: 'list' | 'detail';
}

export function EntityList({
  config,
  mode = 'list',
}: EntityListProps): React.ReactElement {
  const segment = useSelectedLayoutSegment();

  logger.log(config, mode);

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
    <Box className="border-green-700 border w-full flex gap-4">
      <div>
        Entity Table mode : {mode}=== {segment}
      </div>
      <ul>
        <li>
          <Link href="/groups/new">new</Link>
        </li>
        <li>
          <Link href="/groups/1">1</Link>
        </li>
        <li>
          <Link href="/groups/2">2</Link>
        </li>
        <li>
          <Link href="/groups/3">3</Link>
        </li>
      </ul>

      <h1>Counter: {count}</h1>
      <button onClick={increment} type="button">
        Increment
      </button>
      <button onClick={decrement} type="button">
        Decrement
      </button>
    </Box>
  );
}
